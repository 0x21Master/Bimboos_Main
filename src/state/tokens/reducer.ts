import { createReducer } from '@reduxjs/toolkit'
import { Currency, Price, Token } from '@uniswap/sdk-core'
import { IToken, ITokenItem, USDC, USDT } from 'constants/tokens'
import { toLower } from 'utils/commons'

import { updateTokenPrice } from './actions'

const initPriceToken: IToken = {}
export interface TokenPrice {
  symbol: string | undefined
  address: string
  denominator: string
  numerator: string
  price: string
}

export default createReducer<IToken>(initPriceToken, (builder) =>
  builder.addCase(updateTokenPrice, (state, { payload: { tokenAddress, tokenItem } }) => {
    const newState = { ...state }
    newState[toLower(tokenAddress)] = tokenItem
    return { ...newState }
  })
)

export function combineChainIdAndTokenAddressForKey(chainId: string | undefined, address: string | undefined): string {
  if (!address) {
    return ''
  }
  return chainId === undefined ? 'undefined' : chainId.toLowerCase() + address.toLowerCase()
}
