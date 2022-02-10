import { createAction } from '@reduxjs/toolkit'

export const updateChooseWallet = createAction<{
  showWalletChoose: boolean
}>('wallet')
export const updateShowInfo = createAction<{
  showWalletInfo: boolean
}>('updateShowInfo')
