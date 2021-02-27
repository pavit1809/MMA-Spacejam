import React, { Component } from 'react';
import './RegisterForm.css';
import Navbar from './navbar';
import LoginNavbar from "./LoginNavbar";
import Footer from './Footer';
import CenterOtpVerifyOrSkip from './CenterOtpVerification';
import Axios from "axios";
import { Link,Redirect } from 'react-router-dom';
import * as actionTypes from './store/actions'
import {connect} from 'react-redux'

export class CenterVerify extends Component {
	state= {
    auth:true,
    auth1:false,
    auth2:false, 
  };
  authenticate = (data) =>{
    this.setState({auth:false});
    const centerInfo={centerInfo:data}
    console.log(centerInfo);
    Axios.post("http://localhost:5000/helper/check1",centerInfo)
      .then((res) => {
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
  return (
    <>
      {auth && this.authenticate(this.props.centerInfo)}
      {auth1 && <Redirect to={{
        pathname: "/centerLogin", 
      }} />}
      {auth2 && 
        <>
        <Navbar />
        <CenterOtpVerifyOrSkip centerInfo={this.props.centerInfo}/>
        <Footer />
        </>}
    </>
  );
}
}
const mapStateToProps = state => {
  return{
    centerInfo:state.centerInfo
  };
};

const mapDispatchToProps = dispatch =>{
  return{
    onChangeCenterInfo: (centerInfo) => dispatch({type:actionTypes.CHANGE_CENTERINFO , centerInfo:centerInfo}),
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(CenterVerify);
