import BigNumber from 'bignumber.js'
import { logAddress, topic_Collect, topic_DecreaseLiquidity } from 'constants/position'
import { BurnSchema, MintSchema } from 'data/GRTResultSchema'
import { ethers } from 'ethers'

import { BlockchainProvider } from './blockchainprovider'

export async function getRealDecreaseAndFeeAmount(txid: string, decimals0: number, decimals1: number, chainId = 1) {
  const provider = BlockchainProvider.getDefaultProvider(chainId)
  const receipt = await provider?.getTransactionReceipt(txid)
  if (!receipt) {
    return undefined
  }
  const precision0 = new BigNumber(10).pow(decimals0)
  const precision1 = new BigNumber(10).pow(decimals1)
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

  const fee0 = collect0.minus(decrease0)
  const fee1 = collect1.minus(decrease1)
  return {
    decreaseAmount: decreaseAmount.toString(),
    decreaseAmount0: decrease0.dividedBy(precision0).toString(),
    decreaseAmount1: decrease1.dividedBy(precision1).toString(),
    feeAmount0: fee0.dividedBy(precision0).toString(),
    feeAmount1: fee1.dividedBy(precision1).toString(),
    // gasPrice: receipt['gas'].toString(),
    gasUsed: receipt['gasUsed'].toString(),
  }
}

export function combineMintsAndBurns(
  mints: MintSchema[] | undefined,
  burns: BurnSchema[] | undefined,
  orderDirection: 'asc' | 'desc' = 'desc'
) {
  if (!mints || !burns) return undefined
  const txs = [...mints, ...burns]
  if (txs.length < 1) return []
  switch (orderDirection) {
    case 'asc':
      txs.sort((a, b) => {
        return Number(a.timestamp) - Number(b.timestamp)
      })
      break
    case 'desc':
      txs.sort((a, b) => {
        return Number(b.timestamp) - Number(a.timestamp)
      })
      break
    default:
      txs.sort((a, b) => {
        return Number(b.timestamp) - Number(a.timestamp)
      })
      break
  }
  return txs
}
