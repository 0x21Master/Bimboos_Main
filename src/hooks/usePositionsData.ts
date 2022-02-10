import { Price, Token } from '@uniswap/sdk-core'
import { client } from 'apollo/client'
import { BigNumber } from 'bignumber.js'
import { POSITION_CHART } from 'data/GQLStatement'
import { BurnSchema, MintSchema, PositionSchema, PositionsResult, TxActionType } from 'data/GRTResultSchema'
import {
  fetchLastTimeCollectFees,
  fetchPositionBurnDatas,
  fetchPositionMintAndBurnsDatasBySnapshot,
  fetchPositionMintDatas,
  fixTxBurnData,
  fixTxMintData,
} from 'data/position/positionData'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { combineMintsAndBurns } from 'utils/fixData'

import { PoolPositionData } from '../constants/poolOverview'
import { useProvider } from './useProvider'

export function usePositionsData() {
  const [positionsData, setPositionsData] = useState<PoolPositionData[]>([])
  function setPosition(data: PoolPositionData) {
    if (positionsData.filter((item: PoolPositionData) => item.tokenId === data.tokenId).length === 0) {
      setPositionsData((prevState) => {
        return [...prevState, ...[data]]
      })
    } else {
      setPositionsData((prevState) => {
        const newPositionsData = prevState.map((item) => {
          if (item.tokenId === data.tokenId) {
            return { ...item, ...data }
          } else {
            return item
          }
        })
        return newPositionsData
      })
    }
  }
  function emptyPositions() {
    setPositionsData((prevState) => {
      return []
    })
  }
  return [positionsData, (data: PoolPositionData) => setPosition(data), emptyPositions] as const
}

export function usePosDataByTokenId(tokenId: string | undefined): PositionSchema | undefined {
  const [position, setPosition] = useState<PositionSchema | undefined>(undefined)
  async function fetchPositionResult(tokenId: string) {
    try {
      const { data, error, loading } = await client.query<PositionsResult>({
        query: POSITION_CHART,
        variables: {
          id: Number(tokenId),
        },
        fetchPolicy: 'cache-first',
      })
      if (data) {
        if (data.positions.length > 0) {
          return data.positions[0]
          // setPosition(data.positions[0])
        }
      }
    } catch (err) {
      console.log('fetchPositionResult error:', err)
    }
    return undefined
  }

  useMemo(async () => {
    if (tokenId && Number(tokenId)) {
      const data = await fetchPositionResult(tokenId)
      setPosition(data)
    }
  }, [tokenId])

  return position
}

/**
 * Deprecated
 * @param chainId
 * @param owner
 * @param poolAddress
 * @param tickLower
 * @param tickUpper
 * @returns
 */
export function usePositionMintAndBurnDataOld(
  chainId: number | undefined,
  owner: string | undefined,
  poolAddress: string | undefined,
  tickLower: number | undefined,
  tickUpper: number | undefined
) {
  const [burns, setBurns] = useState<BurnSchema[] | undefined>(undefined)
  const [mints, setMints] = useState<MintSchema[] | undefined>(undefined)
  const provider = useProvider(chainId)

  useMemo(async () => {
    if (chainId && owner && poolAddress && tickLower && tickUpper) {
      const mintTxs = await fetchPositionMintDatas(owner, poolAddress, tickLower.toString(), tickUpper.toString())
      const newMintTxs = await fixTxMintData(mintTxs, provider, chainId)

      const burnTxs = await fetchPositionBurnDatas(owner, poolAddress, tickLower.toString(), tickUpper.toString())
      const newBurnTxs = await fixTxBurnData(burnTxs, provider, chainId)

      setMints(newMintTxs)
      setBurns(newBurnTxs)
    }
  }, [chainId, owner, poolAddress, tickLower, tickUpper])
  return { mints, burns }
}

/**
 *
 * @param chainId
 * @param tokenId
 * @param owner
 * @returns
 */
