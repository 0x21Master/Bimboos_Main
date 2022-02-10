import BigNumber from 'bignumber.js'

export interface TokenSchema {
  id: string
  symbol: string
  name: string
  decimals: string
}

export interface TickSchema {
  id: string
  poolAddress: string
  tickIdx: string
  pool: PoolSchema
  liquidityNet: string
  liquidityGross: string
  price0: string
  price1: string
  volumeToken0: string
  volumeToken1: string
  volumeUSD: string
}

export interface PoolDayDataSchema {
  id: string
  date: number
  tvlUSD: string
  feesUSD: string
  volumeUSD: string
  txCount: string
  open: string
  high: string
  low: string
  close: string
}

export interface PoolHourDataSchema {
  id: string
  periodStartUnix: number
  sqrtPrice: string
  tvlUSD: string
  feesUSD: string
  volumeUSD: string
  txCount: string
  open: string
  high: string
  low: string
  close: string
}
export interface PositionList {
  ContractAddress: string
  tokenId: string
  [tokenid: string]: any
}
export interface UnderlySchema {
  address: string
  change24h: number
  decimals: number
  icon: string
  id: string
  name: string
  priceUsd: number
  trend: string
  underlyBalance: string
  ContractAddress: string
}

export interface PoolSchema {
  id: string
  createdAtTimestamp: number
  createdAtBlockNumber: number
  token0: TokenSchema
  token1: TokenSchema
  feeTier: string
  liquidity: string
  sqrtPrice: string
  totalValueLockedUSD: string
  volumeUSD: string
  feesUSD: string
  collectedFeesUSD: string
  txCount: string
  token0Price: string
  token1Price: string
  tick: string
  poolDayData: PoolDayDataSchema[]
}

export interface TransactionSchema {
  id: string
  blockNumber: string
  timestamp: string
  gasUsed: string
  gasPrice: string
}

export enum TxActionType {
  INCREASE = 'INCREASE',
  DECREASE = 'DECREASE',
  CLAIM_FEE = 'CLAIM_FEE',
  COLLECT = 'COLLECT',
}

export interface TxActionSchema {
  id: string
  timestamp: string
  pool: PoolSchema
  amount: string
  amount0: string
  amount1: string
  amountUSD: string
  transaction: TransactionSchema
  type: TxActionType
}

export interface MintSchema extends TxActionSchema {
  owner: string
  origin: string
}

export interface BurnSchema extends TxActionSchema {
  owner?: string
  origin: string
}

export interface CollectSchema extends TxActionSchema {
  owner?: string
}

export interface PositionSchema {
  id: number
  owner: string
  pool: PoolSchema
  liquidity: string
  tickLower: TickSchema
  tickUpper: TickSchema
  depositedToken0: string
  depositedToken1: string
  withdrawnToken0: string
  withdrawnToken1: string
  collectedFeesToken0: string
  collectedFeesToken1: string
}

export interface PositionWithTxSchema extends PositionSchema {
  transaction: {
    mints: MintSchema[]
    burns: BurnSchema[]
    collects: CollectSchema[]
  }
}

export interface PoolInfoByAddressResult {
  pools: PoolSchema[]
}

export interface PositionsResult {
  positions: PositionSchema[]
}

export interface PositionsWithTxResult {
  positions: PositionWithTxSchema[]
}

export interface SingleMintResult {
  mints_data: any
  mints: {
    id: string
    pool: {
      token0: {
        symbol: string
      }
      token1: {
        symbol: string
      }
      feeTier: number
    }
    owner: string
    origin: string
    amount: number
    amount0: number
    amount1: number
    amountUSD: number
    transaction: {
      id: string
      blockNumber: number
      timestamp: number
      gasUsed: number
      gasPrice: number
    }
  }[]
}

export interface MintTxResult {
  mints: MintSchema[]
}
export interface BurnTxResult {
  burns: BurnSchema[]
}

export interface PoolHourDataResult {
  poolHourDatas: PoolHourDataSchema[]
}
export interface PoolDayDataResult {
  poolDayDatas: PoolDayDataSchema[]
}

export interface PositionsLastCollectFeesResult {
  mints: MintSchema[]
  burns: BurnSchema[]
}

export interface PositionSnapshotWithMintAndBurnResult {
  positionSnapshots: {
    transaction: {
      mints: MintSchema[]
      burns: BurnSchema[]
    }
  }[]
}
