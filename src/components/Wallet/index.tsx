import { Button, Grid } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import styled from 'styled-components/macro'

import MetaMaskIcon from '../../assets/images/home/metamask.png'
import walletIcon from '../../assets/images/home/wallet_account.png'
import WalletConnectIcon from '../../assets/images/home/walletconnect.png'
import { injected } from '../../connectors'
import { SUPPORTED_WALLETS } from '../../constants/wallet'
import { useUpdateWallet, useWalletState } from '../../state/wallet/hook'
import { shortenAddress } from '../../utils'

const ButtonStyles = styled(Button)`
  background-color: #2b878c;
  color: #fff;
  width: 100%;
  margin-left: 10px;
  &:hover {
    background-color: #2b878c;
  }
`
const ValueBox = styled.div`
  width: 807px;
  height: 237px;
  box-sizing: border-box;
  background-color: #f6f7f9;
  border-radius: 10px;
  padding: 8px;
`
const ContentValueBox = styled.div`
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  box-sizing: border-box;
  padding: 10px;
  border-radius: 10px;
`
const BalanceBox = styled.div`
  width: 100%;
  padding-bottom: 10px;
  border-bottom: 1px dashed #cccccc;
`
const BalanceTitle = styled.p`
  font-size: 14px;
  line-height: 14px;
  color: #999999;
  font-weight: 500;
  margin: 0;
  margin-bottom: 10px;
`
const BalanceMain = styled.p`
  font-size: 30px;
  line-height: 30px;
  color: #121212;
  margin: 0;
  font-weight: 600;
`
const BtnBox = styled.div`
  padding: 20px 0;
`
const WalletBtn = styled.div`
  padding: 13px;
  background-color: #2b878c;
  font-size: 14px;
  line-height: 14px;
  color: #ffffff;
  display: inline-block;
  cursor: pointer;
  border-radius: 8px;
  font-weight: 600;
  margin-right: 20px;
`
export default function Wallet() {
  const { deactivate, active } = useWeb3React()

  const { account } = useWeb3React()
  const { onUpdateChooseWallet, onUpdateShowInfo } = useUpdateWallet()
  const unlockWallet = () => {
    onUpdateChooseWallet(true)
  }
  const closeWallet = () => {
    onUpdateShowInfo(true)
    deactivate()
  }
  // const
  return (
    <>
      {!account ? (
        <ButtonStyles onClick={unlockWallet}>UNLOCK</ButtonStyles>
      ) : (
        <>
          <ButtonStyles onClick={closeWallet}>{shortenAddress(account)}</ButtonStyles>
        </>
      )}
    </>
  )
}
export function WalletShow() {
  const showDialog = useWalletState().showWalletInfo

  const { deactivate } = useWeb3React()
  const { onUpdateShowInfo, onUpdateChooseWallet } = useUpdateWallet()
  const closeDialog = () => {
    onUpdateShowInfo(false)
  }
  const outLogin = () => {
    deactivate()
    onUpdateShowInfo(false)
  }
  const unlockWallet = () => {
    onUpdateChooseWallet(true)
    onUpdateShowInfo(false)
  }
  return (
    <>
      {showDialog ? (
        <>
          <Mask onClick={closeDialog} />
          <DialogBox>
            <DialogContent>
              <DialogCloseIcon onClick={closeDialog} />
              <Grid container direction="row" justifyContent="space-between" alignItems="flex-start">
                <WalletHead item xs={12} md={3}>
                  <img src={walletIcon} alt="" />
                  <p className="title">main</p>
                </WalletHead>
                <ValueBox>
                  <ContentValueBox>
                    <BalanceBox>
                      <BalanceTitle>wallet</BalanceTitle>
                    </BalanceBox>
                    <BtnBox>
                      <WalletBtn onClick={unlockWallet}>change wallet</WalletBtn>
                      <WalletBtn onClick={outLogin}>Logout</WalletBtn>
                    </BtnBox>
                  </ContentValueBox>
                </ValueBox>
              </Grid>
            </DialogContent>
          </DialogBox>
        </>
      ) : null}
    </>
  )
}
const Mask = styled.div`
  width: 100%;
  position: fixed;
  left: 0;
  height: 100%;
  background-color: #fff;
  opacity: 0.9;
  top: 0;
  z-index: 998;
`
const DialogBox = styled.div`
  height: 524px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 100px 20px 0;
  background: #fff;
  box-shadow: 12px 0 12px 12px rgb(183 186 186 / 16%);
  bottom: 0;
  z-index: 999;
  width: 100%;
  position: fixed;
  left: 0;
  @media screen and (max-width: 1140px) {
    padding: 30px 20px 30px;
    height: 344px;
  }
`
const DialogContent = styled.div`
  position: relative;
  width: 1140px;
  margin: 0 auto;
  @media screen and (max-width: 1140px) {
    width: 100%;
  }
`
const DialogCloseIcon = styled(CloseIcon)`
  width: 30px;
  height: 30px;
  position: absolute;
  right: 0;
  top: -40px;
  cursor: pointer;
  color: #d3d3d3;
  @media screen and (max-width: 1140px) {
    top: 0;
  }
`
const WalletHead = styled(Grid)`
  width: 100%;
  img {
    width: 50px;
    height: 50px;
    margin-bottom: 12px;
  }
  .title {
    font-size: 30px;
    line-height: 30px;
    color: #121212;
    font-weight: 600;
    margin-bottom: 6px;
    margin-top: 0;
  }
  .subtitle {
    font-size: 14px;
    line-height: 14px;
    color: #222;
    font-weight: 600;
    margin-top: 0;
  }
  @media screen and (max-width: 1140px) {
    img {
      width: 40px;
      height: 40px;
      margin-bottom: 6px;
    }
    .title {
      font-size: 20px;
      line-height: 20px;
    }
  }
`
export function WalletDialog() {
  const showDialog = useWalletState().showWalletChoose
  const { onUpdateChooseWallet } = useUpdateWallet()
  const closeDialog = () => {
    onUpdateChooseWallet(false)
  }
  return (
    <>
      {showDialog ? (
        <>
          <Mask onClick={closeDialog} />
          <DialogBox>
            <DialogContent>
              <DialogCloseIcon onClick={closeDialog} />
              <Grid container direction="row" justifyContent="space-between" alignItems="flex-start">
                <WalletHead item xs={12} md={6}>
                  <img src={walletIcon} alt="" />
                  <p className="title">change wallet</p>
                  <p className="subtitle">connect</p>
                </WalletHead>
                <Grid item xs={12} md={6}>
                  {Object.keys(SUPPORTED_WALLETS).map((key) => {
                    return <WalletItem walletKey={key} key={key} />
                  })}
                </Grid>
              </Grid>
            </DialogContent>
          </DialogBox>
        </>
      ) : null}
    </>
  )
}
const Item = styled.div`
  width: 420px;
  height: 152px;
  box-sizing: border-box;
  padding: 16px;
  background-color: #f6f7f9;
  border-radius: 20px;
  cursor: pointer;
  float: right;
  &:first-child {
    margin-bottom: 20px;
  }
  @media screen and (max-width: 1140px) {
    width: 100%;
    height: 82px;
    padding: 10px;
    border-radius: 10px;
  }
`
const ItemContent = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
  background-color: #fff;
  border-radius: 20px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  justify-content: space-between;
  img {
    width: 80px;
    height: 80px;
    padding: 0;
  }
  .text {
    flex: 1;
    padding: 15px 20px;
    .title {
      font-size: 30px;
      line-height: 30px;
      font-weight: 600;
      color: #121212;
      margin: 0 0 6px;
    }
    .desc {
      margin: 0;
      font-size: 14px;
      line-height: 14px;
      color: #121212;
      font-weight: 400;
    }
  }
  @media screen and (max-width: 1140px) {
    padding: 10px;
    border-radius: 10px;
    img {
      width: 40px;
      height: 40px;
    }
    .text {
      padding: 0 14px;
      .title {
        font-size: 18px;
        line-height: 18px;
      }
      .desc {
        font-size: 12px;
        line-height: 12px;
      }
    }
  }
