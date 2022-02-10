import React from 'react'

export interface PoolPositionData {
  tokenId: string
  liquidity: string | undefined
  fee: string | undefined
  removed: boolean
  inRange: boolean
}

export type PoolOverviewContext = {
  positionsData: PoolPositionData[]
  setPositionsData: (data: PoolPositionData) => void
  emptyPositions: () => void
}

export const PoolOverviewManager = React.createContext<PoolOverviewContext>({
  positionsData: [],
  setPositionsData: (data) => {
    // console.log(data)
  },
  emptyPositions: () => {
    console.log('emptyPositions')
  },
})

export const usePoolOverviewManager = () => React.useContext(PoolOverviewManager)
