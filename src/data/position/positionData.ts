import { Networkish } from '@ethersproject/networks'
import { BaseProvider } from '@ethersproject/providers'
import { client } from 'apollo/client'
import BigNumber from 'bignumber.js'
import { logAddress, topic_Collect, topic_DecreaseLiquidity } from 'constants/position'
import {
  GET_LAST_TIME_COLLECT_FEES_CHART,
  POSITION_BURN_CHART,
  POSITION_CHART,
  POSITION_MINT_CHART,
  POSITION_SNAPSHOT_MINT_AND_BURN_CHART,
  SAME_POOL_POSITIONS_CHART,
  TOP_POOL_POSITIONS_CHART,
} from 'data/GQLStatement'
import {
  BurnSchema,
  BurnTxResult,
  MintSchema,
  MintTxResult,
  PositionSchema,
  PositionsLastCollectFeesResult,
  PositionSnapshotWithMintAndBurnResult,
  PositionsResult,
  TxActionType,
} from 'data/GRTResultSchema'
import { ethers } from 'ethers'

export type TxSchema = MintSchema | BurnSchema

export async function fetchPositionMintDatas(owner: string, poolAddress: string, tickLower: string, tickUpper: string) {
  let data: MintSchema[] = []
  const first = 500
  let error = false
  let skip = 0
  let allFound = false
  if (owner && poolAddress && tickLower && tickUpper) {
    try {
      while (!allFound) {
        const {
          data: txData,
          error,
          loading,
        } = await client.query<MintTxResult>({
          query: POSITION_MINT_CHART,
          variables: {
            origin: owner.toLowerCase(),
            pool: poolAddress.toLowerCase(),
            tickLower,
            tickUpper,
            first,
            skip,
            orderBy: 'timestamp',
            orderDirection: 'desc',
          },
          fetchPolicy: 'cache-first',
        })
        if (!loading) {
          skip += first
          if (txData.mints.length < first || error) {
            allFound = true
          }
          if (txData) {
            data = [...data, ...txData.mints]
          }
        }
      }
    } catch {
      error = true
    }
  }
  return data
}

export async function fetchPositionBurnDatas(owner: string, poolAddress: string, tickLower: string, tickUpper: string) {
  let data: BurnSchema[] = []
  const first = 500
  let error = false
  let skip = 0
  let allFound = false
  if (owner && poolAddress && tickLower && tickUpper) {
    try {
      while (!allFound) {
        const {
          data: txData,
          error,
          loading,
        } = await client.query<BurnTxResult>({
          query: POSITION_BURN_CHART,
          variables: {
            origin: owner.toLowerCase(),
            pool: poolAddress.toLowerCase(),
            tickLower,
            tickUpper,
            first,
            skip,
            orderBy: 'timestamp',
            orderDirection: 'desc',
          },
          fetchPolicy: 'cache-first',
        })
        if (!loading) {
          skip += first
          if (txData.burns.length < first || error) {
            allFound = true
          }
          if (txData) {
            //   data = data.concat(txData.mints)
            data = [...data, ...txData.burns]
          }
        }
      }
    } catch {
      error = true
    }
  }
  return data
}

export async function fixTxMintData<T extends MintSchema>(txs: T[], provider: BaseProvider, chainId?: Networkish) {
  const newTxs: T[] = []
  for (const item of txs) {
    const newItem = { ...item }
    newItem.type = TxActionType.INCREASE
    const trans = { ...item.transaction }
    newItem.transaction = trans
    const txid = item.transaction.id
    const receipt = await provider.getTransactionReceipt(txid)
    if (!receipt) {
      newTxs.push(newItem)
      continue
    }
    newItem.transaction.gasUsed = receipt['gasUsed'].toString()
    newTxs.push(newItem)
  }
  return newTxs
}

export async function fixTxBurnData(burns: BurnSchema[], provider: BaseProvider, chainId?: Networkish) {
  if (burns.length === 0) {
    return burns
  }
  const newBurnResult: BurnSchema[] = JSON.parse(JSON.stringify(burns))
  const decimals0 = new BigNumber(10).pow(new BigNumber(newBurnResult[0].pool.token0.decimals))
  const decimals1 = new BigNumber(10).pow(new BigNumber(newBurnResult[0].pool.token1.decimals))
  for (const txItem of newBurnResult) {
    txItem.type = TxActionType.CLAIM_FEE
    const txid = txItem.transaction.id
    const receipt = await provider.getTransactionReceipt(txid)
    if (!receipt) {
      continue
    }
    txItem.transaction.gasUsed = receipt['gasUsed'].toString()
    if (txItem.amount !== '0') {
      txItem.type = TxActionType.DECREASE
      const duplicate_tx = newBurnResult.filter((item) => {
        const bool_txid = item.transaction.id === txItem.transaction.id
        const bool_id = item.id !== txItem.id
        return bool_txid && bool_id
      })
      if (duplicate_tx.length > 0) {
        txItem.transaction.gasUsed = '0'
      }
      continue
    }
    const logs = receipt['logs']
    let decreaseAmount = new BigNumber(0)
    let decrease0 = new BigNumber(0)
    let decrease1 = new BigNumber(0)
    let collect0 = new BigNumber(0)
    let collect1 = new BigNumber(0)
    logs.forEach((log) => {
      if (log['address'].toLowerCase() !== logAddress.toLowerCase()) {
        return
      }
      const topics = log['topics']
      if (
        topics.find((v) => {
          return v.toLowerCase() === topic_DecreaseLiquidity.toLowerCase()
        })
      ) {
        const decreaseData = ethers.utils.defaultAbiCoder.decode(['uint128', 'uint256', 'uint256'], log['data'])
        decreaseAmount = new BigNumber(decreaseData[0].toString())
        decrease0 = new BigNumber(decreaseData[1].toString())
        decrease1 = new BigNumber(decreaseData[2].toString())
      }
      if (
        topics.find((v) => {
          return v.toLowerCase() === topic_Collect.toLowerCase()
        })
      ) {
        const collectData = ethers.utils.defaultAbiCoder.decode(['address', 'uint256', 'uint256'], log['data'])

        collect0 = new BigNumber(collectData[1].toString())
        collect1 = new BigNumber(collectData[2].toString())
      }
    })

    txItem.amount0 = collect0.minus(decrease0).dividedBy(decimals0).toString()
    txItem.amount1 = collect1.minus(decrease1).dividedBy(decimals1).toString()
  }

  return newBurnResult
}

