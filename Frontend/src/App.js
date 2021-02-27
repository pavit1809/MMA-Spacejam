import React from 'react';
import './App.css';
import Home from './components/Home';
import Register from './components/Register';
import Verify from './components/Verify';
import Login from './components/Login';
import { BrowserRouter as Router, Switch, Route, HashRouter } from 'react-router-dom';

function App() {
  return (
    <>
      <HashRouter basename='/'>
        <Switch>
         <Route path='/' exact component={Home} />
          <Route path='/register' exact component={Register} />
          <Route path='/verify' exact component={Verify} />
          <Route path='/login' exact component={Login} />
          </Switch>
      </HashRouter>
    </>
  );
}

export default App;