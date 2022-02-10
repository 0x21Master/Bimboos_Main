import { createAction } from '@reduxjs/toolkit'

import { positionData } from './reducer'

export const updatePositionRemind = createAction<{
  positions: positionData[]
}>('positionDetail/updatePositionRemind')
