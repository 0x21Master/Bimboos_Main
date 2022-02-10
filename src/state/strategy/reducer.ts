import { createReducer } from '@reduxjs/toolkit'
import { IToken } from 'constants/tokens'
import { getProps, setProps, toLower } from 'utils/commons'

import { updateStrategyPosition, updateStrategyUnderly } from './actions'

const initPriceToken: IToken = {}
export interface IMiniToken {
  balance: string
  address: string
}
export interface IPositionItem {
  token0: IMiniToken
  token1: IMiniToken
}
// export interface IStrategyContract {
//   underlyings: { [tokenAddress: string]: IMiniToken }
//   positions: { [tokenId: string]: IPositionItem }
// }
export interface IStrategyContracts {
  underlyings: IStrategyContractsUnderly
  positions: { [strategyAddress: string]: { [tokenId: string]: IPositionItem } }
  // [strategyAddress: string]: IStrategyContract
}
interface IStrategyContractsUnderly {
  [strategyAddress: string]: { [tokenAddress: string]: IMiniToken }
}
interface IStrategyContractsPosition {
  [strategyAddress: string]: { [tokenId: string]: IPositionItem }
}
const initState: IStrategyContracts = {
  underlyings: {},
  positions: {},
}

export default createReducer<IStrategyContracts>(initState, (builder) =>
  builder
    .addCase(updateStrategyUnderly, (state, { payload: { strategyAddress, tokenAddress, tokenItem } }) => {
      const underlyings = { ...state }.underlyings
      const newUnderlyings = (JSON.parse(JSON.stringify(underlyings)) as IStrategyContractsUnderly) ?? {}
      const strategyContract = newUnderlyings[toLower(strategyAddress)] ?? {}
      strategyContract[tokenAddress] = tokenItem
      newUnderlyings[toLower(strategyAddress)] = strategyContract

      return { ...state, underlyings: newUnderlyings }
    })
    .addCase(updateStrategyPosition, (state, { payload: { strategyAddress, tokenId, positionItem } }) => {
      const positions = { ...state }.positions

      const newPositions = (JSON.parse(JSON.stringify(positions)) as IStrategyContractsPosition) ?? {}
      const strategyContract = newPositions[toLower(strategyAddress)] ?? {}
      strategyContract[tokenId] = positionItem
      newPositions[toLower(strategyAddress)] = strategyContract
      return { ...state, positions: newPositions }
    })
)
