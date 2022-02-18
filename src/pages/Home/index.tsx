/* eslint-disable no-var */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import styled from 'styled-components/macro'
import './css/wrap.css'
import { useBlindBoxAbi } from 'hooks/useContract'
import { BigNumber as BN } from '@ethersproject/bignumber'
import { useActiveWeb3React } from 'hooks/web3'
// import BigNumber from 'bignumber.js'
// import {useBlindBoxAbi}
import Header from 'components/Header'
import { utils } from 'ethers/lib/ethers'
import { ChangeEvent, useState, useEffect, useMemo } from 'react'
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
import bg_body from '../../assets/HomePage_imgs/sasse/bg_body.png'
import body_export from '../../assets/HomePage_imgs/sasse/body_export.png'
import Sucessful from '../../assets/HomePage_imgs/sasse/Sucessful.png'
import openaes from '../../assets/HomePage_imgs/sasse/openaes.png'
import Groupimg from '../../assets/HomePage_imgs/sasse/Groupimg.png'
import CheckEtherscan from '../../assets/HomePage_imgs/sasse/CheckEtherscan.png'
import mintgorme from '../../assets/HomePage_imgs/sasse/mintgorme.png'
import mastmarsk from '../../assets/HomePage_imgs/sasse/metamask.png'
import buy from '../../assets/HomePage_imgs/sasse/buy.png'
import mint_img from '../../assets/HomePage_imgs/sasse/mint.png'
import time from '../../assets/HomePage_imgs/sasse/time.png'
import metamask1 from '../../assets/HomePage_imgs/sasse/metamask1.png'
import taranstr from '../../assets/HomePage_imgs/sasse/taranstr.png'
import body_text from '../../assets/HomePage_imgs/sasse/body_text.png'
import Mint_two from '../../assets/HomePage_imgs/sasse/Mint_two.png'
import up from '../../assets/HomePage_imgs/sasse/up.png'
import out from '../../assets/HomePage_imgs/sasse/out.png'
import MintStartIn from '../../assets/HomePage_imgs/sasse/MintStartIn.png'
import CounDown from '../../assets/HomePage_imgs/sasse/CounDown.png'
import Blackbackground from '../../assets/HomePage_imgs/sasse/Blackbackground.png'
import soldOut from '../../assets/HomePage_imgs/sasse/soldOut.png'
import Web3Status from 'components/Web3Status'
import { number } from '@lingui/core/cjs/formats'
import { SUPPORTED_WALLETS } from 'constants/wallet'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { useWalletConnectMonitoringEventCallback } from 'hooks/useMonitoringEventCallback'
import usePrevious from 'hooks/usePrevious'
import { isTransactionRecent, useAllTransactions } from 'state/transactions/hooks'
import { TransactionDetails } from 'state/transactions/reducer'
import useENSName from 'hooks/useENSName'

