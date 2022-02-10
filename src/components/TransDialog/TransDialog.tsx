import { useActiveWeb3React } from 'hooks/web3'
import { Snackbar } from '@material-ui/core'
import TransactionConfirmationModal, { TransactionErrorContent } from '../TransactionConfirmationModal'
interface TransDialogProps {
  modalStatus: boolean
  confirmStatus: boolean
  isRefuse: boolean
  handleClose: () => void
  migrationHash: string
}
import { Alert } from '@mui/material'
import styled from 'styled-components/macro'
import { useCallback, useEffect, useState } from 'react'

export default function TransDialog({
  modalStatus,
  confirmStatus,
  isRefuse,
  handleClose,
  migrationHash,
}: TransDialogProps) {
  const { chainId, account, library } = useActiveWeb3React()

  const [dialogOpen, setDialogOpen] = useState<boolean>(modalStatus || confirmStatus)
  useEffect(() => {
    setDialogOpen(modalStatus || confirmStatus || isRefuse)
    if (!library) {
      return
    }
  }, [modalStatus, confirmStatus, isRefuse])

  const confirmationContent = useCallback(() => {
    return isRefuse && <TransactionErrorContent onDismiss={handleClose} message="交易被拒绝" />
  }, [isRefuse])
  return (
    <TransactionConfirmationModal
      isOpen={dialogOpen}
      onDismiss={handleClose}
      attemptingTxn={modalStatus}
      hash={migrationHash}
      content={confirmationContent}
      pendingText={''}
    />
  )
}
function TransAlert({ state, showAlert }: { state: string; showAlert: boolean }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    setOpen(true)
  }, [showAlert])

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }
  return (
    <>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={state === 'success' ? 'success' : 'error'} sx={{ width: '100%' }}>
          {state === 'success' ? '交易成功' : '交易失败'}
        </Alert>
      </Snackbar>
    </>
  )
}
