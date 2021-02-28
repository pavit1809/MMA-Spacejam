import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import "../App.css";
import BookAnAppointment from "./BookAnAppointment";
import VerifyWarning from "./VerifyWarning";
import LoginNavbar from "./LoginNavbar";
import Footer from "./Footer";
import * as actionTypes from './store/actions'
import {connect} from 'react-redux'
import Axios from "axios";

export class LoginHome extends Component {
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
    <div  className="form_input">
      {auth && this.authenticate(this.props.userInfo)}
      {auth1 && <Redirect to={{
        pathname: "/login" 
      }} />}
      {auth2 && 
        <>
      <LoginNavbar
        userInfo={this.props.userInfo}
      />
      {!this.props.userInfo.data.user.Status && <VerifyWarning userInfo={this.props.userInfo}/>}
      <BookAnAppointment userInfo={this.props.userInfo} />
      <Footer />
      </>}
    </div>
    );
  }
}

const mapStateToProps = state => {
  return{
    userInfo:state.userInfo
  };
};

const mapDispatchToProps = dispatch =>{
  return{
    onChangeUserInfo: (userInfo) => dispatch({type:actionTypes.CHANGE_STATE , userInfo:userInfo})
  };
};
export default connect(mapStateToProps,mapDispatchToProps)(LoginHome);
