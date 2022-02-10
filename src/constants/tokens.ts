import { Ether, Token, WETH9 } from '@uniswap/sdk-core'
import { formatTokens } from 'utils/tokens'

import { UNI_ADDRESS } from './addresses'
import { SupportedChainId } from './chains'

export interface IToken {
  [k: string]: ITokenItem
}
export interface ITokenItem {
  address?: string
  name: string
  symbol?: string
  id: string
  decimals: number
  icon: string
  trend: string
  priceUsd?: string
  change24h?: string
}

// export interface ITokenDetail extends ITokenItem {
//   priceUsd?: string
//   change24h?: string
// }

export const AMPL = new Token(
  SupportedChainId.MAINNET,
  '0xD46bA6D942050d489DBd938a2C909A5d5039A161',
  9,
  'AMPL',
  'Ampleforth'
)
export const DAI = new Token(
  SupportedChainId.MAINNET,
  '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  18,
  'DAI',
  'Dai Stablecoin'
)
export const USDC = new Token(
  SupportedChainId.MAINNET,
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  6,
  'USDC',
  'USD//C'
)
export const USDC_ARBITRUM = new Token(
  SupportedChainId.ARBITRUM_ONE,
  '0xe865dF68133fcEd7c2285ff3896B406CAfAa2dB8',
  6,
  'USDC',
  'USD//C'
)
export const DAI_OPTIMISM = new Token(
  SupportedChainId.OPTIMISM,
  '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
  18,
  'DAI',
  'Dai stable coin'
)
export const USDT = new Token(
  SupportedChainId.MAINNET,
  '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  6,
  'USDT',
  'Tether USD'
)
export const USDT_OPTIMISM = new Token(
  SupportedChainId.OPTIMISM,
  '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
  6,
  'USDT',
  'Tether USD'
)
export const USDT_KOVAN = new Token(
  SupportedChainId.KOVAN,
  '0xe3cbc4ba237c47994fe78162ae52db8618f22e03',
  6,
  'USDT',
  'Tether USD'
)
export const useUSDT: { [chainId: number]: Token } = {
  [SupportedChainId.MAINNET]: USDT,
  [SupportedChainId.KOVAN]: USDT_KOVAN,
}
export const WBTC = new Token(
  SupportedChainId.MAINNET,
  '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  8,
  'WBTC',
  'Wrapped BTC'
)
export const WBTC_OPTIMISM = new Token(
  SupportedChainId.OPTIMISM,
  '0x68f180fcCe6836688e9084f035309E29Bf0A2095',
  8,
  'WBTC',
  'Wrapped BTC'
)
export const FEI = new Token(
  SupportedChainId.MAINNET,
  '0x956F47F50A910163D8BF957Cf5846D573E7f87CA',
  18,
  'FEI',
  'Fei USD'
)
export const TRIBE = new Token(
  SupportedChainId.MAINNET,
  '0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B',
  18,
  'TRIBE',
  'Tribe'
)
export const FRAX = new Token(
  SupportedChainId.MAINNET,
  '0x853d955aCEf822Db058eb8505911ED77F175b99e',
  18,
  'FRAX',
  'Frax'
)
export const FXS = new Token(
  SupportedChainId.MAINNET,
  '0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0',
  18,
  'FXS',
  'Frax Share'
)
export const renBTC = new Token(
  SupportedChainId.MAINNET,
  '0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D',
  8,
  'renBTC',
  'renBTC'
)
export const UMA = new Token(
  SupportedChainId.MAINNET,
  '0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828',
  18,
  'UMA',
  'UMA Voting Token v1'
)
export const ETH2X_FLI = new Token(
  SupportedChainId.MAINNET,
  '0xAa6E8127831c9DE45ae56bB1b0d4D4Da6e5665BD',
  18,
  'ETH2x-FLI',
  'ETH 2x Flexible Leverage Index'
)
// Mirror Protocol compat.
export const UST = new Token(
  SupportedChainId.MAINNET,
  '0xa47c8bf37f92abed4a126bda807a7b7498661acd',
  18,
  'UST',
  'Wrapped UST'
)
export const MIR = new Token(
  SupportedChainId.MAINNET,
  '0x09a3ecafa817268f77be1283176b946c4ff2e608',
  18,
  'MIR',
  'Wrapped MIR'
)
export const UNI: { [chainId: number]: Token } = {
  [SupportedChainId.MAINNET]: new Token(SupportedChainId.MAINNET, UNI_ADDRESS[1], 18, 'UNI', 'Uniswap'),
  [SupportedChainId.RINKEBY]: new Token(SupportedChainId.RINKEBY, UNI_ADDRESS[4], 18, 'UNI', 'Uniswap'),
  [SupportedChainId.ROPSTEN]: new Token(SupportedChainId.ROPSTEN, UNI_ADDRESS[3], 18, 'UNI', 'Uniswap'),
  [SupportedChainId.GOERLI]: new Token(SupportedChainId.GOERLI, UNI_ADDRESS[5], 18, 'UNI', 'Uniswap'),
  [SupportedChainId.KOVAN]: new Token(SupportedChainId.KOVAN, UNI_ADDRESS[42], 18, 'UNI', 'Uniswap'),
}

