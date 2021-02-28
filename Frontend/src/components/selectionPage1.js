import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import '../App.css';
import LoginNavbar from "./LoginNavbar";
import Footer from './Footer';
import CentreCards from './CentreCards';
import * as actionTypes from './store/actions'
import {connect} from 'react-redux'
import Axios from "axios";

export class selectionPage1 extends Component {
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
  return (
    <>
      {auth && this.authenticate(this.props.userInfo)}
      {auth1 && <Redirect to={{
        pathname: "/login", 
      }} />}
      {auth2 && 
        <>
      <LoginNavbar            
      userInfo={this.props.userInfo}                  /* tochange */
      />
      <CentreCards 
      userInfo={this.props.userInfo}                  /* tochange */
      centreList={this.props.centreList}              /* tochange */
      />  
      <Footer />
      </>}
    </>
  );
}
}
const mapStateToProps = state => {
  return{
    userInfo:state.userInfo,
    centreList:state.centreList
  };
};

const mapDispatchToProps = dispatch =>{
  return{
    onChangeUserInfo: (userInfo) => dispatch({type:actionTypes.CHANGE_STATE , userInfo:userInfo})
  };
};
export default connect(mapStateToProps,mapDispatchToProps)(selectionPage1);
