/* eslint-disable prettier/prettier */
import React from 'react'
import './App.css'
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom'
import Home from './Home'
import NotFound from './NotFound'
import Layout from '../components/Layout'
// import { RedirectPath } from 'pages/Swap/redirects'
export function RedirectPath({ location }: RouteComponentProps) {
  return <Redirect to={{ ...location, pathname: '/notfound' }} />
}
function App() {
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