function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}
export default function Home() {
  const WALLET_VIEWS = {
    OPTIONS: 'options',
    OPTIONS_SECONDARY: 'options_secondary',
    ACCOUNT: 'account',
    PENDING: 'pending',
    LEGAL: 'legal',
  }
  const [mintNum, setMintNum] = useState<number>(1)
  const [errMsg, setErrMsg] = useState<string>('none')
  const [open, setOpen] = useState(false)
  const [isShoWallet, setIsShoWallet] = useState(false)
  const [totalsupply, setTotalsupply] = useState<string>('0')
  const [times, setTimes] = useState<string>('00:00:00')
  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT)
  const [isMint, setIsMint] = useState<string>('')

  const [pendingWallet, setPendingWallet] = useState<AbstractConnector | undefined>()

  const [pendingError, setPendingError] = useState<boolean>()
  const contract = useBlindBoxAbi()
  const { active, account, connector, activate, error, library } = useWeb3React()
  const logMonitoringEvent = useWalletConnectMonitoringEventCallback()
  const activePrevious = usePrevious(active)
  const connectorPrevious = usePrevious(connector)
  useEffect(() => {
    if (active || (connector && connector !== connectorPrevious && !error)) {
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [setWalletView, active, error, connector, activePrevious, connectorPrevious])
  const { ENSName } = useENSName(account ?? undefined)
  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])
  const signer = library?.getSigner()
  //   const pendingHash = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash)
  //   const confirmed = sortedRecentTransactions.filter((tx) => tx.receipt).map((tx) => tx.hash)

  //   const tx = allTransactions?.[pendingHash[0]]
  //   const info = tx?.info
  //   const pending = !tx?.receipt
  //   const success = !pending && tx && (tx.receipt?.status === 1 || typeof tx.receipt?.status === 'undefined')

  useEffect(() => {
    const signerContract = contract?.connect(signer)
    if (!account) {
      return
    }
    signerContract?.totalSupply().then((res) => {
      setTotalsupply(res.toString())
    })
  }, [account])
  const mint = async () => {
    if (!account) {
      setIsShoWallet(true)
      return
    }
    if (!signer) {
      return
    }
    if (totalsupply === '7000') {
      setErrMsg('sold out')
      setOpen(true)
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
    const ownerBalanceOf = await signerContract?.balanceOf(account)
    const isActiveMint = await signerContract?._isSaleActive()
    if (!isActiveMint) {
      setErrMsg('Not yet on sale')
      setOpen(true)
      return
    }
    if (Number(ownerBalanceOf?.toString() || 0) >= 3) {
      setErrMsg('No one buys three')
      setOpen(true)
      return
    }
    const mintPrice = await signerContract?.mintPrice()
    const totalMintPrice = new BigNumber(mintPrice?.toString() ?? 0)
      .times(mintNum)
      .dividedBy(10 ** 18)
      .toString()

    const overrides = {
      value: utils.parseEther(totalMintPrice),
    }
    signerContract
      ?.devMint(mintNum, overrides)
      .then((res) => {
        setIsMint('succse')
        setMintNum(1)
      })
      .catch(() => {
        setIsMint('faild')
        setMintNum(1)
      })
  }
  const tryActivation = async (connector: AbstractConnector | undefined) => {
    let name = ''
    Object.keys(SUPPORTED_WALLETS).map((key) => {
      if (connector === SUPPORTED_WALLETS[key].connector) {
        return (name = SUPPORTED_WALLETS[key].name)
      }
      return true
    })
    // log selected wallet

    setPendingWallet(connector) // set wallet for pending view
    setWalletView(WALLET_VIEWS.PENDING)

    // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
    if (connector instanceof WalletConnectConnector) {
      connector.walletConnectProvider = undefined
    }

    connector &&
      activate(connector, undefined, true)
        .then(async () => {
          const walletAddress = await connector.getAccount()
          logMonitoringEvent({ walletAddress })
        })
        .catch((error) => {
          if (error instanceof UnsupportedChainIdError) {
            activate(connector) // a little janky...can't use setError because the connector isn't set
          } else {
            setPendingError(true)
          }
        })
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

  const but = () => {
    if (mintNum < 3) {
      const arrs = mintNum + 1
      setMintNum(arrs)
    }
  }

  const outnum = () => {
    if (mintNum > 1) {
      const arrs = mintNum - 1

      setMintNum(arrs)
    }
  }
  const toHHmmss = (data: number) => {
    var time
    var hours = parseInt(((data % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString())
    var minutes = parseInt(((data % (1000 * 60 * 60)) / (1000 * 60)).toString())
    var seconds = parseInt(((data % (1000 * 60)) / 1000).toString())
    time =
      (hours < 10 ? '0' + hours : hours) +
      ':' +
      (minutes < 10 ? '0' + minutes : minutes) +
      ':' +
      (seconds < 10 ? '0' + seconds : seconds)
    return time
  }
  const showCountdown = (currTime: number) => {
    const openMint = 1645272000000

    const times = toHHmmss(openMint - currTime)
    setTimes(times)
  }
  let currTime = new Date().valueOf()

  useEffect(() => {
    setInterval(() => {
      currTime = currTime + 1000
      showCountdown(currTime)
    }, 1000)
  }, [])
  const showMiddle = () => {
    if (error) {
      return (
        <div className="open-site">
          <img className="mint-img" src={mint_img} alt="" />
          <img className="mastmarsk-img" src={mastmarsk} />
          <img className="buy-img" src={buy} />
          <div className="time-img-box">
            <img className="time-img" src={MintStartIn} />
            <span>{times}</span>
          </div>
          <img className="taranstr-img" src={taranstr} />
        </div>
      )
    }
    if (totalsupply === '7000') {
      return (
        <div className="open-site">
          <img className="metamask1-img" src={soldOut} />
        </div>
      )
    }
    if (account && walletView === WALLET_VIEWS.ACCOUNT && isMint !== 'succse' && isMint !== 'faild') {
      return (
        <div className="open-site">
          <img className="Blackbackground-img" src={Blackbackground} alt="" />
          <img className="buy-img" src={buy} />
          <div className="time-img-box">
            <img className="time-img" src={CounDown} />
            <span>{times}</span>
          </div>
          <div className="body_text_box">
            {totalsupply}/
            <img className="body_text-img" src={body_text} />
          </div>

          <img className="out-img" src={out} onClick={outnum} />
          <p>{mintNum}</p>
          <img className="up-img" src={up} onClick={but} />
          <img className="Mint_two-img" src={Mint_two} onClick={mint} />
        </div>
      )
    }
    if (account && isMint === 'succse') {
      return (
        <div className="open-site">
          <img className="metamask1-img" src={metamask1} />

          <img className="opensea-img" src={opensea} alt="" />

          <img
            className="Sucessful-img"
            src={Sucessful}
            alt=""
            onClick={() => {
              window.open('https://opensea.io/account')
            }}
          />
          <img
            className="openaes-img"
            src={openaes}
            onClick={() => {
              window.open('https://opensea.io/account')
            }}
          />
          <img
            className="body_export-img"
            src={body_export}
            onClick={() => {
              window.open('https://opensea.io/account')
            }}
          />
        </div>
      )
    }
    if (account && isMint === 'faild') {
      return (
        <div className="open-site">
          <img className="opensea-img" src={etherscan} alt="" />
          <img className="metamask1-img" src={metamask1} />
          <img className="Groupimg" src={Groupimg} alt="" />
          <img
            className="CheckEtherscan-img"
            src={CheckEtherscan}
            onClick={() => {
              window.open(`https://etherscan.io`)
            }}
          />
          <img
            className="body_export-img1"
            src={body_export}
            onClick={() => {
              window.open('https://etherscan.io')
            }}
          />
        </div>
      )
    }
    return walletView === WALLET_VIEWS.PENDING ? (
      pendingError ? (
        <div className="open-site">
          <img className="mint-img" src={mint_img} alt="" />
          <img
            className="mastmarsk-img"
            src={mastmarsk}
            onClick={() => {
              SUPPORTED_WALLETS['METAMASK'].connector !== connector &&
                !SUPPORTED_WALLETS['METAMASK'].href &&
                tryActivation(SUPPORTED_WALLETS['METAMASK'].connector)
            }}
          />
          <img className="buy-img" src={buy} />

          <img className="taranstr-img" src={taranstr} />
        </div>
      ) : (
        <div>pendding</div>
      )
    ) : (
      <div>{showWalletStatus()}</div>
    )
  }
  const showWalletStatus = () => {
    return (
      <div className="open-site">
        <img className="buy-img" src={buy} />
        <img className="mint-img" src={mint_img} alt="" />
        <img
          className="mastmarsk-img"
          src={mastmarsk}
          onClick={() => {
            SUPPORTED_WALLETS['METAMASK'].connector !== connector &&
              !SUPPORTED_WALLETS['METAMASK'].href &&
              tryActivation(SUPPORTED_WALLETS['METAMASK'].connector)
          }}
        />
        {/* <img className="time-img" src={time} /> */}
        <img className="buy-img" src={buy} />
      </div>
    )
  }
  return (
    <>
      <div className="wrap">
        <div className="wrap-top">
          <img className="bg-img" src={bgImg} alt="" />
          <div className="link-group">
            {/* {[twitter, discord, opensea, etherscan].map((imgItem, index, herf) => (
              <img key={index} src={imgItem}></img>
            ))} */}
            <a href="https://twitter.com/Dream_Bimbos" target="_blank" rel="noreferrer">
              <img src={twitter} />
            </a>
            <a href="https://discord.gg/xworldgames" target="_blank" rel="noreferrer">
              <img src={discord} />
            </a>
            <a href="https://opensea.io/collection/dreamcardbimbos" target="_blank" rel="noreferrer">
              <img src={opensea} />
            </a>
            <a href="https://etherscan.io" target="_blank" rel="noreferrer">
              <img src={etherscan} />
            </a>
          </div>
          <img
            className="mint-img"
            src={mintBtn}
            alt=""
            onClick={() => {
              document.documentElement.scrollTop = 590
            }}
          />
        </div>
        <div className="wrap-content" id="wrap-content">
          {/* <img className="text-one" src={textOne} alt="" /> */}
          <div className="text-one">
            <p>
              Michaela * Gaia * Emani * Amoura * Naomi * Rosey * Tiara * Kagura * Lamia * Luna * Fiona * Dawn * Fiora *
              Valentina *Ivy * Artemis * Athena * Skylar * Kim * Gigi * Yves * Isabella * Sophia * Lucinda * Blanc *
              Margot * Adeline * Harper * Dina * Abigail * Siren * Arya * Alaia * Cardi * Quinn * Vivianna * Wind *
              Aurora * Kana * Yazakura * Munehiko * Adaira * Smego * Squire * Sylph * Ling * Bell * Sakura * Mousse *
              Yoyo * Celia * Xayah * Lilith * Camilla * Sasha * Miya * SYAHRINI
            </p>
          </div>
          <div className="content-middle">
            {/* <Web3Status setWallet={setIsShoWallet} /> */}
            <img className="middle-bg" src={bg_body} alt="" />

            <div className="text-two">
              <p>
                Michaela * Gaia * Emani * Amoura * Naomi * Rosey * Tiara * Kagura * Lamia * Luna * Fiona * Dawn * Fiora
                * Valentina *Ivy * Artemis * Athena * Skylar * Kim * Gigi * Yves * Isabella * Sophia * Lucinda * Blanc *
                Margot * Adeline * Harper * Dina * Abigail * Siren * Arya * Alaia * Cardi * Quinn * Vivianna * Wind *
                Aurora * Kana * Yazakura * Munehiko * Adaira * Smego * Squire * Sylph * Ling * Bell * Sakura * Mousse *
                Yoyo * Celia * Xayah * Lilith * Camilla * Sasha * Miya * SYAHRINI
              </p>
            </div>
            <div className="chat-icon"></div>
            <div className="content-text"></div>
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
        {/* {isShoWallet && } */}
      </div>
      {showMiddle()}
      {/* success*/}
      {/* <div className='open-site'>
            <img  className='metamask1-img' src={metamask1}/>

            <img className="opensea-img" src={opensea} alt="" />

            <img className='Sucessful-img' src={Sucessful} alt=''/>
            <img className='openaes-img' src={openaes}/>
            <img className='body_export-img' src={body_export}/>
      </div> */}
      {/* failure */}
      {/* <div className="open-site">
        <img className="opensea-img" src={etherscan} alt="" />
        <img className="metamask1-img" src={metamask1} />
        <img className="Groupimg" src={Groupimg} alt="" />
        <img className="CheckEtherscan-img" src={CheckEtherscan} />
        <img className="body_export-img1" src={body_export} />
      </div> */}
      {/* Before login */}
      {/* <div className="open-site">
        <img className="buy-img" src={buy} />
        <img className="mint-img" src={mint_img} alt="" />
        <img
          className="mastmarsk-img"
          src={mastmarsk}
          onClick={() => {
            SUPPORTED_WALLETS['METAMASK'].connector !== connector &&
              !SUPPORTED_WALLETS['METAMASK'].href &&
              tryActivation(SUPPORTED_WALLETS['METAMASK'].connector)
          }}
        />
        <img className="time-img" src={time} />
        <img className="buy-img" src={buy} />
      </div> */}
      {/* Before login two */}
      {/* <div className='open-site'>
            <img className='mint-img' src={mint_img} alt=''/>
            <img className='mastmarsk-img' src={mastmarsk}/>
            <img className='buy-img' src={buy}/>
            <img className='time-img' src={time}/> 
          <img className='taranstr-img' src={taranstr}/>
        </div> */}
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
