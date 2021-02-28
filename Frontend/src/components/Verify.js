import React, { Component } from 'react';
import './RegisterForm.css';
import Navbar from './navbar';
import LoginNavbar from "./LoginNavbar";
import Footer from './Footer';
import OtpVerifyOrSkip from './OtpVerification';
import Axios from "axios";
import { Link,Redirect } from 'react-router-dom';
import * as actionTypes from './store/actions'
import {connect} from 'react-redux'

export class Verify extends Component {
  state= {
    auth:true,
    auth1:false,
    auth2:false,
  };
  authenticate = (data) =>{
    this.setState({auth:false});
    const userInfo={userInfo:data}
    Axios.post("http://localhost:5000/helper/check",userInfo)
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
      {auth && this.authenticate(this.props.userInfo)}
      {auth1 && <Redirect to={{
        pathname: "/login", 
      }} />}
      {auth2 && 
        <>
        {this.props.check==0 ? <Navbar /> : <LoginNavbar userInfo={this.props.userInfo} />}
        {this.props.check==0 
          ? <OtpVerifyOrSkip userInfo={this.props.userInfo} check={this.props.check}/>
          : <OtpVerifyOrSkip userInfo={this.props.userInfo} check={this.props.check}/>
        }
        <Footer />
        </>}
    </>
  );
}
}
const mapStateToProps = state => {
  return{
    userInfo:state.userInfo,
    check:state.check
  };
};

const mapDispatchToProps = dispatch =>{
  return{
    onChangeUserInfo: (userInfo) => dispatch({type:actionTypes.CHANGE_STATE , userInfo:userInfo}),
    onChangeCheck: (check) => dispatch({type:actionTypes.CHANGE_CHECK , check:check})
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(Verify);
