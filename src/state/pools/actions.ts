import { createAction } from '@reduxjs/toolkit'

import { TopPoolsStructure } from './reducer'

export const updatePositionDatas = createAction<{
  tokenId: string
  isInRange: boolean
  fiatValueOfLiquidity: number
  fiatValueOfFees: number
}>('pools/updatePoolDatas')

export const updateMintPositionDatas = createAction<{
  tokenId: string
  mintLiquidity: string
  mintFiatValueOfLiquidity: string
  mintUnitLiquidity: string
}>('pools/updateMintPoolDatas')

export const updateTopVolumeUSDPools = createAction<{
  topPools: TopPoolsStructure[]
}>('pools/updateTopVolumeUSDPools')

export const updateTopFeesUSDPools = createAction<{
  topPools: TopPoolsStructure[]
}>('pools/updateTopFeesUSDPools')

export const updateTopTotalValueLockedUSDPools = createAction<{
  topPools: TopPoolsStructure[]
}>('pools/updateTopTotalValueLockedUSDPools')

export const updateTopTxCountUSDPools = createAction<{
  topPools: TopPoolsStructure[]
}>('pools/updateTopTxCountUSDPools')

export const updatePositionAPR = createAction<{
  tokenId: string
  fiatValueOfLiquidity: number
  fiatValueOfFees: number
  apr: number
  currentTimestamp: number
  createPositionTimestamp: number
  lastCollectFeesTimestamp: number
}>('pools/updatePositionAPR')
