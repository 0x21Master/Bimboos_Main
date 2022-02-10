import { createReducer } from '@reduxjs/toolkit'

import { ProviderType, updateProviderKey, updateProviderType } from './actions'

export interface SettingsState {
  providerType: ProviderType | null
  providerKey: string | null
}

export const initialState: SettingsState = {
  providerType: null,
  providerKey: null,
}

export default createReducer<SettingsState>(initialState, (builder) =>
  builder
    .addCase(updateProviderKey, (state, { payload: { providerKey } }) => {
      return { ...state, providerKey }
    })
    .addCase(updateProviderType, (state, { payload: { providerType } }) => {
      switch (providerType) {
        case ProviderType.INFURA:
          return { ...state, providerType: ProviderType.INFURA }
        case ProviderType.ETHERSCAN:
          return { ...state, providerType: ProviderType.ETHERSCAN }
        default:
          return { ...state, providerType: null }
      }
    })
)