export function usePositionMintAndBurnData(
  chainId: number | undefined,
  tokenId: number | undefined,
  owner: string | undefined
) {
  const [burns, setBurns] = useState<BurnSchema[]>()
  const [mints, setMints] = useState<MintSchema[]>()
  const { mints: mintTxs, burns: burnTxs } = usePositionMintAndBurnDataWithoutFixData(tokenId, owner)
  const provider = useProvider(chainId)
  // useMemo(async () => {
  //   if (!chainId || !mintTxs || !burnTxs) return
  //   // const { mints: mintTxs, burns: burnTxs } = await fetchPositionMintAndBurnsDatasBySnapshot(tokenId, owner)
  //   const newMintTxs = await fixTxMintData(mintTxs, provider, chainId)
  //   const newBurnTxs = await fixTxBurnData(burnTxs, provider, chainId)
  //   setMints(newMintTxs)
  //   setBurns(newBurnTxs)
  // }, [chainId, mintTxs, burnTxs])
  useEffect(() => {
    if (!chainId || !mintTxs || !burnTxs) return
    fixTxMintData(mintTxs, provider, chainId).then((newMintTxs) => {
      setMints(newMintTxs)
    })
    fixTxBurnData(burnTxs, provider, chainId).then((newBurnTxs) => {
      setBurns(newBurnTxs)
    })
  }, [chainId, mintTxs, burnTxs])
  return { mints, burns }
}

/**
 *
 * @param tokenId
 * @param owner
 * @returns
 */
export function usePositionMintAndBurnDataWithoutFixData(tokenId: number | undefined, owner: string | undefined) {
  const [burns, setBurns] = useState<BurnSchema[]>()
  const [mints, setMints] = useState<MintSchema[]>()
  // useMemo(async () => {
  //   if (!tokenId || !owner) return
  //   const { mints: mintTxs, burns: burnTxs } = await fetchPositionMintAndBurnsDatasBySnapshot(tokenId, owner)
  //   setMints(mintTxs)
  //   setBurns(burnTxs)
  // }, [tokenId, owner])
  useEffect(() => {
    if (!tokenId || !owner) return
    fetchPositionMintAndBurnsDatasBySnapshot(tokenId, owner).then(({ mints, burns }) => {
      setMints(mints)
      setBurns(burns)
    })
  }, [tokenId, owner])
  return { mints, burns }
}

/**
 * Deprecated
 * @param owner
 * @param poolAddress
 * @param tickLower
 * @param tickUpper
 * @param fiatValueOfLiquidity
 * @param fiatValueOfFees
 * @returns
 */
export function useAPROld(
  owner: string | undefined,
  poolAddress: string | undefined,
  tickLower: number | undefined,
  tickUpper: number | undefined,
  fiatValueOfLiquidity: number | undefined,
  fiatValueOfFees: number | undefined
) {
  const [createTimestamp, setCreateTimestamp] = useState<number | undefined>(undefined)
  const [lastTimestamp, setLastTimestamp] = useState<number | undefined>(undefined)

  useMemo(async () => {
    if (!owner || !poolAddress || !tickLower || !tickUpper) {
      return
    }
    const data = await fetchLastTimeCollectFees(owner, poolAddress, tickLower, tickUpper)
    if (data.mints.length === 0) {
      return
    }
    const create = data.mints[0]
    let lastCollectFees = undefined
    if (data.burns.length > 0) {
      lastCollectFees = data.burns[0]
    } else {
      lastCollectFees = data.mints[0]
    }
    setCreateTimestamp(Number(create.timestamp))
    setLastTimestamp(Number(lastCollectFees.timestamp))
  }, [owner, poolAddress, tickLower, tickUpper])

  return useMemo(() => {
    if (!lastTimestamp || !fiatValueOfFees || !fiatValueOfLiquidity) {
      return {
        apr: undefined,
        currentTimestamp: undefined,
        createPositionTimestamp: createTimestamp,
        lastCollectFeesTimestamp: lastTimestamp,
      }
    }
    const a = new Date(createTimestamp! * 1000)
    const currentTimestamp: number = new Date().getTime() / 1000
    return {
      apr: ((fiatValueOfFees / fiatValueOfLiquidity) * (365 * 24 * 60 * 60)) / (currentTimestamp - lastTimestamp),
      currentTimestamp,
      createPositionTimestamp: createTimestamp,
      lastCollectFeesTimestamp: lastTimestamp,
    }
  }, [lastTimestamp, fiatValueOfFees, fiatValueOfLiquidity])
}

