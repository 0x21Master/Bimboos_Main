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
import bgImg from '../../assets/HomePage_imgs/sasse/wrap-top.png'
import mintBtn from '../../assets/HomePage_imgs/sasse/mint-btn.png'
import textOne from '../../assets/HomePage_imgs/sasse/text-one.png'
import middleBg from '../../assets/HomePage_imgs/sasse/middle-bg.png'
import middlePeople from '../../assets/HomePage_imgs/sasse/middle-people.png'
import textTwo from '../../assets/HomePage_imgs/sasse/text-two.png'
import footerImg from '../../assets/HomePage_imgs/sasse/footer.png'
import twitter from '../../assets/HomePage_imgs/sasse/twitter.png'
import discord from '../../assets/HomePage_imgs/sasse/discord.png'
import opensea from '../../assets/HomePage_imgs/sasse/opensea.png'
import etherscan from '../../assets/HomePage_imgs/sasse/etherscan.png'
import ins from '../../assets/HomePage_imgs/sasse/ins.png'
import Web3Status from 'components/Web3Status'
export default function Home() {
  const [mintNum, setMintNum] = useState<number>(1)
  const [errMsg, setErrMsg] = useState<string>('none')
  const [open, setOpen] = useState(false)
  const [isShoWallet, setIsShoWallet] = useState(false)

  const contract = useBlindBoxAbi()
  const { account, chainId, library } = useActiveWeb3React()
  const signer = library?.getSigner()

  const mint = async () => {
    if (!account) {
      setIsShoWallet(true)
      return
    }
    if (!signer) {
      return
    }

    if (mintNum === 0) {
      setErrMsg('Please enter a valid number')
      setOpen(true)
      return
    }
    const isWhiteAddress = await postWhiteList({ address: account ?? '' })
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
    if (Number(e.target.value) >= 1 && Number(e.target.value) <= 3) {
      setMintNum(Number(e.target.value))
    } else {
      setMintNum(1)
      setErrMsg('Please enter a valid number')
      setOpen(true)
    }
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
  useEffect(() => {
    if (account) {
      setIsShoWallet(false)
    }
  }, [account])
  return (
    <>
      <div className="wrap">
        <div className="wrap-top">
          <img className="bg-img" src={bgImg} alt="" />
          <div className="link-group">
            {[twitter, discord, opensea, etherscan].map((imgItem, index) => (
              <img key={index} src={imgItem}></img>
            ))}
          </div>
          <img className="mint-img" src={mintBtn} onClick={mint} alt="" />
          <img className="opensea-img" src={opensea} alt="" />
        </div>
        <div className="wrap-content">
          <img className="text-one" src={textOne} alt="" />
          <div className="content-middle">
            <img className="middle-bg" src={middleBg} alt="" />
            <img className="middle-people" src={middlePeople} alt="" />
            <img className="text-two" src={textTwo} alt="" />
            <div className="chat-icon">
              <img className="twitter-img" src={twitter} alt="" />
              <img className="discord-img" src={discord} alt="" />
              <img className="ins-img" src={ins} alt="" />
            </div>
            <div className="content-text">
              <p className="left-text">
                Leave the drab reality and enter the world of Karafuru. It’s a magical space where colors reign supreme
                and everyone just wants to have fun. Give it a spin and see which one of our personas you get.
              </p>
              <p className="right-text">
                These personas are your ticket into the playground with the coolest crew in town. More NFTs to drop.
                More mediums to come. It is a brave new digital world. Come over and play.
              </p>
            </div>
          </div>
        </div>
        <div className="wrap-bottom">
          <img src={footerImg} alt="" />
        </div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{errMsg}</DialogTitle>
        </Dialog>
        {isShoWallet && <Web3Status setWallet={setIsShoWallet} />}
      </div>
    </>
  )
}
