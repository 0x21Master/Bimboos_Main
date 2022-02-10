import React from 'react'
import './App.css'
import { Route, Switch } from 'react-router-dom'
import Home from './Home'
import Layout from '../components/Layout'
import { RedirectPath } from 'pages/Swap/redirects'

function App() {
  return (
    <Layout>
      <Switch>
        <Route exact strict path="/" component={Home} />
        <Route component={RedirectPath} />
      </Switch>
    </Layout>
  )
}

export default App
