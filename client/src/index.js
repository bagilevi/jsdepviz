import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router'
import App from './App'

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/repos/:user/:repo" component={App}/>
  </Router>
), document.getElementById('root'))
