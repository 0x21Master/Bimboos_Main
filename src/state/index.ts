import { configureStore } from '@reduxjs/toolkit'
import { load, save } from 'redux-localstorage-simple'

import application from './application/reducer'
import list from './lists/reducer'
import logs from './logs/slice'
import multicall from './multicall/reducer'
import pools from './pools/reducer'
import positionRemind from './positionRemind/reducer'
import settings from './settings/reducer'
import strategy from './strategy/reducer'
import tokens from './tokens/reducer'
import transactions from './transactions/reducer'
import underly from './underly/reducer'
import user from './user/reducer'
import wallet from './wallet/reducer'
import burn from './burn/reducer'
import burnV3 from './burn/v3/reducer'
import { api as dataApi } from './data/slice'
import { updateVersion } from './global/actions'
import mint from './mint/reducer'
import mintV3 from './mint/v3/reducer'
import { routingApi } from './routing/slice'
import swap from './swap/reducer'

const PERSISTED_KEYS: string[] = ['user', 'tokens', 'strategy']

const store = configureStore({
  reducer: {
    user,
    transactions,
    multicall,
    list,
    logs,
    application,
    pools,
    positionRemind,
    settings,
    tokens,
    wallet,
    underly,
    strategy,
    swap,
    mint,
    mintV3,
    burn,
    burnV3,
    [dataApi.reducerPath]: dataApi.reducer,
    [routingApi.reducerPath]: routingApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: true }).concat(save({ states: PERSISTED_KEYS, debounce: 1000 })),
  preloadedState: load({ states: PERSISTED_KEYS }),
})

// store.dispatch(updateVersion())

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