export const WETH9_EXTENDED: { [chainId: number]: Token } = {
  ...WETH9,
  [SupportedChainId.OPTIMISM]: new Token(
    SupportedChainId.OPTIMISM,
    '0x4200000000000000000000000000000000000006',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  [SupportedChainId.OPTIMISTIC_KOVAN]: new Token(
    SupportedChainId.OPTIMISTIC_KOVAN,
    '0x4200000000000000000000000000000000000006',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  [SupportedChainId.ARBITRUM_ONE]: new Token(
    SupportedChainId.ARBITRUM_ONE,
    '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  [SupportedChainId.ARBITRUM_RINKEBY]: new Token(
    SupportedChainId.ARBITRUM_RINKEBY,
    '0xB47e6A5f8b33b3F17603C83a0535A9dcD7E32681',
    18,
    'WETH',
    'Wrapped Ether'
  ),
}

export class ExtendedEther extends Ether {
  public get wrapped(): Token {
    if (this.chainId in WETH9_EXTENDED) return WETH9_EXTENDED[this.chainId]
    throw new Error('Unsupported chain ID')
  }

  private static _cachedEther: { [chainId: number]: ExtendedEther } = {}

  public static onChain(chainId: number): ExtendedEther {
    return this._cachedEther[chainId] ?? (this._cachedEther[chainId] = new ExtendedEther(chainId))
  }
}
const TOKENS_CONFIG: IToken = {
  ['0xd0A1E359811322d97991E03f863a0C30C2cF029C']: {
    name: 'WETH',
    id: 'weth',
    decimals: 18,
    icon: 'https://assets.coingecko.com/coins/images/2518/small/weth.png?1547036627',
    trend: 'https://www.coingecko.com/coins/279/sparkline',
  },
  ['0xe3cbc4ba237c47994fe78162ae52db8618f22e03']: {
    name: 'USDT',
    id: 'tether',
    decimals: 6,
    icon: 'https://assets.coingecko.com/coins/images/325/small/Tether-logo.png?1598003707',
    trend: 'https://www.coingecko.com/coins/325/sparkline',
  },
  ['0xa38021d5e7af13fca8f3f7af64d7cbba93e7e9e1']: {
    name: 'WETH',
    id: 'weth',
    decimals: 18,
    icon: 'https://assets.coingecko.com/coins/images/2518/small/weth.png?1547036627',
    trend: 'https://www.coingecko.com/coins/279/sparkline',
  },
  ['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2']: {
    name: 'WETH',
    id: 'weth',
    decimals: 18,
    icon: 'https://assets.coingecko.com/coins/images/2518/small/weth.png?1547036627',
    trend: 'https://www.coingecko.com/coins/279/sparkline',
  },
  ['0x2260fac5e5542a773aa44fbcfedf7c193bc2c599']: {
    name: 'wBTC',
    id: 'wrapped-bitcoin',
    decimals: 8,
    icon: 'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png?1548822744',
    trend: 'https://www.coingecko.com/coins/7598/sparkline',
  },
  ['0x514910771af9ca656af840dff83e8264ecf986ca']: {
    name: 'LINK',
    id: 'chainlink',
    decimals: 18,
    icon: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png?1547034700',
    trend: 'https://www.coingecko.com/coins/877/sparkline',
  },
  ['0x1f9840a85d5af5bf1d1762f925bdaddc4201f984']: {
    name: 'UNI',
    id: 'uniswap',
    decimals: 18,
    icon: 'https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png?1600306604',
    trend: 'https://www.coingecko.com/coins/12504/sparkline',
  },
  ['0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2']: {
    name: 'MKR',
    id: 'maker',
    decimals: 18,
    icon: 'https://assets.coingecko.com/coins/images/1364/small/Mark_Maker.png?1585191826',
    trend: 'https://www.coingecko.com/coins/1364/sparkline',
  },
  ['0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e']: {
    name: 'YFI',
    id: 'yearn-finance',
    decimals: 18,
    icon: 'https://assets.coingecko.com/coins/images/11849/small/yfi-192x192.png?1598325330',
    trend: 'https://www.coingecko.com/coins/11849/sparkline',
  },
  ['0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f']: {
    name: 'SNX',
    id: 'havven',
    decimals: 18,
    icon: 'https://assets.coingecko.com/coins/images/3406/small/SNX.png?1598631139',
    trend: 'https://www.coingecko.com/coins/3406/sparkline',
  },
  ['0x04fa0d235c4abf4bcf4787af4cf447de572ef828']: {
    name: 'UMA',
    id: 'uma',
    decimals: 18,
    icon: 'https://assets.coingecko.com/coins/images/10951/small/UMA.png?1586307916',
    trend: 'https://www.coingecko.com/coins/10951/sparkline',
  },
  ['0xeb4c2781e4eba804ce9a9803c67d0893436bb27d']: {
    name: 'renBTC',
    id: 'renbtc',
    decimals: 8,
    icon: 'https://assets.coingecko.com/coins/images/11370/small/renBTC.png?1589985711',
    trend: 'https://www.coingecko.com/coins/11370/sparkline',
  },
  ['0xdac17f958d2ee523a2206206994597c13d831ec7']: {
    name: 'USDT',
    id: 'tether',
    decimals: 6,
    icon: 'https://assets.coingecko.com/coins/images/325/small/Tether-logo.png?1598003707',
    trend: 'https://www.coingecko.com/coins/325/sparkline',
  },
  ['0x6b3595068778dd592e39a122f4f5a5cf09c90fe2']: {
    name: 'SUSHI',
    id: 'sushi',
    decimals: 18,
    icon: 'https://assets.coingecko.com/coins/images/12271/thumb/512x512_Logo_no_chop.png?1606986688',
    trend: 'https://www.coingecko.com/coins/12271/sparkline',
  },
  ['0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9']: {
    name: 'AAVE',
    id: 'aave',
    decimals: 18,
    icon: 'https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png?1601374110',
    trend: 'https://www.coingecko.com/coins/12645/sparkline',
  },
  ['0xc00e94cb662c3520282e6f5717214004a7f26888']: {
    name: 'COMP',
    id: 'compound-governance-token',
    decimals: 18,
    icon: 'https://assets.coingecko.com/coins/images/10775/thumb/COMP.png?1592625425',
    trend: 'https://www.coingecko.com/coins/10775/sparkline',
  },
  ['0xc944e90c64b2c07662a292be6244bdf05cda44a7']: {
    name: 'GRT',
    id: 'the-graph',
    decimals: 18,
    icon: 'https://assets.coingecko.com/coins/images/13397/small_2x/Graph_Token.png',
    trend: 'https://www.coingecko.com/coins/13397/sparkline',
  },
}
export const CoinGeckoUrl = 'https://api.coingecko.com/api/v3'

export const TOKENS = formatTokens(TOKENS_CONFIG)
