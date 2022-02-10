// import { Alert } from '@material-ui/core'
import DehazeIcon from '@material-ui/icons/Dehaze'
import { Alert } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { useEffect, useState } from 'react'
import styled from 'styled-components/macro'
import { CHAIN_INFO, SupportedChainId } from 'constants/chains'

import Logo from '../../assets/images/logo.png'
import { useViewport } from '../../components/ViewportProvider'
import Wallet from '../../components/Wallet'
import { network } from '../../connectors'
import Web3Status from '../Web3Status'

const Content = styled.div`
  width: 1160px;
  padding: 0 10px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  @media screen and (max-width: 1160px) {
    width: 100%;
    padding: 0 10px;
    margin: 0 auto;
    height: 100%;
    display: inline-block;
  }
`
const Menus = styled.nav`
  height: 100%;
  display: flex;
  align-items: center;
  @media screen and (max-width: 1160px) {
    height: auto;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
    background-color: #ffffff;
    box-shadow: 0px 12px 12px -8px rgba(183, 186, 186, 0.16);
    position: relative;
    z-index: 99;
  }
`
const AddressLink = styled.a`
  margin: 0 15px;
  color: #666666;
  font-size: 16px;
  line-height: 69px;
  font-weight: 600;
  text-decoration: none;
  position: relative;
  white-space: nowrap;
  &:hover {
    color: #222222;
  }

  &.active {
    color: #222222;
  }
  @media screen and (max-width: 1160px) {
    margin: 0 15px;
    color: #666666;
    font-size: 16px;
    line-height: 42px;
    font-weight: 600;
    text-decoration: none;
    position: relative;
    width: 100%;

    &:hover {
      color: #222222;
    }

    &.active {
      color: #222222;
    }
  }
`

const NetworkLabel = styled.div`
  margin-right: 8px;
  color: rgb(0, 0, 0);
  cursor: pointer;
`
const NetworkLogo = styled.img`
  height: 20px;
  width: 20px;
`
const NetworkBox = styled.div`
  -webkit-box-align: center;
  align-items: center;
  background-color: rgb(247, 248, 250);
  border: 2 px solid rgb(247, 248, 250);
  border-radius: 12 px;
  color: rgb(0, 0, 0);
  cursor: pointer;
  display: flex;
  font-weight: 500;
  -webkit-box-pack: justify;
  justify-content: space-between;
  padding: 6 px 8 px;
`

const LogoImg = styled.img`
  height: 24px;
  margin-top: 24px;
`

export default function Header() {
  const { chainId, library, activate } = useWeb3React()
  const [contentIsShow, setContentIsShow] = useState<boolean>(true)
  const [menuBtnIsShow, setMenuBtnIsShow] = useState<boolean>(true)
  const [isShowTips, setIsShowTips] = useState<boolean>(false)
  const { width } = useViewport()
  const breakpoint = 1160
  useEffect(() => {
    if (!library) {
      activate(network)
    }
  }, [chainId])

  useEffect(() => {
    const userAgent = navigator.userAgent
    if (userAgent.indexOf('imToken') != -1) {
      setIsShowTips(true)
    }
  }, [])

  useEffect(() => {
    if (width > breakpoint) {
      setMenuBtnIsShow(false)
      setContentIsShow(true)
    } else {
      setMenuBtnIsShow(true)
      setContentIsShow(false)
    }
  }, [width])
  const closeAlert = () => {
    setIsShowTips(false)
  }
  return (
    <header
      style={
        width > breakpoint
          ? {
              height: '68px',
              width: '100%',
              backgroundColor: '#ffffff',
              position: 'fixed',
              top: 0,
              zIndex: 1,
            }
          : { height: '52px', zIndex: 1, boxShadow: ' 0px 12px 12px -8px rgba(183, 186, 186, 0.16)' }
      }
    >
      <Content>
        <div>
          <AddressLink href="#/">
            <LogoImg src={Logo} alt="logo" />
          </AddressLink>
        </div>

        {menuBtnIsShow ? (
          <DehazeIcon
            style={{
              float: 'right',
              display: 'inline-block',
              marginTop: '10px',
              cursor: 'pointer',
            }}
            onClick={() => {
              setMenuBtnIsShow(true)
              setContentIsShow(!contentIsShow)
            }}
          ></DehazeIcon>
        ) : (
          <></>
        )}
        {contentIsShow ? (
          <Menus>
            <AddressLink href="#/">HOME</AddressLink>
            {/*<AddressLink href="#/fund">fund</AddressLink>*/}
            {/* <ChangeLanguage /> */}
            {/* <Wallet /> */}
            {chainId && (
              <NetworkBox>
                {/* <NetworkLogo src={CHAIN_INFO[chainId].logoUrl ? CHAIN_INFO[chainId]?.logoUrl : '网络错误'} /> */}
                {/* <NetworkLabel>{CHAIN_INFO[chainId]?.label ? CHAIN_INFO[chainId]?.label : 'NETWORK ERR'}</NetworkLabel> */}
              </NetworkBox>
            )}

            {/* {chainId && <NetWork>{CHAIN_INFO[chainId]?.label ? CHAIN_INFO[chainId]?.label : '网络错误'}</NetWork>} */}

            {/* <Web3Status /> */}
          </Menus>
        ) : (
          <></>
        )}
      </Content>
    </header>
  )
}
