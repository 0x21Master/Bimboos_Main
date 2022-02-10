import { Uo1StrategyAbi } from 'abis/types'
import { useSingleCallResult } from 'state/multicall/hooks'

export function useStrategyUnderlyings(contract: Uo1StrategyAbi | null): string | undefined {
  const res = useSingleCallResult(contract, 'getUnderlyings')

  return res?.result?.[0]?.toString()
  // if (typeof underlyings === 'string') {
  //   return underlyings.split(',')
  // }
  // return []
}

export function useStrategyWorksPos(contract: Uo1StrategyAbi | null): string | undefined {
  const res = useSingleCallResult(contract, 'worksPos')
  return res?.result?.[0]?.toString()
}
