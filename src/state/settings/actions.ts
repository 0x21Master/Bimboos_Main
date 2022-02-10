import { createAction } from '@reduxjs/toolkit'

export enum ProviderType {
  INFURA = 'INFURA',
  ETHERSCAN = 'ETHERSCAN',
}

export const updateProviderType = createAction<{ providerType: string }>('settings/updateProviderType')
export const updateProviderKey = createAction<{ providerKey: string }>('settings/updateProviderKey')
