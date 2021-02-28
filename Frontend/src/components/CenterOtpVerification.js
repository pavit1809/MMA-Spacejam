import React, { Component } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { Link,Redirect } from 'react-router-dom';
import Axios from "axios";
import {
  TextField,
  Button,
  Container,
  LinearProgress
} from "@material-ui/core";
import "./OtpVerification.css";
import * as actionTypes from './store/actions'
import {connect} from 'react-redux'

export class CenterOtpVerification extends Component {

  state = {
    counter:30,
    otp1:0,
    otp2:0,
    complete:false,
    isLoading:false,
    isLoaded:false,
    isVerified:false,
    isOtpFaulty:false,
    indicate:false,
    x:""
  };
  handleCounter = (x) =>{
    this.setState({ ['counter']: 30 });
    this.setState({['complete']: false});
    //  this.sendOtp(x);
  };
   sendOtp = (x) =>{
    const data={centerInfo:x};
     console.log(data)
  Axios.post("http://localhost:5000/center/newotps", data)
      .then((res) => {
        ;

      })
      .catch((err) => {
        console.log("Axios", err);
        this.handleOtpFaulty();
      });
  };

  start = (x) => {
    this.setState({['counter']: 29})
    this.sendOtp(x);
    this.id = setInterval(this.initiate, 1000);
  };

  initiate = () => {
    if (this.state.counter !== 0) {
      this.setState((prevState, prevProps) => ({
        counter: prevState.counter - 1
      }));
      if (this.state.counter === 0) {
        clearInterval(this.id);
        this.setState({ complete: true });

      }
    }
  };

  handleLoad = () =>  {

    this.setState({ ['isLoading']: true });
    this.setState({ ['isOtpFaulty']: false });

  };

  handleVerification = (res) =>  {
    this.setState({ ['isVerified']: true });
    this.setState({ ['isLoading']: false });
    this.setState({ ['isLoaded']: true });
    // this.setState({ ['x']: res });
    this.props.onChangeUserInfo(res);
    // if(this.props.check==0)
    //   window.localStorage.clear();
    setTimeout(
      () => this.setState({['indicate']:true}), 3000
    );
    
  };
  

  handleFaulty = () =>  {
    this.setState({ ['isLoading']: false });
    this.setState({ ['isLoaded']: true });

  };
  handleOtpFaulty = () =>  {
    this.setState({ ['isOtpFaulty']: true });
    this.setState({ ['isLoading']: false });

  };

  handleChange = input => e => {
    this.setState({ [input]: e.target.value });

  };
  verifyOtp = (otp1,otp2,centerInfo) =>{
    const data={centerInfo,otp1,otp2}
    this.handleLoad();
    console.log(data)
    // this.handleVerification();                  
    Axios.post("http://localhost:5000/center/signup2", data)
    .then((res) => {
      console.log("Hey this is your result", res);
      res.status==200 ? this.handleVerification(res) : this.handleFaulty();

    })
    .catch((err) => {
      console.log("Axios", err);
      this.handleFaulty();
    });
  }
  

  render() {
    // const{centerInfo,check}=this.props;
     const{ 
      otp1,
      otp2,
      counter,
      complete,
      isLoading,
      isLoaded,
      isVerified,
      isFaulty,
      isOtpFaulty,
      indicate,
      x
    } = this.state;
    const data = { 
      // centerInfo,
      otp1,
      otp2
    };

    return (
       <div style={{background:" linear-gradient(315deg, #b8c6db 0%, #f5f7fa 74%) "}}>
          <br/> <br/>
          {counter==30 ? this.start(this.props.centerInfo) : null}
          <div className="err-msg">
            <h2>Check your registered email id and phone number for the One-Time Passwords. Verification is needed for accessing features of the site. You cannot log in before verifying your account. If you skip it, your saved information will be deleted, and you have to register again.</h2>
          </div>
          <br />
          <div className="txtfld1">
            <TextField
              placeholder="Enter the Email OTP"
              label="Email OTP"
              variant="outlined"
              onChange={this.handleChange('otp1')}
              type="number"
              fullWidth
            />
            <br /> <br />
          </div>
          <div className="txtfld1">
            <TextField
              placeholder="Enter the Phone Number OTP"
              label="Phone Number OTP"
              variant="outlined"
              onChange={this.handleChange('otp2')}
              type="number"
              fullWidth
            />
            <br /> <br />
            <br /> <br />
          </div>
          <div className="otp1btn">
            <Button
                  style={{border:'5px solid bisque',backgroundColor:'white',color:'black'}}
              color="primary"
              variant="contained"
              disabled={!complete}
              onClick={() => this.handleCounter()}
            >
              {parseInt(Object.values({counter}))==0 ? "Resend Otp" :"Resend Otp ( "+ parseInt(Object.values({counter})) + " sec )"}
            </Button>
          </div>
          <div className="otp2btn">
            <Button
                  style={{border:'5px solid bisque',backgroundColor:'white',color:'black'}}
              color="primary"
              variant="contained"
              disabled={!((data.otp1.length>=5 ) && (data.otp2.length>=5 ))}
              onClick={() => this.verifyOtp(otp1,otp2,this.props.centerInfo)}
            >
              Verify
            </Button>
          </div>
          <br /> <br />
          <br /> <br />
          {isOtpFaulty && <div>
            <br />
            <br />
            <br />
            <br />
            <div className="err-msg">
            <div style={{color:"red",fontSize:'20px',marginTop:"-1vh",marginLeft:'10vw',marginRight:'10vw',textAlign:"center"}}>*There is an error in sending the OTP to the desired email or phone number.You must have reloaed the page ,please login to verify your account.</div>
            </div>
            <br />
            </div>
          }
          <br/>
          <div className="no-chng">
            {isLoading && <LinearProgress />}                
          {isVerified && isLoaded && <div style={{color:"#605047",fontSize:'20px',marginTop:"20px",marginLeft:'35vw'}}>You are verified</div>}
          {!isVerified && isLoaded && <div style={{color:"red",fontSize:'20px',marginTop:"20px",marginLeft:'35vw'}}>* The information provided is invalid. Please try again.</div>}
          <br />
            <div>
            {isVerified && isLoaded && 
              <div className="btn2">
                <Link 
                  to={{
                      pathname: "/centerLogin"
                     }}
                 style={{textDecoration:'none'}}
                >
                  <Button
                  style={{border:'5px solid bisque',backgroundColor:'white',color:'black'}}
                    color="primary"
                    variant="contained"
                  >
                    Proceed to Login
                  </Button>
                </Link>
              </div>
            }
            </div>
          </div>
          <br />
          <br />
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

export default connect(mapStateToProps,mapDispatchToProps)(CenterOtpVerification);