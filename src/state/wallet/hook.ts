import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, AppState } from '../index'
import { updateChooseWallet, updateShowInfo } from './actions'

export function useWalletState(): AppState['wallet'] {
  return useSelector<AppState, AppState['wallet']>((state) => state.wallet)
}

export function useUpdateWallet(): {
  onUpdateChooseWallet: (showChooses: boolean) => void
  onUpdateShowInfo: (showInfo: boolean) => void
} {
  const dispatch = useDispatch<AppDispatch>()

  const onUpdateChooseWallet = useCallback(
    (showChooses: boolean) => {
      dispatch(
        updateChooseWallet({
          showWalletChoose: showChooses,
        })
      )
    },
    [dispatch]
  )
  const onUpdateShowInfo = useCallback(
    (showInfo: boolean) => {
      dispatch(
        updateShowInfo({
          showWalletInfo: showInfo,
        })
      )
    },
    [dispatch]
  )

  return {
    onUpdateChooseWallet,
    onUpdateShowInfo,
  }
}
