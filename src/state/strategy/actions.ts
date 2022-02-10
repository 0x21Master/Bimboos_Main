import { createAction } from '@reduxjs/toolkit'

import { IMiniToken, IPositionItem } from './reducer'

// export const updateStrategy = createAction<{
//   funds: fundData[]
// }>('strategy/updateStrategy')
// export const UpdatePositionList = createAction<{ positionList: TookenListIn[] }>('pools/UpdatePositionList')
export const updateStrategyUnderly = createAction<{
  strategyAddress: string
  tokenAddress: string
  tokenItem: IMiniToken
}>('strategy/updateStrategyUnderly')

export const updateStrategyPosition = createAction<{
  strategyAddress: string
  tokenId: string
  positionItem: IPositionItem
}>('strategy/updateStrategyPosition')
