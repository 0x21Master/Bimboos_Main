import { createReducer } from '@reduxjs/toolkit'
import { default_chainId } from 'connectors'
import { getProps } from 'utils/commons'

import { FUNDS } from '../../constants/funds'
import { updateFunds, UpdatePositionList, UpdateUnderly } from './actions'

export interface fundData {
  address: string
  decimals: number
  symbol: string | undefined
  fullName: string | undefined
  tokens: string[]
  fundBalance: string
  types: string[]
  fees: number[]
  assets: string
  totalSupply: string
  icon: string
  lup: string
  chainId: number
}

interface FundDataState {
  funds: fundData[]
  positionList: TookenListIn[]
  underly: Underly[]
}

export interface FundUnderlyItem {
  name: string
  id: string
  decimals: number
  icon: string
  trend: string
  address: string
  priceUsd: number
  change24h: number
}

export const initialState: FundDataState = {
  funds: FUNDS[default_chainId].map((item) => {
    return {
      address: item.fundAddress,
      decimals: item.decimals,
      symbol: '',
      fullName: '',
      tokens: [],
      fundBalance: '0',
      types: item.types,
      fees: [],
      assets: '',
      totalSupply: '',
      underlysDetail: [],
      icon: item.icon,
      lup: '0',
      chainId: item.chainId,
    }
  }),
  positionList: [],
  underly: [],
}
export interface TookenListIn {
  ContractAddress: string
  tokenId: string
  [tokenid: string]: any
}
export interface TokenDetials {
  token0: string
  token1: string
  amount0: string
  amount1: string
}
export interface Underly {
  address: string
  change24h: number
  decimals: number
  icon: string
  id: string
  name: string
  priceUsd: number
  trend: string
  underlyBalance: string
}

export default createReducer<FundDataState>(initialState, (builder) =>
  builder
    .addCase(updateFunds, (state, { payload: { fundsData } }) => {
      const { funds } = { ...state }
      let newFunds: fundData[] = []
      console.log(fundsData, funds[0].chainId, fundsData[0].chainId)

      if (funds[0].chainId === fundsData[0].chainId) {
        newFunds = [...funds]
      } else {
        newFunds = FUNDS[fundsData[0].chainId].map((item) => {
          return {
            address: item.fundAddress,
            decimals: item.decimals,
            symbol: '',
            fullName: '',
            tokens: [],
            fundBalance: '0',
            types: item.types,
            fees: [],
            assets: '',
            totalSupply: '',
            underlysDetail: [],
            icon: item.icon,
            lup: '0',
            chainId: item.chainId,
          }
        })
      }

      const newFundIndex = [...funds].findIndex((element) => element.address === fundsData[0].address)
      newFunds[newFundIndex] = fundsData[0]
      return { ...state, funds: newFunds }
    })
    .addCase(UpdatePositionList, (state, action) => {
      const { positionList } = action.payload
      return { ...state, positionList }
    })
    .addCase(UpdateUnderly, (state, action) => {
      const { underly } = action.payload
      return { ...state, underly }
    })
)
