import { createAction } from '@reduxjs/toolkit'

import { fundData, TookenListIn, Underly } from './reducer'

export const updateFunds = createAction<{
  fundsData: fundData[]
}>('funds')
export const UpdatePositionList = createAction<{ positionList: TookenListIn[] }>('pools/UpdatePositionList')
export const UpdateUnderly = createAction<{ underly: Underly[] }>('pools/UpdateUnderly')
