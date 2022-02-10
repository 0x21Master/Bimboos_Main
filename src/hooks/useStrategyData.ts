import BigNumber from 'bignumber.js'
import { toLower } from 'lodash'
import { IMiniToken } from 'state/strategy/reducer'

import { useChanidToFunds } from './useChanidToFunds'
import { ITokenItem } from '../constants/tokens'
import { useAppSelector } from '../state/hooks'
import { useTokenItemByStrategy } from './useTokenItemByStrategy'

export interface ITokenJson extends ITokenItem {
  amount: string
}

export function useStrategyData(address: string) {
  const tokensState = useAppSelector((state) => state.tokens)
  const FUNDS = useChanidToFunds()
  const strategyAddress = FUNDS.reduce((t, v) => {
    if (toLower(v.fundAddress) === toLower(address)) {
      t.push(v.strategyAddress)
      if (v.autoLiquidityAddress) {
        t.push(v.autoLiquidityAddress)
      }
    }
    return t
  }, [] as string[])

  //获取合约内underlying和position的数据集
  const strategyDates: IMiniToken[] = useTokenItemByStrategy(strategyAddress)

  const strategyList = strategyDates.map((item) => {
    const tokenJson = tokensState[toLower(item.address)]

    if (!tokenJson?.address) {
      return
    }

    return {
      address: tokenJson.address,
      amount: new BigNumber(item.balance).dividedBy(10 ** tokenJson.decimals).toFixed(tokenJson.decimals),
      symbol: tokenJson.symbol,
      id: tokenJson.id,
      icon: tokenJson.icon,
      trend: tokenJson.trend,
      priceUsd: tokenJson.priceUsd,
      change24h: tokenJson.change24h,
      name: tokenJson.name,
      decimals: tokenJson.decimals,
    }
  })

  const positionsRes = new Map()

  const positionsDataList: ITokenJson[] =
    strategyList &&
    strategyList.reduce((list: ITokenJson[], item) => {
      if (item?.address) {
        if (positionsRes.has(item.address)) {
          positionsRes.get(item.address).amount = new BigNumber(positionsRes.get(item.address).amount)
            .plus(new BigNumber(item.amount))
            .toFixed(6)
        } else {
          const o: ITokenJson = { ...item }

          list.push(o)
          positionsRes.set(item?.address, o)
        }
      }
      return list
    }, [])

  return positionsDataList
}
