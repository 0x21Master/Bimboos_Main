import { BaseProvider } from '@ethersproject/providers'
import { providers } from 'ethers'

export class BlockchainProvider {
  static allProvider: Map<number, BaseProvider> = new Map([])
  static getDefaultProvider(chainId: number) {
    let provider = BlockchainProvider.allProvider.get(chainId)
    if (!provider) {
      provider = BlockchainProvider.setProvider(chainId)
    }
    return provider
  }
  static setProvider(network: number) {
    const key = process.env.REACT_APP_PROVIDER_KEY
    if (!key) return undefined
    const provider = new providers.InfuraProvider(network, process.env.REACT_APP_PROVIDER_KEY)
    if (!provider) return undefined
    BlockchainProvider.allProvider.set(network, provider)
    return provider
  }
}
