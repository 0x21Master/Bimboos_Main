/* eslint-disable no-var */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
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
import bg_body from "../../assets/HomePage_imgs/sasse/bg_body.png"
import body_export from "../../assets/HomePage_imgs/sasse/body_export.png"
import Sucessful from "../../assets/HomePage_imgs/sasse/Sucessful.png"
import openaes from  "../../assets/HomePage_imgs/sasse/openaes.png"
import Groupimg from "../../assets/HomePage_imgs/sasse/Groupimg.png"
import CheckEtherscan from "../../assets/HomePage_imgs/sasse/CheckEtherscan.png"
import mintgorme from "../../assets/HomePage_imgs/sasse/mintgorme.png"
import mastmarsk from  "../../assets/HomePage_imgs/sasse/metamask.png"
import buy from  "../../assets/HomePage_imgs/sasse/buy.png"
import mint_img from "../../assets/HomePage_imgs/sasse/mint.png"
import time from "../../assets/HomePage_imgs/sasse/time.png"
import metamask1 from "../../assets/HomePage_imgs/sasse/metamask1.png"
import taranstr from  "../../assets/HomePage_imgs/sasse/taranstr.png"
import body_text from "../../assets/HomePage_imgs/sasse/body_text.png"
import Mint_two from "../../assets/HomePage_imgs/sasse/Mint_two.png"
import up from "../../assets/HomePage_imgs/sasse/up.png"
import out from "../../assets/HomePage_imgs/sasse/out.png"
import Blackbackground from "../../assets/HomePage_imgs/sasse/Blackbackground.png"
import Web3Status from 'components/Web3Status'
import { number } from '@lingui/core/cjs/formats'
export default function Home() {
  const [mintNum, setMintNum] = useState<number>(1)
  const [errMsg, setErrMsg] = useState<string>('none')
  const [open, setOpen] = useState(false)
  const [isShoWallet, setIsShoWallet] = useState(false)
  const [initialvalue,setinitialvalue] = useState<any>(0)
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
  const but=()=>{let arrs = 0;
    setinitialvalue({initialvalue:arrs++
    })
  }
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
        </div>
        <div className="wrap-content">
          <img className="text-one" src={textOne} alt="" />
          <div className="content-middle">
            <img className="middle-bg" src={bg_body} alt="" />
            <img className="text-two" src={textTwo} alt="" /> 
            <div className="chat-icon">
            </div>
            <div className="content-text">
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
      {/* success*/}
      <div className='open-site'>
            <img  className='metamask1-img' src={metamask1}/>

            <img className="opensea-img" src={opensea} alt="" />

            <img className='Sucessful-img' src={Sucessful} alt=''/>
            <img className='openaes-img' src={openaes}/>
            <img className='body_export-img' src={body_export}/>
      </div>
      {/* failure */}
      {/* <div className='open-site'>
              <img className="opensea-img" src={etherscan} alt="" />
              <img  className='metamask1-img' src={metamask1}/>
             <img className='Groupimg' src={Groupimg} alt=''/>
             <img className='CheckEtherscan-img' src={CheckEtherscan}/>
             <img className='body_export-img1' src={body_export}/>
      </div> */}
       {/* Before login */}
      {/* <div className='open-site'>
             <img className='buy-img' src={buy}/>
              <img className='mint-img' src={mint_img} alt=''/>
              <img className='mastmarsk-img' src={mastmarsk}/>
              <img className='time-img' src={time}/> 
              <img className='buy-img' src={buy}/>
        </div> */}
          {/* Before login two */}
        <div className='open-site'>
            <img className='mint-img' src={mint_img} alt=''/>
            <img className='mastmarsk-img' src={mastmarsk}/>
            <img className='buy-img' src={buy}/>
            <img className='time-img' src={time}/> 
          <img className='taranstr-img' src={taranstr}/>
        </div>
        {/* After the failure */}
        {/* <div className='open-site'>
            <img className='Blackbackground-img' src={Blackbackground} alt=''/> 
            <img className='buy-img' src={buy}/>
            <img className='time-img' src={time}/> 
            <img className='body_text-img' src={body_text}/>
            <img className='out-img' src={out} onClick={but} />
            <p>{initialvalue}</p>
            <img className='up-img' src={up}/>
            <img className='Mint_two-img' src={Mint_two} />
        </div> */}
    </>
  )
}
