import { Token } from '@uniswap/sdk-core'
import { ITokenItem } from 'constants/tokens'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, AppState } from './../index'
import { updateStrategyPosition, updateStrategyUnderly } from './actions'
import { IMiniToken, IPositionItem, IStrategyContracts } from './reducer'

export function useStrategyState(): AppState['strategy'] {
  return useSelector<AppState, AppState['strategy']>((state) => state.strategy)
}

export function useUpdateStrategyData(): {
  onUpdateStrategyUnderly: (strategyAddress: string, tokenAddress: string, tokenItem: IMiniToken) => void
  onUpdateStrategyPosition: (strategyAddress: string, tokenId: string, positionItem: IPositionItem) => void
} {
  const dispatch = useDispatch<AppDispatch>()

  const onUpdateStrategyUnderly = useCallback(
    (strategyAddress, tokenAddress, tokenItem) => {
      dispatch(
        updateStrategyUnderly({
          strategyAddress,
          tokenAddress,
          tokenItem,
        })
      )
    },
    [dispatch]
  )
  const onUpdateStrategyPosition = useCallback(
    (strategyAddress, tokenId, positionItem) => {
      dispatch(
        updateStrategyPosition({
          strategyAddress,
          tokenId,
          positionItem,
        })
      )
    },
    [dispatch]
  )

  return { onUpdateStrategyUnderly, onUpdateStrategyPosition }
}

export function useGetStrategyData(): {
  getMiniTokenByAddress: (strategyAddress: string, tokenAddress: string, states: IStrategyContracts) => IMiniToken
  getMiniTokenById: (strategyAddress: string, tokenId: string, states: IStrategyContracts) => IPositionItem
} {
  const getMiniTokenByAddress = useCallback(
    (strategyAddress: string, tokenAddress: string, states: IStrategyContracts) => {
      const miniTokenData = states.underlyings[strategyAddress][tokenAddress]
      console.log('strategyAddress:', states.underlyings)

      return miniTokenData
    },
    []
  )
  const getMiniTokenById = useCallback((strategyAddress: string, tokenId: string, states: IStrategyContracts) => {
    const miniTokenData = states.positions[strategyAddress][tokenId]
    console.log('strategyAddress:', states.underlyings)

    return miniTokenData
  }, [])
  return { getMiniTokenByAddress, getMiniTokenById }
}
