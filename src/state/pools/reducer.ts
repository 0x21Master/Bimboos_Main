import { createReducer } from '@reduxjs/toolkit'

import {
  updateMintPositionDatas,
  updatePositionAPR,
  updatePositionDatas,
  updateTopFeesUSDPools,
  updateTopTotalValueLockedUSDPools,
  updateTopTxCountUSDPools,
  updateTopVolumeUSDPools,
} from './actions'

export interface MintPosState {
  mintLiquidity: string
  mintFiatValueOfLiquidity: string
  mintUnitLiquidity: string
}

export interface PoolDataState {
  tokenId: string
  isInRange: boolean
  fiatValueOfLiquidity: number
  fiatValueOfFees: number
  mint: MintPosState
}

export interface PoolDatasState {
  pools: Map<string, PoolDataState>
}

export const initPools: PoolDataState = {
  tokenId: '',
  isInRange: false,
  fiatValueOfLiquidity: 0,
  fiatValueOfFees: 0,
  mint: {
    mintLiquidity: '0',
    mintFiatValueOfLiquidity: '0',
    mintUnitLiquidity: '0',
  },
}

export interface APRDataState {
  tokenId: string
  fiatValueOfLiquidity: number
  fiatValueOfFees: number
  apr: number
  currentTimestamp: number
  createPositionTimestamp: number
  lastCollectFeesTimestamp: number
}
const initAPR: APRDataState = {
  tokenId: '',
  fiatValueOfLiquidity: 0,
  fiatValueOfFees: 0,
  apr: 0,
  currentTimestamp: 0,
  createPositionTimestamp: 0,
  lastCollectFeesTimestamp: 0,
}

// export const initialState: PoolDatasState = {
//   pools: new Map([['0', initPools]]),
// }

// New, ready to use this

export interface PoolState {
  pools: string
  topVolumeUSDPools: string
  topVolumeUSDPoolsRank: string
  topTotalValueLockedUSDPools: string
  topTotalValueLockedUSDPoolsRank: string
  topFeesUSDPools: string
  topFeesUSDPoolsRank: string
  topTxCountPools: string
  topTxCountPoolsRank: string
  apr: string
}

export interface PoolStateObject {
  pools: Map<string, PoolDataState>
  topVolumeUSDPools: TopPoolsStructure[]
  topVolumeUSDPoolsRank: Map<string, number>
  topTotalValueLockedUSDPools: TopPoolsStructure[]
  topTotalValueLockedUSDPoolsRank: Map<string, number>
  topFeesUSDPools: TopPoolsStructure[]
  topFeesUSDPoolsRank: Map<string, number>
  topTxCountPools: TopPoolsStructure[]
  topTxCountPoolsRank: Map<string, number>
  apr: Map<string, APRDataState>
}

// interface PoolsStructure {
//   tokenId: string
//   isInRange: boolean
//   fiatValueOfLiquidity: number
//   fiatValueOfFees: number
//   mint: MintPosState
// }

export interface TopPoolsStructure {
  id: string
  createdAtTimestamp: string
  createdAtBlockNumber: string
  token0Address: string
  token0Symbol: string
  token0Name: string
  token0Decimals: string
  token1Address: string
  token1Symbol: string
  token1Name: string
  token1Decimals: string
  fee: string
  liquidity: string
  totalValueLockedUSD: string
  volumeUSD: string
  feesUSD: string
  txCount: string
  token0Price: string
  token1Price: string
  tick: string
}

const initTopPools: TopPoolsStructure = {
  id: '',
  createdAtTimestamp: '',
  createdAtBlockNumber: '',
  token0Address: '',
  token0Symbol: '',
  token0Name: '',
  token0Decimals: '',
  token1Address: '',
  token1Symbol: '',
  token1Name: '',
  token1Decimals: '',
  fee: '',
  liquidity: '',
  totalValueLockedUSD: '',
  volumeUSD: '',
  feesUSD: '',
  txCount: '',
  token0Price: '',
  token1Price: '',
  tick: '',
}

const initialState: PoolState = {
  pools: JSON.stringify(Array.from(new Map([['0', initPools]]).entries())),
  topVolumeUSDPools: JSON.stringify(initTopPools),
  topVolumeUSDPoolsRank: JSON.stringify(Array.from(new Map([['0', 0]]).entries())),
  topTotalValueLockedUSDPools: JSON.stringify(initTopPools),
  topTotalValueLockedUSDPoolsRank: JSON.stringify(Array.from(new Map([['0', 0]]).entries())),
  topFeesUSDPools: JSON.stringify(initTopPools),
  topFeesUSDPoolsRank: JSON.stringify(Array.from(new Map([['0', 0]]).entries())),
  topTxCountPools: JSON.stringify(initTopPools),
  topTxCountPoolsRank: JSON.stringify(Array.from(new Map([['0', 0]]).entries())),
  apr: JSON.stringify(Array.from(new Map([['0', initAPR]]).entries())),
}

