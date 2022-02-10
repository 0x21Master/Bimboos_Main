import { createReducer } from '@reduxjs/toolkit'

import { updateChooseWallet, updateShowInfo } from './actions'

export interface walletDataState {
  showWalletChoose: boolean
  showWalletInfo: boolean
}

const initialState: walletDataState = {
  showWalletChoose: false,
  showWalletInfo: false,
}

export default createReducer<walletDataState>(initialState, (builder) =>
  builder
    .addCase(updateChooseWallet, (state, { payload: { showWalletChoose } }) => {
      return { ...state, showWalletChoose }
    })
    .addCase(updateShowInfo, (state, { payload: { showWalletInfo } }) => {
      return { ...state, showWalletInfo }
    })
)
