/* eslint-disable prettier/prettier */
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components/macro'
import './css/wrap.css'
import { useBlindBoxAbi } from 'hooks/useContract'
import { BigNumber as BN } from '@ethersproject/bignumber'
import { useActiveWeb3React } from 'hooks/web3'
// import BigNumber from 'bignumber.js'
// import {useBlindBoxAbi}
import Header from 'components/Header'
import { utils } from 'ethers/lib/ethers'
import { ChangeEvent, useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { postWhiteList } from 'apis/whiteList'
import { Dialog, DialogTitle } from '@material-ui/core'

export default function Home() {
  const [mintNum, setMintNum] = useState<number>(0)
  const [errMsg, setErrMsg] = useState<string>('none')
  const [open, setOpen] = useState(false)

  const contract = useBlindBoxAbi()
  const { account, chainId, library } = useActiveWeb3React()
  const signer = library?.getSigner()

  const mint = async () => {
    // console.log(account)
    const isWhiteAddress = await postWhiteList({ address: account ?? '' })
    if (!signer || !account) {
      return
    }
    if (mintNum === 0) {
      setErrMsg('Please enter a valid number')
      setOpen(true)
      return
    }
    if (!isWhiteAddress.data.status) {
      setErrMsg('No purchase permission')
      setOpen(true)
      return
    }
    const signerContract = contract?.connect(signer)

    const mintPrice = await signerContract?.mintPrice()
    const totalMintPrice = new BigNumber(mintPrice?.toString() ?? 0)
      .times(mintNum)
      .dividedBy(10 ** 18)
      .toString()

    const overrides = {
      value: utils.parseEther(totalMintPrice),
    }
    signerContract?.mintNicMeta(mintNum, overrides)
  }
  const changeMintNum = (e: ChangeEvent<HTMLInputElement>) => {
    setMintNum(Number(e.target.value))
  }
  const handleClose = () => {
    setOpen(false)
  }
  const reveal = async () => {
    if (!signer) {
      return
    }
    const signerContract = contract?.connect(signer)

    signerContract?.flipReveal().then(async () => {
      const isRevealed = await signerContract?._revealed()
      console.log(isRevealed)

      if (isRevealed) {
        setErrMsg('Blind box is closed')
        setOpen(true)
        return
      }

      setErrMsg('Blind box is open')
      setOpen(true)
    })
  }
  return (
    <>
      <div className="wrap">
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{errMsg}</DialogTitle>
        </Dialog>
        <input type="number" onChange={changeMintNum} value={mintNum} />
        <button onClick={mint}>mint</button>
        <button onClick={reveal}>reveal</button>
      </div>
    </>
  )
}
