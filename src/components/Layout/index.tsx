import Header from 'components/Header'
import React from 'react'
import styled from 'styled-components/macro'

import { WalletDialog, WalletShow } from '../Wallet'
import Footer from './Footer'
interface IProps {
  children?: React.ReactNode
}
const LayoutContent = styled.div`
  padding-top: 75px;
  width: 100%;
  max-width: 1160px;
  margin: 0 auto;
`

export default function Layout({ children }: IProps) {
  return (
    <>
      {/* <WalletDialog />
      <WalletShow /> */}
      <Header></Header>
      <LayoutContent>{children}</LayoutContent>
    </>
  )
}
