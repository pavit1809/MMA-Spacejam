import React from 'react';
import './App.css';
import Home from './components/Home';
import Register from './components/Register';
import Verify from './components/Verify';
import Login from './components/Login';
import LoginHome from './components/LoginHome';
import selectionPage1 from './components/selectionPage1';
import selectionPage2 from './components/selectionPage2';
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
          <Route path='/loginHome' exact component={LoginHome} />
          <Route path='/selectionPage1' exact component={selectionPage1} />
          <Route path='/selectionPage2' exact component={selectionPage2} /></Switch>
      </HashRouter>
    </>
  );
}

export default App;