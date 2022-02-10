import { createReducer } from '@reduxjs/toolkit'

import { updateUnderly } from './actions'

export interface underlyData {
  positionList: any
  underlyList: any
}

const initialState: underlyData = {
  positionList: {},
  underlyList: {},
}

export default createReducer<underlyData>(initialState, (builder) =>
  builder.addCase(updateUnderly, (state, { payload: { underly } }) => {
    return { ...state, positionList: underly.positionList, underlyList: underly.underlyList }
  })
)
