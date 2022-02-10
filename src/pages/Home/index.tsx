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
import axios from "axios"
// import BigNumber from 'bignumber.js'
// import {useBlindBoxAbi}
import Header from 'components/Header'
import { utils } from 'ethers/lib/ethers'
import { ChangeEvent, useState,useEffect } from 'react'
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
  const [defaultAccount, setDefaultAccount] = useState<string>("");
  const [jurisdicition,setjurisdicition] = useState<any>(false);
  const [arrs,setarrs] =useState<string>("");
  const [show, setShow] = useState<string>("none")
  const contract = useBlindBoxAbi()
  const { account, chainId, library } = useActiveWeb3React()
  
  const mint = async () => {
    // console.log(account)
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

    if(jurisdicition.status == false ){
      setarrs("sorry")
      alert(arrs)
      setShow("block")
    }else{
      setarrs("yes")
    }
  }
  const changeMintNum = (e: ChangeEvent<HTMLInputElement>) => {
    setMintNum(Number(e.target.value))

  }
  useEffect(()=>{
		// axios.post("http://192.168.1.9:7001/get-wallet-address",{
		// 	address :"0x4f0F2a33cE0238b1bb382eA6751D678CF7e72c67"
		// })
		if(defaultAccount== null){
	      axios.post("http://192.168.31.215:7001/get-wallet-address",{
	       	address :""
		})
		}else{
			axios.post("http://192.168.31.215:7001/get-wallet-address",{
			address :account
		}).then(res=>{
			// console.log(res.data)
			setjurisdicition(res.data)
		})
		}
	  },[mintNum])

    useEffect(()=>{
      setTimeout(() => {
        console.log("open");
      }, 1000000);
   },[])
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const myshow=()=>{
      setShow("none")
    }

  return (
    <>
       <div className='box'style={{display:show}}>
         <p>{arrs}</p>
         <button onClick={myshow}>off</button>
       </div>
      <div className="wrap">
        <Header></Header>
        <input type="number" onChange={changeMintNum} value={mintNum} />
        <button onClick={mint}>mint</button>
       
      </div>
      
    </>
  )
}