export function useAPR(
  tokenId: number | undefined,
  owner: string | undefined,
  fiatValueOfLiquidity: number | undefined,
  fiatValueOfFees: number | undefined
) {
  const { mints, burns } = usePositionMintAndBurnDataWithoutFixData(tokenId, owner)

  return useMemo(() => {
    if (
      !mints ||
      !burns ||
      !tokenId ||
      !owner ||
      typeof fiatValueOfFees === 'undefined' ||
      typeof fiatValueOfLiquidity === 'undefined'
    ) {
      return {
        apr: undefined,
        currentTimestamp: undefined,
        createPositionTimestamp: undefined,
        lastCollectFeesTimestamp: undefined,
      }
    }
    if (isNaN(fiatValueOfLiquidity) || isNaN(fiatValueOfFees)) {
      return {
        apr: Number.NaN,
        currentTimestamp: Number.NaN,
        createPositionTimestamp: Number.NaN,
        lastCollectFeesTimestamp: Number.NaN,
      }
    }

    const newMints = [...mints]
    const newBurns = [...burns]
    if (newMints.length === 0) {
      return {
        apr: Number.NaN,
        currentTimestamp: Number.NaN,
        createPositionTimestamp: Number.NaN,
        lastCollectFeesTimestamp: Number.NaN,
      }
    }
    newMints.sort((a, b) => {
      return Number(a.timestamp) - Number(b.timestamp)
    })
    const create = newMints[0]
    let lastCollectFees = undefined
    if (burns.length > 0) {
      newBurns.sort((a, b) => {
        return Number(b.timestamp) - Number(a.timestamp)
      })
      lastCollectFees = newBurns[0]
    } else {
      lastCollectFees = create
    }
    const createTimestamp = Number(create.timestamp)
    const lastTimestamp = Number(lastCollectFees.timestamp)

    const currentTimestamp: number = new Date().getTime() / 1000
    return {
      apr: ((fiatValueOfFees / fiatValueOfLiquidity) * (365 * 24 * 60 * 60)) / (currentTimestamp - lastTimestamp),
      currentTimestamp,
      createPositionTimestamp: createTimestamp,
      lastCollectFeesTimestamp: lastTimestamp,
    }
  }, [mints, burns, tokenId, owner, fiatValueOfFees, fiatValueOfLiquidity])
}

export function usePositionDuration(
  mints: MintSchema[] | undefined,
  burns: BurnSchema[] | undefined,
  removed: boolean | undefined
) {
  return useMemo(() => {
    // if (!mints || !burns) return undefined
    if (typeof removed === 'undefined') return undefined
    const txs = combineMintsAndBurns(mints, burns, 'asc')
    if (!txs) return undefined
    if (txs.length < 1) return Number.NaN

    const BigNumberZero = new BigNumber(0)
    const positionDuration = txs.reduce(
      (t, v) => {
        if (t.lastAmount.gt(0)) {
          t.duration += Number(v.timestamp) - t.lastTime
          t.lastTime = Number(v.timestamp)
        } else {
          t.lastTime = Number(v.timestamp)
        }
        if (v.type === TxActionType.INCREASE) {
          t.lastAmount = t.lastAmount.plus(v.amount)
        } else if (v.type === TxActionType.DECREASE) {
          t.lastAmount = t.lastAmount.minus(v.amount)
        }
        return t
      },
      { duration: 0, lastTime: Number.NaN, lastAmount: BigNumberZero }
    )
    let duration = positionDuration.duration
    const lastTime = positionDuration.lastTime
    if (!removed) {
      const currentTime = Number((new Date().getTime() / 1000).toFixed(0))
      duration += currentTime - lastTime
    }
    return duration !== 0 ? duration : Number.NaN
  }, [mints, burns, removed])
}

type PriceFormatType = Price<Token, Token> | BigNumber | number | undefined
export function useSpreadRange(
  priceLower: PriceFormatType,
  priceUpper: PriceFormatType,
  format: 'number' | 'percentage' = 'number',
  fixed = 4
) {
  let range: number | string | undefined = undefined
  if (typeof priceLower === 'number' && typeof priceUpper === 'number') {
    range = ((priceUpper - priceLower) / priceLower).toFixed(fixed)
  } else if (priceLower instanceof BigNumber && priceUpper instanceof BigNumber) {
    range = priceUpper.minus(priceLower).dividedBy(priceLower).toFixed(fixed)
  } else if (priceLower instanceof Price && priceUpper instanceof Price) {
    range = priceUpper.subtract(priceLower).divide(priceLower).toFixed(fixed)
  }
  if (range) {
    if (format === 'number') {
      range = Number(range)
    } else if (format === 'percentage') {
      range = Number(range)
      if (range >= 100) {
        range = range.toExponential(2) + '%'
      } else {
        range = (Number(range) * 100).toFixed(2) + '%'
      }
    }
  }
  return range
}
