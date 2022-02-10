/* eslint-disable prettier/prettier */
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components/macro'
import './css/wrap.css'
import BoxLoading from '../../components/BoxLoad'
import { useFundsState } from '../../state/funds/hook'
import LeftMenu from '../../components/compent/left/index'
import Editingtwo from '../../components/compent/Editing/NTF-Trendings'
import The_calenda from '../../components/compent/Data/The_calendar'
import { getDataForNft } from 'apis/CoinGecko'
import { useBlindBoxAbi } from 'hooks/useContract'
import { BigNumber as BN } from '@ethersproject/bignumber'
import { useActiveWeb3React } from 'hooks/web3'
import Web3Status from 'components/Web3Status'
// import BigNumber from 'bignumber.js'
// import {useBlindBoxAbi}
import Header from 'components/Header'
import { utils } from 'ethers/lib/ethers'
import { ChangeEvent, useState } from 'react'
import BigNumber from 'bignumber.js'
const DashbordTitle = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 16px;
  color: #222222;
  font-weight: 500;
`
const DashbordBox = styled.div`
  display: flex;
  justify-content: start;
  flex-wrap: wrap;
`

export default function Home() {
  const [mintNum, setMintNum] = useState<number>(0)

  const contract = useBlindBoxAbi()
  const { account, chainId, library } = useActiveWeb3React()

  const mint = async () => {
    const signer = library?.getSigner()
    if (!signer || !account) {
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
  return (
    <>
      <div className="wrap">
        <Header></Header>
        <input type="number" onChange={changeMintNum} value={mintNum} />
        <button onClick={mint}>mint</button>
      </div>
    </>
  )
}