`
function WalletItem({ walletKey }: { walletKey: string }) {
  const { activate } = useWeb3React()
  const { onUpdateChooseWallet } = useUpdateWallet()
  const option = SUPPORTED_WALLETS[walletKey]

  const isMetamask = window.ethereum && window.ethereum.isMetaMask

  const tryActivation = async (connector: AbstractConnector | undefined) => {
    let name = ''
    Object.keys(SUPPORTED_WALLETS).map((key) => {
      if (connector === SUPPORTED_WALLETS[key].connector) {
        return (name = SUPPORTED_WALLETS[key].name)
      }
      return true
    })
    setTimeout(() => {
      onUpdateChooseWallet(false)
    }, 500)

    // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
    if (connector instanceof WalletConnectConnector && connector.walletConnectProvider?.wc?.uri) {
      connector.walletConnectProvider = undefined
    }

    connector &&
      activate(connector, undefined, true).catch((error) => {
        if (error instanceof UnsupportedChainIdError) {
          activate(connector) // a little janky...can't use setError because the connector isn't set
        } else {
          console.log(error)
        }
      })
  }
  if (option.connector === injected) {
    // don't show injected if there's no injected provider
    if (!(window.web3 || window.ethereum)) {
      if (option.name === 'MetaMask') {
        return <p>Install Metamask</p>
      } else {
        return null //dont want to return install twice
      }
    }
    // don't return metamask if injected provider isn't metamask
    else if (option.name === 'MetaMask' && !isMetamask) {
      return null
    }
    // likewise for generic
    else if (option.name === 'Injected' && isMetamask) {
      return null
    }
  }
  return (
    <Item onClick={async () => await tryActivation(option.connector)}>
      {option.name === 'MetaMask' ? (
        <ItemContent>
          <img src={MetaMaskIcon} alt="" />
          <div className="text">
            <p className="title">{option.name}</p>
            <p className="desc">wallet</p>
          </div>
        </ItemContent>
      ) : (
        <ItemContent>
          <img src={WalletConnectIcon} alt="" />
          <div className="text">
            <p className="title">{option.name}</p>
            <p className="desc">wallet</p>
          </div>
        </ItemContent>
      )}
    </Item>
  )
}
