import { gql } from '@apollo/client'

export const POSITION_CHART = gql`
  query getPositions($id: Int!) {
    positions(first: 1, where: { id: $id }) {
      id
      owner
      liquidity
      depositedToken0
      depositedToken1
      withdrawnToken0
      withdrawnToken1
      collectedFeesToken0
      collectedFeesToken1
      tickLower
      tickUpper
      pool {
        id
        token0 {
          id
          symbol
          name
          decimals
        }
        token1 {
          id
          symbol
          name
          decimals
        }
        feeTier
      }
      transaction {
        id
        blockNumber
        timestamp
        gasUsed
        gasPrice
        mints(first: 500) {
          id
          owner
          origin
          amount
          amount0
          amount1
          amountUSD
          transaction {
            id
            blockNumber
            timestamp
            gasUsed
            gasPrice
          }
        }
        burns(first: 500) {
          id
          timestamp
          owner
          origin
          amount
          amount1
          amountUSD
          transaction {
            id
            blockNumber
            timestamp
            gasUsed
            gasPrice
          }
        }
        collects(first: 500) {
          id
          timestamp
          owner
          amount0
          amount1
          amountUSD
          transaction {
            id
            blockNumber
            timestamp
            gasUsed
            gasPrice
          }
        }
      }
    }
  }
`

export const POOL_DATA_CHART = gql`
  query getPoolData($token0Address: Bytes!, $token1Address: Bytes!, $fee: Int!) {
    pools(first: 1, where: { token0: $token0Address, token1: $token1Address, feeTier: $fee }) {
      id
      createdAtTimestamp
      createdAtBlockNumber
      token0 {
        symbol
        decimals
      }
      token1 {
        symbol
        decimals
      }
      feeTier
      liquidity
      totalValueLockedUSD
      volumeUSD
      feesUSD
      collectedFeesUSD
      txCount
      token0Price
      token1Price
      tick
      poolDayData(first: 30, orderBy: date, orderDirection: desc) {
        id
        date
        tvlUSD
        feesUSD
        volumeUSD
        txCount
      }
    }
  }
`

export const TOP_POOL_CHART = gql`
  query getTopPoolData($orderBy: String!, $first: Int = 50) {
    pools(first: $first, orderDirection: desc, orderBy: $orderBy) {
      id
      createdAtTimestamp
      createdAtBlockNumber
      token0 {
        id
        name
        symbol
        decimals
      }
      token1 {
        id
        name
        symbol
        decimals
      }
      feeTier
      liquidity
      totalValueLockedUSD
      volumeUSD
      feesUSD
      collectedFeesUSD
      txCount
      token0Price
      token1Price
      tick
    }
  }
`

//
export const POSITION_MINT_CHART = gql`
  query getPositionMintData(
    $origin: String!
    $pool: String!
    $tickLower: String!
    $tickUpper: String!
    $first: Int = 500
    $skip: Int! = 0
    $orderBy: String! = "timestamp"
    $orderDirection: String! = "desc"
  ) {
    mints(
      first: $first
      skip: $skip
      where: { origin: $origin, pool: $pool, tickLower: $tickLower, tickUpper: $tickUpper }
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      timestamp
      pool {
        id
        token0 {
          id
          symbol
          name
          decimals
        }
        token1 {
          id
          symbol
          name
          decimals
        }
        feeTier
      }
      owner
      origin
      amount
      amount0
      amount1
      amountUSD
      tickLower
      tickUpper
      transaction {
        id
        blockNumber
        timestamp
        gasUsed
        gasPrice
      }
    }
  }
`

export const POSITION_BURN_CHART = gql`
  query getPositionBurnData(
    $pool: String!
    $origin: String!
    $tickLower: String!
    $tickUpper: String!
    $first: Int = 500
    $skip: Int! = 0
    $orderBy: String! = "timestamp"
    $orderDirection: String! = "desc"
  ) {
    burns(
      first: $first
      skip: $skip
      where: { origin: $origin, pool: $pool, tickLower: $tickLower, tickUpper: $tickUpper }
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      timestamp
      pool {
        token0 {
          id
          symbol
          name
          decimals
        }
        token1 {
          id
          symbol
          name
          decimals
        }
        feeTier
      }
      tickLower
      tickUpper
      origin
      owner
      amount
      amount0
      amount1
      amountUSD
      transaction {
        id
        blockNumber
        timestamp
        gasPrice
        gasUsed
      }
    }
  }
`

