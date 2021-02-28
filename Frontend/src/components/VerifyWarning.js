import React, { Component } from "react";
import "../App.css";
import BookAnAppointment from "./BookAnAppointment";
import LoginNavbar from "./LoginNavbar";
import { Link,Redirect } from 'react-router-dom';
import {
  Button,
} from "@material-ui/core";
import Footer from "./Footer";
import * as actionTypes from './store/actions'
import {connect} from 'react-redux'

export class VerifyWarning extends Component {
  state={
    check:true
  }
  handleCheck = () =>{
    this.setState({check:false});
  }
  render() {
    // const{userInfo}=this.props;

    const{
      check
    }=this.state;
    const data={
      // check,
    };
    return(
    <div>
    {check && this.handleCheck()}
    <div  style={{border:'5px solid bisque'}} className="verify row" >
    <h5>The account is not verified. The user will not be able to book any appointments.To verify click here.</h5>
    
                <Link 
                  onClick={()=>this.props.onChangeCheck(1)}
                  to={{
                      pathname: "/verify",
                      // data: {"check":check,"Email":userInfo.data.Email,"userInfo":userInfo}
                     }}
                 style={{textDecoration:'none' ,fontSize:'18px'}}
                >                  
                    VERIFY
                </Link>
              </div>
              <br/>
              <br/>
              <br/>
              <br/>
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
    onChangeUserInfo: (userInfo) => dispatch({type:actionTypes.CHANGE_STATE , userInfo:userInfo}),
    onChangeCheck: (check) => dispatch({type:actionTypes.CHANGE_CHECK , check:check})
  };
};
export default connect(mapStateToProps,mapDispatchToProps)(VerifyWarning);
