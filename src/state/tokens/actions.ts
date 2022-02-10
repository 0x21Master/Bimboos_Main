import { createAction } from '@reduxjs/toolkit'
import { ITokenItem } from 'constants/tokens'

export const updateTokenPrice = createAction<{
  tokenAddress: string
  tokenItem: ITokenItem
}>('tokens/updateTokenPrice')
