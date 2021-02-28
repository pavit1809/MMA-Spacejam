import React from 'react';
import './App.css';
import Home from './components/Home';
import Register from './components/Register';
import CenterRegister from './components/CenterRegister';
import Verify from './components/Verify';
import CenterVerify from './components/CenterVerify';
import Login from './components/Login';
import CenterLogin from './components/CenterLogin';
import CenterProfile from './components/CenterProfile';
import LoginHome from './components/LoginHome';
import CenterLoginHome from './components/CenterLoginHome';
import CenterSendResult from './components/CenterSendResult';
import CenterAppOfDay from './components/CenterAppOfDay';
import CenterCancelApp from './components/CenterCancelApp';
import Tests from './components/Tests';
import Profile from './components/Profile';
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
          <Route path='/centerRegister' exact component={CenterRegister} />
          <Route path='/verify' exact component={Verify} />
          <Route path='/centerVerify' exact component={CenterVerify} />
          <Route path='/login' exact component={Login} />
          <Route path='/centerLogin' exact component={CenterLogin} />
          <Route path='/centerProfile' exact component={CenterProfile} />
          <Route path='/centerLoginHome' exact component={CenterLoginHome} />
          <Route path='/centerSendResult' exact component={CenterSendResult} />
          <Route path='/centerAppOfDay' exact component={CenterAppOfDay} />
          <Route path='/centerCancelApp' exact component={CenterCancelApp} />
          <Route path='/loginHome' exact component={LoginHome} />
          <Route path='/test' exact component={Tests} />
          <Route path='/profile' exact component={Profile} />
          <Route path='/selectionPage1' exact component={selectionPage1} />
          <Route path='/selectionPage2' exact component={selectionPage2} /></Switch>
      </HashRouter>
    </>
  );
}

export default App;