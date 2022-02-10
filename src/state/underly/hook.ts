import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, AppState } from '../index'
import { updateUnderly } from './actions'
import { underlyData } from './reducer'

export function useUnderlyState(): AppState['underly'] {
  return useSelector<AppState, AppState['underly']>((state) => state.underly)
}

export function useUpdateUnderlyData(): {
  onUpdateUnderlyData: (underlyList: underlyData) => void
} {
  const dispatch = useDispatch<AppDispatch>()

  const onUpdateUnderlyData = useCallback(
    (underly: underlyData) => {
      dispatch(
        updateUnderly({
          underly,
        })
      )
    },
    [dispatch]
  )

  return {
    onUpdateUnderlyData,
  }
}
