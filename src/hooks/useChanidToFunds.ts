import { useMemo } from 'react'
import { useActiveWeb3React } from './web3'
import { FUNDS, SupportChainId } from '../constants/funds'

import { default_chainId } from '../connectors'

export function useChanidToFunds() {
  const { chainId } = useActiveWeb3React()

  return useMemo(() => {
    if (!chainId) return FUNDS[default_chainId]
    console.log(SupportChainId[chainId])

    if (!SupportChainId[chainId]) return FUNDS[default_chainId]
    return FUNDS[chainId]
  }, [chainId])
}
