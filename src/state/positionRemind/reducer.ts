import { createReducer } from '@reduxjs/toolkit'

import { updatePositionRemind } from './actions'

export interface positionData {
  tokenId: string
  token0Addr: string
  token1Addr: string
  fee: number
  remindMin: number
  remindMax: number
  isReminded: boolean
  // poolAddress: string
}

interface PositionRemindState {
  positions: positionData[]
}

const initialState: PositionRemindState = {
  positions: [],
}

export default createReducer<PositionRemindState>(initialState, (builder) =>
  builder.addCase(updatePositionRemind, (state, { payload: { positions } }) => {
    return { ...state, positions }
  })
)
