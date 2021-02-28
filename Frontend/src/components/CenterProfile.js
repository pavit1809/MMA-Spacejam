import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import "../App.css";
import CenterLoginNavbar from "./CenterLoginNavbar";
import CenterProfileView from "./CenterProfileView";
import Footer from "./Footer";
import * as actionTypes from './store/actions'
import {connect} from 'react-redux'
import Axios from "axios";


export class CenterProfile extends Component {
  state= {
    auth:true,
    auth1:false,
    auth2:false,
    facilitiesList:""
  };
  authenticate = (data) =>{
    this.setState({auth:false});
    const centerInfo={centerInfo:data}
    Axios.post("http://localhost:5000/helper/check1",centerInfo)      .then((res) => {
      ;
      })
      .catch((err) => {
        console.log("Invalid Route");
        this.setState({auth1:true});
      }); 
      Axios.post("http://localhost:5000/center/profile",centerInfo) .then((res) =>{
        this.setState({facilitiesList:res.data});
        this.setState({auth2:true});
      })
      .catch((err) => {
        console.log(err);
      }); 
  };
  render() {
    const{ 
      auth,
      auth1,
      auth2,
      facilitiesList
    } = this.state;
    return(
    <div>
      {auth && this.authenticate(this.props.centerInfo)}
      {auth1 && <Redirect to={{
        pathname: "/centerLogin", 
      }} />}
      {auth2 && 
        <>
      <CenterLoginNavbar
        centerInfo={this.props.centerInfo}
      />
      <CenterProfileView centerInfo={this.props.centerInfo} facilitiesList={facilitiesList}/>
      </>}
    </div>
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
export default connect(mapStateToProps,mapDispatchToProps)(CenterProfile);
