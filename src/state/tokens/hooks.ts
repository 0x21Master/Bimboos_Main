import { Token } from '@uniswap/sdk-core'
import { ITokenItem } from 'constants/tokens'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, AppState } from './../index'
import { updateTokenPrice } from './actions'
import { combineChainIdAndTokenAddressForKey, TokenPrice } from './reducer'

export function useTokensState(): AppState['tokens'] {
  return useSelector<AppState, AppState['tokens']>((state) => state.tokens)
}

export function useGetTokenPrice(chainId: string | undefined, token: Token | undefined): TokenPrice | undefined {
  const key = combineChainIdAndTokenAddressForKey(chainId, token?.address)
  const tokenPriceState = useTokensState().tokensPrice

  return undefined
  // { symbol: 'aaa', address: 'aaa', denominator: 'aaa', numerator: 'aaa', price: 'aaa' }
  // return useMemo(() => {
  //   const tokenPriceMap = new Map<string, TokenPrice>(JSON.parse(tokenPriceState))
  //   return tokenPriceMap.get(key)
  // }
  // , [tokenPriceState])
}

export function useUpdateTokenData(): {
  onUpdateTokenPrice: (tokenAddress: string, tokenItem: ITokenItem) => void
} {
  const dispatch = useDispatch<AppDispatch>()

  const onUpdateTokenPrice = useCallback(
    (tokenAddress, tokenItem) => {
      dispatch(
        updateTokenPrice({
          tokenAddress,
          tokenItem,
        })
      )
    },
    [dispatch]
  )

  return { onUpdateTokenPrice }
}
