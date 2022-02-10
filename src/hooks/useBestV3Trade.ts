import { Currency, CurrencyAmount, TradeType } from '@uniswap/sdk-core'
import { encodeRouteToPath, Route, Trade } from '@uniswap/v3-sdk'
import { SupportedChainId } from 'constants/chains'
import { BigNumber } from 'ethers'
import { useMemo } from 'react'
import { useRoutingAPITrade } from 'state/routing/useRoutingAPITrade'
import { useRoutingAPIEnabled } from 'state/user/hooks'
import { useSingleContractMultipleData } from '../state/multicall/hooks'
import { useAllV3Routes } from './useAllV3Routes'
import { useClientSideV3Trade } from './useClientSideV3Trade'
import { useV3Quoter } from './useContract'
import useDebounce from './useDebounce'
import useIsWindowVisible from './useIsWindowVisible'
import { useActiveWeb3React } from './web3'

export enum V3TradeState {
  LOADING,
  INVALID,
  NO_ROUTE_FOUND,
  VALID,
  SYNCING,
}
/**
 * Returns the best v3 trade for a desired swap.
 * Uses optimized routes from the Routing API and falls back to the v3 router.
 * @param tradeType whether the swap is an exact in/out
 * @param amountSpecified the exact amount to swap in/out
 * @param otherCurrency the desired output/payment currency
 */
export function useBestV3Trade(
  tradeType: TradeType,
  amountSpecified?: CurrencyAmount<Currency>,
  otherCurrency?: Currency
): {
  state: V3TradeState
  trade: Trade<Currency, Currency, typeof tradeType> | null
} {
  const routingAPIEnabled = useRoutingAPIEnabled()
  const isWindowVisible = useIsWindowVisible()

  const [debouncedAmount, debouncedOtherCurrency] = useDebounce([amountSpecified, otherCurrency], 200)

  const routingAPITrade = useRoutingAPITrade(
    tradeType,
    routingAPIEnabled && isWindowVisible ? debouncedAmount : undefined,
    debouncedOtherCurrency
  )

  const isLoading = amountSpecified !== undefined && debouncedAmount === undefined

  // consider trade debouncing when inputs/outputs do not match
  const debouncing =
    routingAPITrade.trade &&
    amountSpecified &&
    (tradeType === TradeType.EXACT_INPUT
      ? !routingAPITrade.trade.inputAmount.equalTo(amountSpecified) ||
        !amountSpecified.currency.equals(routingAPITrade.trade.inputAmount.currency) ||
        !debouncedOtherCurrency?.equals(routingAPITrade.trade.outputAmount.currency)
      : !routingAPITrade.trade.outputAmount.equalTo(amountSpecified) ||
        !amountSpecified.currency.equals(routingAPITrade.trade.outputAmount.currency) ||
        !debouncedOtherCurrency?.equals(routingAPITrade.trade.inputAmount.currency))

  const useFallback = !routingAPIEnabled || (!debouncing && routingAPITrade.state === V3TradeState.NO_ROUTE_FOUND)

  // only use client side router if routing api trade failed
  const bestV3Trade = useClientSideV3Trade(
    tradeType,
    useFallback ? debouncedAmount : undefined,
    useFallback ? debouncedOtherCurrency : undefined
  )

  return {
    ...(useFallback ? bestV3Trade : routingAPITrade),
    ...(debouncing ? { state: V3TradeState.SYNCING } : {}),
    ...(isLoading ? { state: V3TradeState.LOADING } : {}),
  }
}

const QUOTE_GAS_OVERRIDES: { [chainId: number]: number } = {
  [SupportedChainId.OPTIMISM]: 6_000_000,
  [SupportedChainId.OPTIMISTIC_KOVAN]: 6_000_000,
}

const DEFAULT_GAS_QUOTE = 2_000_000

/**
 * Returns the best v3 trade for a desired exact input swap
 * @param amountIn the amount to swap in
 * @param currencyOut the desired output currency
 */
