import UO1ICON from '../assets/images/fund/fund_UO1.png'
import UO2ICON from '../assets/images/fund/fund_UO2.png'
import { SupportedChainId } from './chains'

export interface FUNDS_ITEM {
  fundAddress: string
  strategyAddress: string
  autoLiquidityAddress?: string
  decimals: number
  types: string[]
  minPurchase: number
  icon: string
  edition: string
  chainId: number
}
export interface FUNDS {
  [key: string]: FUNDS_ITEM[]
}

export const addressData = {
  [SupportedChainId.MAINNET]: [
    {
      fundAddress: '0xD05859e5A8CB0e4Ca19B62B9199b8f4216603cB9',
      strategyAddress: '0xbde22c3790ecd6bb227a9657668dbb5249609d0e',
      decimals: 6,
      types: ['LIQUIDITY', 'VAULT'],
      minPurchase: 100000,
      icon: UO1ICON,
      edition: 'v1',
      chainId: SupportedChainId.MAINNET,
    },
  ],
  [SupportedChainId.KOVAN]: [
    {
      fundAddress: '0x00510697F5188D71cc824a0D43CBC0e8d156810c',
      strategyAddress: '0xd510C8f8985cE9fd4618b7826D67EfE838e3e6E8',
      // autoLiquidityAddress: '0x2b357cd9fdE3D6297C9D986A98A6814317b6A8a0',
      decimals: 6,
      types: ['LIQUIDITY', 'VAULT'],
      minPurchase: 100,
      icon: UO1ICON,
      edition: 'v1',
      chainId: SupportedChainId.KOVAN,
    },
    {
      fundAddress: '0x44438c22681DFACE24F6F8eDf4C2c6bE75B3A7de',
      strategyAddress: '0xC72552788Ccf6168d50972924966B1344ce84876',
      autoLiquidityAddress: '0x2b357cd9fdE3D6297C9D986A98A6814317b6A8a0',
      decimals: 6,
      types: ['LIQUIDITY', 'VAULT'],
      minPurchase: 100,
      icon: UO2ICON,
      edition: 'v2',
      chainId: SupportedChainId.KOVAN,
    },
  ],
}
export enum SupportChainId {
  MAINNET = 1,
  KOVAN = 42,
}
export const FUNDS: FUNDS = addressData
