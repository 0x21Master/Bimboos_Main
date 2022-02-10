import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from 'state'

import { updateProviderKey, updateProviderType } from './actions'

export function useSettingState(): AppState['settings'] {
  return useSelector<AppState, AppState['settings']>((state) => state.settings)
}

export function useUpdateProviderSetting(): {
  onUpdateProviderType: (providerType: string) => void
  onUpdateProviderKey: (providerKey: string) => void
} {
  const dispatch = useDispatch<AppDispatch>()

  const onUpdateProviderType = useCallback(
    (providerType: string) => {
      dispatch(
        updateProviderType({
          providerType,
        })
      )
    },
    [dispatch]
  )

  const onUpdateProviderKey = useCallback(
    (providerKey: string) => {
      dispatch(
        updateProviderKey({
          providerKey,
        })
      )
    },
    [dispatch]
  )

  return {
    onUpdateProviderType,
    onUpdateProviderKey,
  }
}
