import { PoolSchema } from 'data/GRTResultSchema'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, AppState } from '../index'
import {
  updateMintPositionDatas,
  updatePositionAPR,
  updatePositionDatas,
  updateTopFeesUSDPools,
  updateTopTotalValueLockedUSDPools,
  updateTopTxCountUSDPools,
  updateTopVolumeUSDPools,
} from './actions'
import { APRDataState, PoolDataState, PoolStateObject, TopPoolsStructure } from './reducer'

export function usePoolDataState(): AppState['pools'] {
  return useSelector<AppState, AppState['pools']>((state) => state.pools)
}

function usePoolState(): PoolStateObject {
  const state = usePoolDataState()
  const pools = new Map<string, PoolDataState>(JSON.parse(state.pools))
  const topVolumeUSDPools: TopPoolsStructure[] = JSON.parse(state.topVolumeUSDPools)
  const topVolumeUSDPoolsRank: Map<string, number> = new Map<string, number>(JSON.parse(state.topVolumeUSDPoolsRank))
  const topTotalValueLockedUSDPools: TopPoolsStructure[] = JSON.parse(state.topTotalValueLockedUSDPools)
  const topTotalValueLockedUSDPoolsRank: Map<string, number> = new Map<string, number>(
    JSON.parse(state.topTotalValueLockedUSDPoolsRank)
  )
  const topFeesUSDPools: TopPoolsStructure[] = JSON.parse(state.topFeesUSDPools)
  const topFeesUSDPoolsRank: Map<string, number> = new Map<string, number>(JSON.parse(state.topFeesUSDPoolsRank))
  const topTxCountPools: TopPoolsStructure[] = JSON.parse(state.topTxCountPools)
  const topTxCountPoolsRank: Map<string, number> = new Map<string, number>(JSON.parse(state.topTxCountPoolsRank))
  const apr = new Map<string, APRDataState>(JSON.parse(state.apr))

  return {
    pools,
    topVolumeUSDPools,
    topVolumeUSDPoolsRank,
    topTotalValueLockedUSDPools,
    topTotalValueLockedUSDPoolsRank,
    topFeesUSDPools,
    topFeesUSDPoolsRank,
    topTxCountPools,
    topTxCountPoolsRank,
    apr,
  }
}

export function getPoolsByStr(poolstr: string): Map<string, PoolDataState> {
  return new Map<string, PoolDataState>(JSON.parse(poolstr))
}

export function getTopPoolsByStr(poolstr: string): TopPoolsStructure[] {
  return JSON.parse(poolstr) as TopPoolsStructure[]
}

export function getTopPoolsRankByStr(poolstr: string): Map<string, number> {
  return new Map<string, number>(JSON.parse(poolstr))
}

export function getAPRByStr(aprStr: string): Map<string, APRDataState> {
  return new Map<string, APRDataState>(JSON.parse(aprStr))
}

function parsePoolSchema2TopPoolsStructure(item: PoolSchema): TopPoolsStructure {
  const top: TopPoolsStructure = {
    id: item.id.toLowerCase(),
    createdAtTimestamp: item.createdAtTimestamp.toString(),
    createdAtBlockNumber: item.createdAtBlockNumber.toString(),
    token0Address: item.token0.id.toLowerCase(),
    token0Symbol: item.token0.symbol,
    token0Name: item.token0.name,
    token0Decimals: item.token0.decimals.toString(),
    token1Address: item.token1.id.toLowerCase(),
    token1Symbol: item.token1.symbol,
    token1Name: item.token1.name,
    token1Decimals: item.token1.decimals.toString(),
    fee: item.feeTier.toString(),
    liquidity: item.liquidity.toString(),
    totalValueLockedUSD: item.totalValueLockedUSD.toString(),
    volumeUSD: item.volumeUSD.toString(),
    feesUSD: item.feesUSD.toString(),
    txCount: item.txCount.toString(),
    token0Price: item.token0Price.toString(),
    token1Price: item.token1Price.toString(),
    tick: item.tick.toString(),
  }
  return top
}

