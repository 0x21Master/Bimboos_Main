/* eslint-disable prettier/prettier */
import React from 'react'
import './App.css'
import { Route, Switch } from 'react-router-dom'
import Home from './Home'
import Layout from '../components/Layout'
import { RedirectPath } from 'pages/Swap/redirects'
import Home_page from "../components/Home_page/body/Home-page"
function App() {
  return (
    <Layout>
      <Switch>
        {/* <Route exact strict path="/" component={Home} /> */}
        <Route exact strict path="/" component={Home_page} />
        <Route component={RedirectPath} />
      </Switch>
    </Layout>
  )
}

export default App
