import React, { Component } from 'react'
import Login from './Login'
import { BrowserRouter as Router, NavLink, Redirect, BrowserRouter } from 'react-router-dom'
import Route from 'react-router-dom/Route'
import MyProfile from './MyProfile'
import User from './User'

class App extends Component {

  render() {

    return (
      <Router>
        <Route exact path='/' component={Login} />
        <Route exact path='/myprofile' component={MyProfile} />
        <Route exact path="/user/:username" render={({match}) => <User username={match.params.username} />} />
      </Router>
    )
  }
}

export default App