export function useBestV3TradeExactIn(
  amountIn?: CurrencyAmount<Currency>,
  currencyOut?: Currency
): { state: V3TradeState; trade: Trade<Currency, Currency, TradeType.EXACT_INPUT> | null } {
  const { chainId } = useActiveWeb3React()
  const quoter = useV3Quoter()
  const { routes, loading: routesLoading } = useAllV3Routes(amountIn?.currency, currencyOut)

  const quoteExactInInputs = useMemo(() => {
    return routes.map((route) => [
      encodeRouteToPath(route, false),
      amountIn ? `0x${amountIn.quotient.toString(16)}` : undefined,
    ])
  }, [amountIn, routes])

  const quotesResults = useSingleContractMultipleData(quoter, 'quoteExactInput', quoteExactInInputs, {
    gasRequired: chainId ? QUOTE_GAS_OVERRIDES[chainId] ?? DEFAULT_GAS_QUOTE : undefined,
  })

  return useMemo(() => {
    if (!amountIn || !currencyOut) {
      return {
        state: V3TradeState.INVALID,
        trade: null,
      }
    }

    if (routesLoading || quotesResults.some(({ loading }) => loading)) {
      return {
        state: V3TradeState.LOADING,
        trade: null,
      }
    }

    const { bestRoute, amountOut } = quotesResults.reduce(
      (currentBest: { bestRoute: Route<Currency, Currency> | null; amountOut: BigNumber | null }, { result }, i) => {
        if (!result) return currentBest

        if (currentBest.amountOut === null) {
          return {
            bestRoute: routes[i],
            amountOut: result.amountOut,
          }
        } else if (currentBest.amountOut.lt(result.amountOut)) {
          return {
            bestRoute: routes[i],
            amountOut: result.amountOut,
          }
        }

        return currentBest
      },
      {
        bestRoute: null,
        amountOut: null,
      }
    )

    if (!bestRoute || !amountOut) {
      return {
        state: V3TradeState.NO_ROUTE_FOUND,
        trade: null,
      }
    }

    const isSyncing = quotesResults.some(({ syncing }) => syncing)

    return {
      state: isSyncing ? V3TradeState.SYNCING : V3TradeState.VALID,
      trade: Trade.createUncheckedTrade({
        route: bestRoute,
        tradeType: TradeType.EXACT_INPUT,
        inputAmount: amountIn,
        outputAmount: CurrencyAmount.fromRawAmount(currencyOut, amountOut.toString()),
      }),
    }
  }, [amountIn, currencyOut, quotesResults, routes, routesLoading])
}

/**
 * Returns the best v3 trade for a desired exact output swap
 * @param currencyIn the desired input currency
 * @param amountOut the amount to swap out
 */
export function useBestV3TradeExactOut(
  currencyIn?: Currency,
  amountOut?: CurrencyAmount<Currency>
): { state: V3TradeState; trade: Trade<Currency, Currency, TradeType.EXACT_OUTPUT> | null } {
  const { chainId } = useActiveWeb3React()
  const quoter = useV3Quoter()
  const { routes, loading: routesLoading } = useAllV3Routes(currencyIn, amountOut?.currency)

  const quoteExactOutInputs = useMemo(() => {
    return routes.map((route) => [
      encodeRouteToPath(route, true),
      amountOut ? `0x${amountOut.quotient.toString(16)}` : undefined,
    ])
  }, [amountOut, routes])

  const quotesResults = useSingleContractMultipleData(quoter, 'quoteExactOutput', quoteExactOutInputs, {
    gasRequired: chainId ? QUOTE_GAS_OVERRIDES[chainId] ?? DEFAULT_GAS_QUOTE : undefined,
  })

  return useMemo(() => {
    if (!amountOut || !currencyIn || quotesResults.some(({ valid }) => !valid)) {
      return {
        state: V3TradeState.INVALID,
        trade: null,
      }
    }

    if (routesLoading || quotesResults.some(({ loading }) => loading)) {
      return {
        state: V3TradeState.LOADING,
        trade: null,
      }
    }

    const { bestRoute, amountIn } = quotesResults.reduce(
      (currentBest: { bestRoute: Route<Currency, Currency> | null; amountIn: BigNumber | null }, { result }, i) => {
        if (!result) return currentBest

        if (currentBest.amountIn === null) {
          return {
            bestRoute: routes[i],
            amountIn: result.amountIn,
          }
        } else if (currentBest.amountIn.gt(result.amountIn)) {
          return {
            bestRoute: routes[i],
            amountIn: result.amountIn,
          }
        }

        return currentBest
      },
      {
        bestRoute: null,
        amountIn: null,
      }
    )

    if (!bestRoute || !amountIn) {
      return {
        state: V3TradeState.NO_ROUTE_FOUND,
        trade: null,
      }
    }

    const isSyncing = quotesResults.some(({ syncing }) => syncing)

    return {
      state: isSyncing ? V3TradeState.SYNCING : V3TradeState.VALID,
      trade: Trade.createUncheckedTrade({
        route: bestRoute,
        tradeType: TradeType.EXACT_OUTPUT,
        inputAmount: CurrencyAmount.fromRawAmount(currencyIn, amountIn.toString()),
        outputAmount: amountOut,
      }),
    }
  }, [amountOut, currencyIn, quotesResults, routes, routesLoading])
}
