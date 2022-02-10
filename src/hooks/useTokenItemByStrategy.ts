import { IMiniToken, IPositionItem, IStrategyContracts } from 'state/strategy/reducer'
import { getProps, toLower } from 'utils/commons'

import { useAppSelector } from '../state/hooks'

export function useTokenItemByStrategyItem(strategyState: IStrategyContracts, strategyAddress: string) {
  const TokenArr: IMiniToken[] = []

  const underly = strategyState.underlyings[strategyAddress]
  const position = strategyState.positions[strategyAddress]
  const underlyArr = Object.values(underly)
  const positionArr = Object.values(Object.values(position))
  positionArr.map((positionArrItem) => {
    return TokenArr.push(...Object.values(positionArrItem))
  })

  return TokenArr.concat(underlyArr)
}
export function useTokenItemByStrategy(strategyAddress: string[] | string) {
  const strategyState = useAppSelector((state) => state.strategy)

  const TokenArr: IMiniToken[] = []

  if (!Array.isArray(strategyAddress)) {
    const underly = strategyState.underlyings[toLower(strategyAddress)]
    const position = strategyState.positions[toLower(strategyAddress)]
    const underlyArr = Object.values(underly)
    const positionArr = Object.values(Object.values(position))
    positionArr.map((positionArrItem) => {
      TokenArr.push(...Object.values(positionArrItem))
    })

    return TokenArr.push(...underlyArr) as unknown as IMiniToken[]
  }
  strategyAddress.map((item: string) => {
    const underly = strategyState.underlyings[toLower(item)]
    const position = strategyState.positions[toLower(item)]

    if (position) {
      const positionArr = Object.values(Object.values(position))
      positionArr.map((positionArrItem) => {
        TokenArr.push(...Object.values(positionArrItem))
      })
    }
    let underlyArr: IMiniToken[] = []
    if (underly) {
      underlyArr = Object.values(underly)
    }

    return TokenArr.push(...underlyArr) as unknown as IMiniToken[]
  })
  return TokenArr as unknown as IMiniToken[]
}
