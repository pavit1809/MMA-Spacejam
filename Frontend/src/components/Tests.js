import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import "./Test.css";
import LoginNavbar from "./LoginNavbar";
import TestView from "./TestView";
import Footer from "./Footer";
import * as actionTypes from './store/actions'
import {connect} from 'react-redux'
import Axios from "axios";

export class Tests extends Component {
  state= {
    auth:true,
    auth1:false,
    auth2:false,
  };
  authenticate = (data) =>{
    this.setState({auth:false});
    const userInfo={userInfo:data}
    Axios.post("http://localhost:5000/helper/check",userInfo)      .then((res) => {
        this.setState({auth2:true});
      })
      .catch((err) => {
        console.log("Invalid Route");
        this.setState({auth1:true});
      }); 
  };
  render() {
    const{ 
      auth,
      auth1,
      auth2
    } = this.state;
    return(
    <div className="tbody">
      {auth && this.authenticate(this.props.userInfo)}
      {auth1 && <Redirect to={{
        pathname: "/login", 
      }} />}
      {auth2 && 
      <>
      <LoginNavbar
        userInfo={this.props.userInfo}
      />
      <TestView userInfo={this.props.userInfo} testInfo={this.props.testInfo} />
      </>}
    </div>
    );
  }
}
const mapStateToProps = state => {
  return{
    userInfo:state.userInfo,
    testInfo:state.testInfo
  };
};

const mapDispatchToProps = dispatch =>{
  return{
    onChangeUserInfo: (userInfo) => dispatch({type:actionTypes.CHANGE_STATE , userInfo:userInfo}),
    onChangeTestInfo: (testInfo) => dispatch({type:actionTypes.CHANGE_TESTINFO , testInfo:testInfo})
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(Tests);
