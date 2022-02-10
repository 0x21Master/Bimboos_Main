import { createAction } from '@reduxjs/toolkit'

import { underlyData } from './reducer'

export const updateUnderly = createAction<{
  underly: underlyData
}>('underly')