export default createReducer<PoolState>(initialState, (builder) =>
  builder
    .addCase(
      updatePositionDatas,
      (state, { payload: { tokenId, isInRange, fiatValueOfLiquidity, fiatValueOfFees } }) => {
        if (!tokenId || tokenId === '') {
          return state
        }
        let newPool = new Map<string, PoolDataState>()
        if (state.pools !== '') {
          newPool = new Map<string, PoolDataState>(JSON.parse(state.pools))
        }
        let data: PoolDataState = JSON.parse(JSON.stringify(initPools))
        if (newPool.has(tokenId)) {
          data = newPool.get(tokenId)!
        }
        if (
          data!.isInRange === isInRange &&
          data!.fiatValueOfLiquidity === fiatValueOfLiquidity &&
          data!.fiatValueOfFees === fiatValueOfFees
        ) {
          return state
        }

        data!.tokenId = tokenId
        data!.isInRange = isInRange
        data!.fiatValueOfLiquidity = fiatValueOfLiquidity
        data!.fiatValueOfFees = fiatValueOfFees
        newPool.set(tokenId, data!)
        const newPoolStr = JSON.stringify(Array.from(newPool.entries()))
        return { ...state, pools: newPoolStr }
      }
    )
    .addCase(
      updateMintPositionDatas,
      (state, { payload: { tokenId, mintLiquidity, mintFiatValueOfLiquidity, mintUnitLiquidity } }) => {
        if (!tokenId || tokenId === '') {
          return state
        }
        let newPool = new Map<string, PoolDataState>()
        if (state.pools !== '') {
          newPool = new Map<string, PoolDataState>(JSON.parse(state.pools))
        }
        let data = JSON.parse(JSON.stringify(initPools))
        if (newPool.has(tokenId)) {
          data = newPool.get(tokenId)!
        }
        data!.mint.mintLiquidity = mintLiquidity
        data!.mint.mintFiatValueOfLiquidity = mintFiatValueOfLiquidity
        data!.mint.mintUnitLiquidity = mintUnitLiquidity
        newPool.set(tokenId, data!)
        const newPoolStr = JSON.stringify(Array.from(newPool.entries()))
        return { ...state, pools: newPoolStr }
      }
    )
    .addCase(updateTopVolumeUSDPools, (state, { payload: { topPools } }) => {
      if (topPools.length == 0) {
        return state
      }

      const newTopPoolsRank = new Map<string, number>()
      for (const [index, item] of topPools.entries()) {
        const poolAddress = item.id.toLowerCase()
        newTopPoolsRank.set(poolAddress, index + 1)
      }
      const newTopPoolsStr = JSON.stringify(topPools)
      const newTopPoolsRankStr = JSON.stringify(Array.from(newTopPoolsRank.entries()))
      return { ...state, topVolumeUSDPools: newTopPoolsStr, topVolumeUSDPoolsRank: newTopPoolsRankStr }
    })
    .addCase(updateTopFeesUSDPools, (state, { payload: { topPools } }) => {
      if (topPools.length == 0) {
        return state
      }
      const newTopPoolsRank = new Map<string, number>()
      for (const [index, item] of topPools.entries()) {
        const poolAddress = item.id.toLowerCase()
        newTopPoolsRank.set(poolAddress, index + 1)
      }
      const newTopPoolsStr = JSON.stringify(topPools)
      const newTopPoolsRankStr = JSON.stringify(Array.from(newTopPoolsRank.entries()))
      return { ...state, topFeesUSDPools: newTopPoolsStr, topFeesUSDPoolsRank: newTopPoolsRankStr }
    })
    .addCase(updateTopTotalValueLockedUSDPools, (state, { payload: { topPools } }) => {
      if (topPools.length == 0) {
        return state
      }
      const newTopPoolsRank = new Map<string, number>()
      for (const [index, item] of topPools.entries()) {
        const poolAddress = item.id.toLowerCase()
        newTopPoolsRank.set(poolAddress, index + 1)
      }
      const newTopPoolsStr = JSON.stringify(topPools)
      const newTopPoolsRankStr = JSON.stringify(Array.from(newTopPoolsRank.entries()))
      return {
        ...state,
        topTotalValueLockedUSDPools: newTopPoolsStr,
        topTotalValueLockedUSDPoolsRank: newTopPoolsRankStr,
      }
    })
    .addCase(updateTopTxCountUSDPools, (state, { payload: { topPools } }) => {
      if (topPools.length == 0) {
        return state
      }

      const newTopPoolsRank = new Map<string, number>()
      for (const [index, item] of topPools.entries()) {
        const poolAddress = item.id.toLowerCase()
        newTopPoolsRank.set(poolAddress, index + 1)
      }
      const newTopPoolsStr = JSON.stringify(topPools)
      const newTopPoolsRankStr = JSON.stringify(Array.from(newTopPoolsRank.entries()))
      return { ...state, topTxCountPools: newTopPoolsStr, topTxCountPoolsRank: newTopPoolsRankStr }
    })
    .addCase(
      updatePositionAPR,
      (
        state,
        {
          payload: {
            tokenId,
            fiatValueOfLiquidity,
            fiatValueOfFees,
            apr,
            currentTimestamp,
            createPositionTimestamp,
            lastCollectFeesTimestamp,
          },
        }
      ) => {
        if (!tokenId || tokenId === '') {
          return state
        }
        let newAPR = new Map<string, APRDataState>()
        if (state.apr !== '') {
          newAPR = new Map<string, APRDataState>(JSON.parse(state.apr))
        }
        let data: APRDataState = JSON.parse(JSON.stringify(initAPR))
        if (newAPR.has(tokenId)) {
          data = newAPR.get(tokenId)!
        }

        data!.tokenId = tokenId
        data!.fiatValueOfLiquidity = fiatValueOfLiquidity
        data!.fiatValueOfFees = fiatValueOfFees
        data.apr = apr
        data.currentTimestamp = currentTimestamp
        data.createPositionTimestamp = createPositionTimestamp
        data.lastCollectFeesTimestamp = lastCollectFeesTimestamp
        newAPR.set(tokenId, data!)
        const newAPRStr = JSON.stringify(Array.from(newAPR.entries()))
        return { ...state, apr: newAPRStr }
      }
    )
)