export const POOL_HOUR_DATA_CHART = gql`
  query getPoolHourData(
    $pool: String!
    $first: Int = 500
    $skip: Int! = 0
    $orderBy: String! = "periodStartUnix"
    $orderDirection: String! = "desc"
  ) {
    poolHourDatas(
      first: $first
      skip: $skip
      where: { pool: $pool }
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      periodStartUnix
      sqrtPrice
      tvlUSD
      volumeUSD
      feesUSD
      open
      high
      low
      close
    }
  }
`

export const POOL_DAY_DATA_CHART = gql`
  query getPoolDayData(
    $pool: String!
    $first: Int = 500
    $skip: Int! = 0
    $orderBy: String! = "date"
    $orderDirection: String! = "desc"
  ) {
    poolDayDatas(
      first: $first
      skip: $skip
      where: { pool: $pool }
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      date
      sqrtPrice
      tvlUSD
      volumeUSD
      feesUSD
      open
      high
      low
      close
    }
  }
`

export const TOP_POOL_POSITIONS_CHART = gql`
  query getTopPoolPositions(
    $pool: String!
    $first: Int = 500
    $skip: Int! = 0
    $orderBy: String! = "liquidity"
    $orderDirection: String! = "desc"
  ) {
    positions(first: $first, skip: $skip, where: { pool: $pool }, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      owner
      pool {
        token0 {
          id
          symbol
          name
          decimals
        }
        token1 {
          id
          symbol
          name
          decimals
        }
        feeTier
        tick
      }
      tickLower {
        tickIdx
      }
      tickUpper {
        tickIdx
      }
      liquidity
      depositedToken0
      depositedToken1
      withdrawnToken0
      withdrawnToken1
      collectedFeesToken0
      collectedFeesToken1
    }
  }
`

export const SAME_POOL_POSITIONS_CHART = gql`
  query getSamePoolPositions(
    $pool: String!
    $tickLower: String
    $tickUpper: String
    $first: Int = 500
    $skip: Int! = 0
    $orderBy: String! = "liquidity"
    $orderDirection: String! = "desc"
  ) {
    positions(
      first: $first
      skip: $skip
      where: { pool: $pool, tickLower_ends_with: $tickLower, tickUpper_ends_with: $tickUpper, liquidity_gt: 0 }
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      owner
      pool {
        token0 {
          id
          symbol
          name
          decimals
        }
        token1 {
          id
          symbol
          name
          decimals
        }
        feeTier
        tick
      }
      tickLower {
        tickIdx
      }
      tickUpper {
        tickIdx
      }
      liquidity
      depositedToken0
      depositedToken1
      withdrawnToken0
      withdrawnToken1
      collectedFeesToken0
      collectedFeesToken1
    }
  }
`

export const GET_LAST_TIME_COLLECT_FEES_CHART = gql`
  query getLastTimeCollectFees($origin: String!, $pool: String!, $tickLower: BigInt!, $tickUpper: BigInt!) {
    mints(
      first: 1
      where: { pool: $pool, origin: $origin, tickLower: $tickLower, tickUpper: $tickUpper }
      orderBy: timestamp
      orderDirection: asc
    ) {
      id
      origin
      timestamp
      amount
      amount0
      amount1
      amountUSD
    }
    burns(
      first: 1
      where: { pool: $pool, origin: $origin, tickLower: $tickLower, tickUpper: $tickUpper, amount: 0 }
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      origin
      timestamp
      amount
      amount0
      amount1
      amountUSD
    }
  }
`

export const POSITION_SNAPSHOT_MINT_AND_BURN_CHART = gql`
  query getPositionSnapshotMintAndBurnData(
    $tokenId: String!
    $owner: String!
    $first: Int = 1000
    $skip: Int! = 0
    $orderBy: String! = "timestamp"
    $orderDirection: String! = "desc"
  ) {
    positionSnapshots(
      first: $first
      skip: $skip
      where: { position: $tokenId, owner: $owner }
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      transaction {
        mints {
          id
          timestamp
          pool {
            id
            token0 {
              id
              symbol
              name
              decimals
            }
            token1 {
              id
              symbol
              name
              decimals
            }
            feeTier
          }
          owner
          origin
          amount
          amount0
          amount1
          amountUSD
          tickLower
          tickUpper
          transaction {
            id
            blockNumber
            timestamp
            gasUsed
            gasPrice
          }
        }
        burns {
          id
          timestamp
          pool {
            id
            token0 {
              id
              symbol
              name
              decimals
            }
            token1 {
              id
              symbol
              name
              decimals
            }
            feeTier
          }
          owner
          origin
          amount
          amount0
          amount1
          amountUSD
          tickLower
          tickUpper
          transaction {
            id
            blockNumber
            timestamp
            gasUsed
            gasPrice
          }
        }
      }
    }
  }
`