export function useUpdatePoolData(): {
  onUpdatePositionData: (
    tokenId: string,
    isInRange: boolean,
    fiatValueOfLiquidity: number,
    fiatValueOfFees: number
  ) => void
  onUpdateMintPositionData: (
    tokenId: string,
    mintLiquidity: string,
    mintFiatValueOfLiquidity: string,
    mintUnitLiquidity: string
  ) => void
  onUpdateTopVolumeUSDPools: (topPools: PoolSchema[]) => void
  onUpdateTopFeesUSDPools: (topPools: PoolSchema[]) => void
  onUpdateTopTotalValueLockedUSDPools: (topPools: PoolSchema[]) => void
  onUpdateTopTxCountUSDPools: (topPools: PoolSchema[]) => void
  onUpdatePositionAPR: (
    tokenId: string,
    fiatValueOfLiquidity: number,
    fiatValueOfFees: number,
    apr: number,
    currentTimestamp: number,
    createPositionTimestamp: number,
    lastCollectFeesTimestamp: number
  ) => void
} {
  const dispatch = useDispatch<AppDispatch>()

  const onUpdatePositionData = useCallback(
    (tokenId: string, isInRange: boolean, fiatValueOfLiquidity: number, fiatValueOfFees: number) => {
      dispatch(
        updatePositionDatas({
          tokenId,
          isInRange,
          fiatValueOfLiquidity,
          fiatValueOfFees,
        })
      )
    },
    [dispatch]
  )

  const onUpdateMintPositionData = useCallback(
    (tokenId: string, mintLiquidity: string, mintFiatValueOfLiquidity: string, mintUnitLiquidity: string) => {
      if (tokenId && tokenId !== '') {
        dispatch(
          updateMintPositionDatas({
            tokenId,
            mintLiquidity,
            mintFiatValueOfLiquidity,
            mintUnitLiquidity,
          })
        )
      }
    },
    [dispatch]
  )

  const onUpdateTopVolumeUSDPools = useCallback(
    (topPools: PoolSchema[]) => {
      const topPoolsArr: TopPoolsStructure[] = []
      topPools.forEach((item) => {
        const top = parsePoolSchema2TopPoolsStructure(item)
        topPoolsArr.push(top)
      })
      dispatch(updateTopVolumeUSDPools({ topPools: topPoolsArr }))
    },
    [dispatch]
  )

  const onUpdateTopFeesUSDPools = useCallback(
    (topPools: PoolSchema[]) => {
      const topPoolsArr: TopPoolsStructure[] = []
      topPools.forEach((item) => {
        const top = parsePoolSchema2TopPoolsStructure(item)
        topPoolsArr.push(top)
      })
      dispatch(updateTopFeesUSDPools({ topPools: topPoolsArr }))
    },
    [dispatch]
  )

  const onUpdateTopTotalValueLockedUSDPools = useCallback(
    (topPools: PoolSchema[]) => {
      const topPoolsArr: TopPoolsStructure[] = []
      topPools.forEach((item) => {
        const top = parsePoolSchema2TopPoolsStructure(item)
        topPoolsArr.push(top)
      })
      dispatch(updateTopTotalValueLockedUSDPools({ topPools: topPoolsArr }))
    },
    [dispatch]
  )

  const onUpdateTopTxCountUSDPools = useCallback(
    (topPools: PoolSchema[]) => {
      const topPoolsArr: TopPoolsStructure[] = []
      topPools.forEach((item) => {
        const top = parsePoolSchema2TopPoolsStructure(item)
        topPoolsArr.push(top)
      })
      dispatch(updateTopTxCountUSDPools({ topPools: topPoolsArr }))
    },
    [dispatch]
  )

  const onUpdatePositionAPR = useCallback(
    (
      tokenId: string,
      fiatValueOfLiquidity: number,
      fiatValueOfFees: number,
      apr: number,
      currentTimestamp: number,
      createPositionTimestamp: number,
      lastCollectFeesTimestamp: number
    ) => {
      dispatch(
        updatePositionAPR({
          tokenId,
          fiatValueOfLiquidity,
          fiatValueOfFees,
          apr,
          currentTimestamp,
          createPositionTimestamp,
          lastCollectFeesTimestamp,
        })
      )
    },
    [dispatch]
  )

  return {
    onUpdatePositionData,
    onUpdateMintPositionData,
    onUpdateTopVolumeUSDPools,
    onUpdateTopFeesUSDPools,
    onUpdateTopTotalValueLockedUSDPools,
    onUpdateTopTxCountUSDPools,
    onUpdatePositionAPR,
  }
}