export function calcLiquidity(arr: TxSchema[]) {
  return arr.reduce(
    (t, v) => {
      if (Number(v.amount) > 0) {
        const gas = new BigNumber(v.transaction.gasPrice)
          .times(new BigNumber(v.transaction.gasUsed))
          .dividedBy(1e18)
          .toNumber()
        t.amount = new BigNumber(t.amount).plus(new BigNumber(v.amount)).toString()
        t.amount0 = new BigNumber(t.amount0).plus(new BigNumber(v.amount0)).toString()
        t.amount1 = new BigNumber(t.amount1).plus(new BigNumber(v.amount1)).toString()
        t.amountUSD = new BigNumber(t.amountUSD).plus(new BigNumber(v.amountUSD)).toString()
        t.gas += gas
      }
      return t
    },
    { amount: '0', amount0: '0', amount1: '0', amountUSD: '0', gas: 0 }
  )
}

export async function fetchTopPoolPositions(poolAddress: string, first = 20) {
  let data: PositionSchema[] = []
  let error = false
  if (poolAddress) {
    try {
      const {
        data: txData,
        error,
        loading,
      } = await client.query<PositionsResult>({
        query: TOP_POOL_POSITIONS_CHART,
        variables: {
          pool: poolAddress.toLowerCase(),
          first,
          orderBy: 'liquidity',
          orderDirection: 'desc',
        },
        fetchPolicy: 'cache-first',
      })
      if (txData) {
        data = txData.positions
      }
    } catch {
      error = true
      return data
    }
  }
  return data
}

export async function fetchSamePoolPositions(poolAddress: string, tickLower?: number, tickUpper?: number) {
  let data: PositionSchema[] = []
  const first = 500
  let error = false
  let skip = 0
  let allFound = false
  if (poolAddress) {
    try {
      while (!allFound) {
        const {
          data: txData,
          error,
          loading,
        } = await client.query<PositionsResult>({
          query: SAME_POOL_POSITIONS_CHART,
          variables: {
            pool: poolAddress.toLowerCase(),
            tickLower: tickLower ? tickLower.toString() : '',
            tickUpper: tickUpper ? tickUpper.toString() : '',
            first,
            skip,
            orderBy: 'liquidity',
            orderDirection: 'desc',
          },
          fetchPolicy: 'cache-first',
        })
        if (!loading) {
          skip += first
          if (txData.positions.length < first || error) {
            allFound = true
          }
          if (txData) {
            data = [...data, ...txData.positions]
          }
        }
      }
    } catch {
      error = true
      return data
    }
  }
  return data
}

export async function fetchLastTimeCollectFees(
  origin: string,
  poolAddress: string,
  tickLower: number,
  tickUpper: number
) {
  let data: PositionsLastCollectFeesResult = { mints: [], burns: [] }
  let error = false
  if (poolAddress) {
    try {
      const {
        data: txData,
        error,
        loading,
      } = await client.query<PositionsLastCollectFeesResult>({
        query: GET_LAST_TIME_COLLECT_FEES_CHART,
        variables: {
          origin: origin.toLowerCase(),
          pool: poolAddress.toLowerCase(),
          tickLower: tickLower.toString(),
          tickUpper: tickUpper.toString(),
        },
        fetchPolicy: 'cache-first',
      })
      if (!loading) {
        if (txData) {
          data = txData
        }
      }
    } catch {
      error = true
      return data
    }
  }
  return data
}

export async function fetchPositionData(tokenId: number) {
  let data: PositionSchema[] = []
  let error = false
  if (tokenId) {
    try {
      const { data: txData, loading } = await client.query<PositionsResult>({
        query: POSITION_CHART,
        variables: {
          id: tokenId,
        },
        fetchPolicy: 'cache-first',
      })
      if (!loading) {
        if (txData) {
          data = txData.positions
        }
      }
    } catch {
      error = true
      return data
    }
  }
  return data
}

export async function fetchPositionMintAndBurnsDatasBySnapshot(tokenId: number, owner: string) {
  let mintData: MintSchema[] = []
  let burnData: BurnSchema[] = []
  const first = 1000
  let error = false
  let skip = 0
  let allFound = false
  try {
    while (!allFound) {
      const {
        data: txData,
        error,
        loading,
      } = await client.query<PositionSnapshotWithMintAndBurnResult>({
        query: POSITION_SNAPSHOT_MINT_AND_BURN_CHART,
        variables: {
          tokenId: tokenId.toString(),
          owner: owner.toLowerCase(),
          first,
          skip,
          orderBy: 'timestamp',
          orderDirection: 'desc',
        },
        fetchPolicy: 'cache-first',
      })
      if (!loading) {
        skip += first
        if (txData.positionSnapshots.length < first || error) {
          allFound = true
        }
        if (txData) {
          for (const ps of txData.positionSnapshots) {
            mintData = [...mintData, ...ps.transaction.mints]
            burnData = [...burnData, ...ps.transaction.burns]
          }
        }
      }
    }
  } catch {
    error = true
  }
  return { mints: mintData, burns: burnData }
}
