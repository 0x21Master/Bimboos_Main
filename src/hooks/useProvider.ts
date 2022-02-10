import { Networkish } from '@ethersproject/networks'
import { BaseProvider } from '@ethersproject/providers'
import { providers } from 'ethers'

import { useSettingState } from '../state/settings/hooks'

export function useProvider(network?: Networkish): BaseProvider {
  const settings = useSettingState()
  switch (process.env.REACT_APP_PROVIDER_TYPE?.toLowerCase()) {
    case 'infura':
      return new providers.InfuraProvider(
        network,
        settings.providerKey ? settings.providerKey : process.env.REACT_APP_PROVIDER_KEY
      )
    case 'etherscan':
      return new providers.EtherscanProvider(network, process.env.REACT_APP_PROVIDER_KEY)
    default:
      return providers.getDefaultProvider(network?.toString())
  }
}
