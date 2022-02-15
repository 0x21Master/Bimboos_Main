import Header from 'components/Header'
import React from 'react'
import styled from 'styled-components/macro'

import { WalletDialog, WalletShow } from '../Wallet'
import Footer from './Footer'
interface IProps {
  children?: React.ReactNode
}
const LayoutContent = styled.div`
  width: 100%;
  margin: 0 auto;
`

export default function Layout({ children }: IProps) {
  return (
    <>
      {/* <WalletDialog />
      <WalletShow /> */}
      {/* <Header></Header> */}
      <LayoutContent>{children}</LayoutContent>
    </>
  )
}
