import '@reach/dialog/styles.css'
import 'inter-ui'
import 'polyfills'
import 'components/analytics'

import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import { StrictMode, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'

import Blocklist from './components/Blocklist'
import { NetworkContextName } from './constants/misc'
import { LanguageProvider } from './i18n'
import App from './pages/App'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import store from './state'
import ApplicationUpdater from './state/application/updater'
import ListsUpdater from './state/lists/updater'
import LogsUpdater from './state/logs/updater'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'
import UserUpdater from './state/user/updater'
import ThemeProvider, { ThemedGlobalStyle } from './theme'
import RadialGradientByChainUpdater from './theme/RadialGradientByChainUpdater'
import getLibrary from './utils/getLibrary'
import { StyledEngineProvider } from '@material-ui/core/styles'
import { ViewportProvider } from 'components/ViewportProvider'
import Web3ReactManager from 'components/Web3ReactManager'

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

if (!!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false
}

function Updaters() {
  return (
    <>
      <ListsUpdater />
      <UserUpdater />
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
      {/* <LogsUpdater /> */}
    </>
  )
}

ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <HashRouter>
        <LanguageProvider>
          <Web3ReactProvider getLibrary={getLibrary}>
            <ViewportProvider>
              <Web3ProviderNetwork getLibrary={getLibrary}>
                <StyledEngineProvider injectFirst>
                  <Blocklist>
                    <Updaters />
                    <ThemeProvider>
                      <ThemedGlobalStyle />
                      <Web3ReactManager>
                        <App />
                      </Web3ReactManager>
                    </ThemeProvider>
                  </Blocklist>
                </StyledEngineProvider>
              </Web3ProviderNetwork>
            </ViewportProvider>
          </Web3ReactProvider>
        </LanguageProvider>
      </HashRouter>
    </Provider>
  </StrictMode>,
  document.getElementById('root')
)

if (process.env.REACT_APP_SERVICE_WORKER !== 'false') {
  serviceWorkerRegistration.register()
}
