/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react'
import './App.css'
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom'
import Home from './Home'
import NotFound from './NotFound'
import Layout from '../components/Layout'
import { isMobile } from 'react-device-detect'
// import { RedirectPath } from 'pages/Swap/redirects'
export function RedirectPath({ location }: RouteComponentProps) {
  return <Redirect to={{ ...location, pathname: '/notfound' }} />
}
function App() {
  useEffect(() => {
    console.log(isMobile)
    if (isMobile) {
      //  @ts-ignore
      console.log((window.location.href = 'https://dreamcard.io/mobile'))

      //   window.history.go('https://www.baidu.com')
    }
  }, [])
  return (
    <Layout>
      <Switch>
        <Route exact strict path="/" component={Home} />
        <Route exact strict path="/notfound" component={NotFound} />
        <Route exact strict path="#wrap-content" component={Home} />

        <Route component={RedirectPath} />
      </Switch>
    </Layout>
  )
}

export default App
