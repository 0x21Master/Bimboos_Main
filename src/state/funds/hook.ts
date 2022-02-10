import { PositionList, UnderlySchema } from 'data/GRTResultSchema'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, AppState } from '../index'
import { updateFunds, UpdatePositionList, UpdateUnderly } from './actions'
import { fundData } from './reducer'

export function useFundsState(): AppState['funds'] {
  return useSelector<AppState, AppState['funds']>((state) => state.funds)
}

export function useFundData(address: string) {
  const funds = useFundsState().funds

  const fund = funds.filter((item) => item.address?.toLowerCase() === address?.toLowerCase())
  return fund[0]
}
function parsePositionListStructure(item: PositionList): PositionList {
  const positionList: PositionList = {
    ContractAddress: item.ContractAddress,
    tokenId: item.tokenId,
    token0: item.token0,
    token1: item.token1,
    amount0: item.amount0,
    amount1: item.amount1,
  }
  return positionList
}
function parseUnderlyStructure(item: UnderlySchema): UnderlySchema {
  const underlys: UnderlySchema = {
    address: item.address,
    change24h: item.change24h,
    decimals: item.decimals,
    icon: item.icon,
    id: item.id,
    name: item.name,
    priceUsd: item.priceUsd,
    trend: item.trend,
    underlyBalance: item.underlyBalance,
    ContractAddress: item.ContractAddress,
  }
  return underlys
}
function parseFund(item: fundData): fundData {
  const underlys: fundData = {
    address: item.address,
    decimals: item.decimals,
    symbol: item.symbol,
    fullName: item.fullName,
    tokens: item.tokens,
    fundBalance: item.fundBalance,
    types: item.types,
    fees: item.fees,
    assets: item.assets,
    totalSupply: item.totalSupply,
    icon: item.icon,
    lup: item.lup,
    chainId: item.chainId,
  }
  return underlys
}

export function useUpdateFunds(): {
  onUpdateFunds: (funds: fundData[]) => void
  onUpdatePositionList: (positionList: PositionList[]) => void
  onUpdateUnderly: (underly: UnderlySchema[]) => void
} {
  const dispatch = useDispatch<AppDispatch>()

  const onUpdateFunds = useCallback(
    (funds: fundData[]) => {
      // const fundsData = []
      const fundsData: fundData[] = []
      funds.forEach((item) => {
        const fundsItem = parseFund(item)
        fundsData.push(fundsItem)
      })

      dispatch(
        updateFunds({
          fundsData,
        })
      )
    },
    [dispatch]
  )

  const onUpdatePositionList = useCallback(
    (positionList: PositionList[]) => {
      const positionArr: PositionList[] = []
      positionList.forEach((item: PositionList) => {
        const tokens = parsePositionListStructure(item)
        positionArr.push(tokens)
      })
      dispatch(UpdatePositionList({ positionList: positionArr }))
    },
    [dispatch]
  )
  const onUpdateUnderly = useCallback(
    (underlyList: UnderlySchema[]) => {
      const underlyArr: UnderlySchema[] = []
      underlyList.forEach((item: UnderlySchema) => {
        const tokens = parseUnderlyStructure(item)
        underlyArr.push(tokens)
      })
      dispatch(UpdateUnderly({ underly: underlyArr }))
    },
    [dispatch]
  )

  return {
    onUpdateFunds,
    onUpdatePositionList,
    onUpdateUnderly,
  }
}
