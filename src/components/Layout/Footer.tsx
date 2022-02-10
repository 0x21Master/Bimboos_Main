import { useWeb3React } from '@web3-react/core'
import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { useEffect, useState } from 'react'
import styled from 'styled-components/macro'

import DiscordIcon from '../../assets/images/home/discord.png'
import TelegramIcon from '../../assets/images/home/telegram.png'
import TwitterIcon from '../../assets/images/home/twitter.png'

const LayoutFooter = styled.footer`
  width: 1160px;
  padding: 0 20px 0 10px;
  margin: 100px auto 0;
  box-sizing: border-box;
  @media screen and (max-width: 1160px) {
    width: 100%;
    margin-top: 60px;
  }
`
const FooterContent = styled.div`
  width: 100%;
  padding: 0;
  margin: 0 auto;
  box-sizing: border-box;
`
const BlockBox = styled.div`
  width: 100%;
  display: block;
  padding-bottom: 16px;
  border-bottom: 1px dashed #dddddd;

  p{
    display: inline-block;
    padding-left: 16px;
    position: relative;
    font-size: 14px;
    font-weight: 400;
    color: #999999;
    line-height: 14px;
    margin: 0;
    margin-right: 32px;
    &:before{
      display: inline-block;
      content: '';
      position: absolute;
      width: 10px;
      height:10px;
      left: 0;
      top: 2px;
      background-color: #EB5654;
      border-radius: 50%;
    }
    &.success{
      &:before{
        background-color: #00B464;
      }
    }
`
export default function Footer() {
  const windowOpen = (url: string) => {
    window.open(url)
  }
  const { library } = useWeb3React()

  const [blockNumber, setBlockNumber] = useState<number | undefined>(undefined)
  const [gasPrice, setGasPrice] = useState<number | undefined>(undefined)

  // const gas =
  useEffect(() => {
    if (library) {
      library.getBlockNumber().then((bn: number | undefined) => {
        setBlockNumber(bn)
      })
      library.on('block', setBlockNumber)
      library.getGasPrice().then((price: BigNumber) => {
        setGasPrice(parseInt(formatUnits(price.toNumber(), 'gwei')))
      })
      return () => {
        library.removeListener('block', setBlockNumber)
        setBlockNumber(undefined)
      }
    }
    return () => {
      console.log('no library')
    }
  }, [library])
  return (
    <LayoutFooter>
      <FooterContent>
        <BlockBox>
          <p className={blockNumber ? 'success' : ''}>Latest Block:{blockNumber} </p>
          <p className={blockNumber ? 'success' : ''}>Gas Price: {gasPrice} GWEI</p>
        </BlockBox>
        {/* <div style={{ paddingBottom: '86px', paddingTop: '15px' }}>
          <i
            onClick={() => {
              windowOpen('https://t.me/uniocean_org')
            }}
          >
            <img style={{ height: '18px', cursor: 'pointer', marginRight: '16px' }} src={TelegramIcon} alt="" />
          </i>
          <i
            onClick={() => {
              windowOpen('https://twitter.com/uniocean_org')
            }}
          >
            <img style={{ height: '18px', cursor: 'pointer', marginRight: '16px' }} src={TwitterIcon} alt="" />
          </i>
          <i
            onClick={() => {
              windowOpen('https://discord.com/invite/KvWsHbJjQa')
            }}
          >
            <img style={{ height: '18px', cursor: 'pointer', marginRight: '16px' }} src={DiscordIcon} alt="" />
          </i>
        </div> */}
      </FooterContent>
    </LayoutFooter>
  )
}
