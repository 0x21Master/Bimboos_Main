import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, AppState } from '../index'
import { updatePositionRemind } from './actions'
import { positionData } from './reducer'

export function usePositionRemindState(): AppState['positionRemind'] {
  return useSelector<AppState, AppState['positionRemind']>((state) => state.positionRemind)
}

export function useUpdatePositionRemind(): {
  onUpdatePositionRemind: (positions: positionData[]) => void
} {
  const dispatch = useDispatch<AppDispatch>()

  const onUpdatePositionRemind = useCallback(
    (positions: positionData[]) => {
      dispatch(
        updatePositionRemind({
          positions,
        })
      )
    },
    [dispatch]
  )

  return {
    onUpdatePositionRemind,
  }
}
