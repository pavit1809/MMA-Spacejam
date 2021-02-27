import { Link,Redirect } from 'react-router-dom';
import React from "react";
import Axios from "axios";
import TnCModal from "./TnCModal";
import { Button } from "react-bootstrap";
import {
  Avatar,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,

}
  from '@material-ui/core';
import './ProfileView.css'
import * as actionTypes from './store/actions'
import {connect} from 'react-redux'

export class ProfileView extends React.Component {
  state = {
    editProfile:false,
    x:true,
    ct:0,
    ct1:0,
    complete:true,
    complete1:true,
    sendEmailOtp:false,
    sendPhoneOtp:false,
    verifiedEmailOtp:true,
    verifiedPhoneOtp:true,
    IdType:"",
    IdentificationIdNumber:"",
    NearestLandmark:"",
    City:"",
    Pincode:"",
    State:"",
    Country:"",
    Email:"",
    PhoneNumber:"",
    otp1:"",
    otp2:"",
    tempEmail:"",
    tempPhoneNumber:"",
    Validitypassword:"",
    testInfo1:"",
    succeed1:false,
    Password:"",
    id:"",
    userInfoPseudo:"",
    modal:false,
    proceed:false
  };

  getInitials = (x) =>{
    let text = x.slice(0,1).toUpperCase();
    return text;
  };

  start = () => {
    this.setState({['ct']: 30});
    this.setState({['complete']: false});
    this.id = setInterval(this.initiate, 1000);
  };

  initiate = () => {
    if (this.state.ct !== 0) {
      this.setState((prevState, prevProps) => ({
        ct: prevState.ct - 1
      }));
      if (this.state.ct === 0) {
        clearInterval(this.id);
        this.setState({ complete: true });

      }
    }
  };
  start1 = () => {
    this.setState({['ct1']: 30});
    this.setState({['complete1']: false});
    this.id1 = setInterval(this.initiate1, 1000);
  };

  initiate1 = () => {
    if (this.state.ct1 !== 0) {
      this.setState((prevState, prevProps) => ({
        ct1: prevState.ct1 - 1
      }));
      if (this.state.ct1 === 0) {
        clearInterval(this.id1);
        this.setState({ complete1: true });

      }
    }
  };

   handleChange = input => e => {
    this.setState({ [input]: e.target.value });
  };

  handleEdit = input => e => {
    this.setState({ [input]: e.target.checked });
    this.setState({x:true});
  };

  copyToTemp = (data) => {
    this.setState({x:false})
    this.setState({IdType:data.IdType});
    this.setState({IdentificationIdNumber:data.IdentificationIdNumber});
    this.setState({NearestLandmark:data.NearestLandmark});
    this.setState({City:data.City});
    this.setState({Pincode:data.Pincode});
    this.setState({State:data.State});
    this.setState({Country:data.Country});
    this.setState({Email:data.Email});
    this.setState({PhoneNumber:data.PhoneNumber});
    this.setState({tempEmail:data.Email});
    this.setState({tempPhoneNumber:data.PhoneNumber});
    this.setState({Password:""});
    this.setState({id:data._id});
  };

  handleOtp = (userInfo,id,value,flag) =>{
    if(flag==0){
      
      //AXIOS
      this.start();
      const data={userInfo,id,value,flag};
      Axios.post("http://localhost:5000/user/sendotp",data)
      .then((res) => {
        this.setState({sendEmailOtp:true});
        this.setState({verifiedEmailOtp:false});
      })
      .catch((err) => {
        console.log("Axios", err);
      });
    }
    else{
     
      //AXIOS
      this.start1();
      const data={userInfo,id,value,flag};
      Axios.post("http://localhost:5000/user/sendotp",data)
      .then((res) => {
        this.setState({sendPhoneOtp:true});
        this.setState({verifiedPhoneOtp:false});
      })
      .catch((err) => {
        console.log("Axios", err);
      });
    }
    
  };
  verifyOtp = (userInfo,otp,flag,id,value) => {
    if(flag==0){
      //AXIOS
      const data={userInfo,id,otp,flag};
      Axios.post("http://localhost:5000/user/verifyotponupd",data)
      .then((res) => {
        this.setState({verifiedEmailOtp:true});
        this.setState({tempEmail:value});
        this.setState({sendEmailOtp:false});
        this.setState({otp1:""});
      })
      .catch((err) => {
        console.log("Axios", err);
      });
      
    }
    else{
      //AXIOS
      const data={userInfo,id,otp,flag};
      Axios.post("http://localhost:5000/user/verifyotponupd",data)
      .then((res) => {
        this.setState({verifiedPhoneOtp:true})
        this.setState({tempPhoneNumber:value})
        this.setState({sendPhoneOtp:false});
        this.setState({otp2:""});
      })
      .catch((err) => {
        console.log("Axios", err);
      });
    }
  };
  EditDetails = (userInfo,data) =>{
    //AXIOS
    const ret={userInfo,data}
    Axios.post("http://localhost:5000/user/update",ret)
      .then((res) => {
        this.setState({editProfile:false});
        // this.setState({userInfoPseudo:res});
        this.props.onChangeUserInfo(res);
        this.setState({modal:true});
      })
      .catch((err) => {
        console.log("Axios", err);
      });
  };
  getTests = (data) =>{
    const userInfo = {userInfo:data}
      Axios.post("http://localhost:5000/user/allappointments",userInfo)
      .then((res) => {
          this.setState({testInfo:res.data});   
          this.setState({['succeed1']:true});

      })
      .catch((err) => {
        console.log("Axios", err);
      });

  };
  handlemodal = (x) => {
    this.setState({modal:x})
  };
  handleproceed = () => {
      window.location.reload();
  }
  render() {
    const { 
      editProfile,
      IdType,
      IdentificationIdNumber,
      NearestLandmark,
      City,
      Pincode,
      State,
      Country,
      Email,
      PhoneNumber,
      x,
      sendPhoneOtp,
      sendEmailOtp,
      otp1,
      otp2,
      verifiedPhoneOtp,
      verifiedEmailOtp,
      tempEmail,
      tempPhoneNumber,
      Validitypassword,
      testInfo,
      succeed1,
      Password,
      id,
      userInfoPseudo,
      modal,
      proceed,
      ct,ct1,
      complete,complete1
    } = this.state;
    const { userInfo } = this.props; 
    const tempValues={
      IdType,
      IdentificationIdNumber,
      NearestLandmark,
      City,
      Pincode,
      State,
      Country,
      Email,
      PhoneNumber,
      Password,
      Validitypassword,
      id
    }
    const values ={
      userInfo,
      testInfo
    }
    return (
      <div className="pvbody">
      {x && this.copyToTemp(userInfo.data.user)}
      <TnCModal
        size="lg"
        name="Success"
        head="The details have been updated"
        text="Click Ok to refresh the details"
        show={modal}
        btntext={true}
        btnshow={true}
        onHide={() => this.handlemodal(false)}
        onAgree={() => this.handleproceed()}
      />
      <div style={{marginLeft:"5vw"}} className="row">
        <Avatar style={{width:'80px',height:'80px',backgroundColor:'#a5a89f' , marginLeft:'40px', marginTop:'20px'}}><h1>{this.getInitials(userInfo.data.user.UserName)}</h1></Avatar>
        <div  className="col" >
            <Typography style={{width:'80px',height:'80px', marginLeft:'25px', marginTop:'20px',whiteSpace:'nowrap',fontSize:'40px'}}>Anuraj Agarwal{/*userInfo.data.user.UserName*/}</Typography>
          <div className="row">
              <Typography style={{marginTop:'-30px',marginLeft:'40px',fontSize:'25px'}}>Age: {userInfo.data.user.Age}</Typography>
              <Typography style={{marginTop:'-30px',marginLeft:'40px',fontSize:'25px'}}>Gender: {userInfo.data.user.Gender}</Typography>
          </div>
        </div> 
      </div>
        <FormControlLabel
          style={{

            position: 'absolute',
            right: '20px',
            top: '70px',
          }}
          control={
            <Switch
              checked={editProfile}
              onChange={this.handleEdit('editProfile')}
              style={{color:"#a5a89f"}}
              color="primary"
            />
          }
          label="Edit Profile"
        />
        <div  className="row">
          
          <div className="profile-details"> 
                
                <div className="txtfld2">
                <FormControl component="fieldset">
                  <FormLabel component="legend">Id Type</FormLabel>
                  <RadioGroup row value={IdType} onChange={this.handleChange('IdType')}>
                    <FormControlLabel
                      value="Voter Id"
                      control={<Radio style={{color:"#a5a89f"}} />}
                      label="Voter Id"
                      labelPlacement="end"
                      disabled={!editProfile}
                    />
                    <FormControlLabel
                      value="Aadhaar Number"
                      control={<Radio style={{color:"#a5a89f"}} />}
                      label="Aadhaar Number"
                      labelPlacement="end"
                      disabled={!editProfile}
                    />
                    <FormControlLabel
                      value="Passport"
                      control={<Radio style={{color:"#a5a89f"}} />}
                      label="Passport"
                      labelPlacement="end"
                      disabled={!editProfile}
                    />
                  </RadioGroup>
                </FormControl>
                <br />
                </div>
                <div className="txtfld2">
                <TextField
                  disabled={!editProfile}
                  value={IdentificationIdNumber}
                  placeholder="Enter your Identification Id Number"
                  label="Identification Id Number"
                  variant="outlined"
                  onChange={this.handleChange('IdentificationIdNumber')}
                  type="text"
                  margin="normal"
                  size="small"
                  fullWidth
                />
                <br />
                </div>

                  <div className="txtfld1">
                  <TextField
                    disabled={!editProfile}
                    value={NearestLandmark}
                    size="small"
                    placeholder="Enter you Nearest Landmark"
                    label="Nearest Landmark"
                    variant="outlined"
                    onChange={this.handleChange('NearestLandmark')}
                    type="text"
                    margin="normal"
                    fullWidth
                  />
                  <br />
                  </div>
                  <div className="txtfld1">
                  <TextField
                    value={City}
                    disabled={!editProfile}
                    size="small"
                    placeholder="Enter you City / Area / Province"
                    label="City / Area / Province"
                    variant="outlined"
                    onChange={this.handleChange('City')}
                    type="text"
                    margin="normal"
                    fullWidth
                  />
                  <br />
                  </div>
                  <div className="txtfld1">
                  <TextField
                    value={Pincode}
                    disabled={!editProfile}
                    size="small"
                    placeholder="Enter you Pincode"
                    label="Pincode"
                    variant="outlined"
                    onChange={this.handleChange('Pincode')}
                    type="text"
                    margin="normal"
                    fullWidth
                  />
                  <br />
                  </div>
                  <div className="txtfld1">
                  <TextField
                    value={State}
                    disabled={!editProfile}
                    size="small"
                    placeholder="Enter you State / Union Territory"
                    label="State / Union Territory"
                    variant="outlined"
                    onChange={this.handleChange('State')}
                    type="text"
                    margin="normal"
                    fullWidth
                  />
                  <br />
                  </div>
                  <div className="txtfld1">
                  <TextField
                    value={Country}
                    disabled={!editProfile}
                    size="small"
                    placeholder="Enter you Country"
                    label="Country"
                    variant="outlined"
                    onChange={this.handleChange('Country')}
                    type="text"
                    margin="normal"
                    fullWidth
                  />
                  <br />
                  </div>
                <div className="row">
                  <div className="txtfld1" style={{marginLeft:"10.5vw"}}>
                  <TextField
                    value={Email}
                    disabled={!editProfile}
                    size="small"
                    placeholder="Enter you Email address"
                    label="Email address"
                    variant="outlined"
                    onChange={this.handleChange('Email')}
                    type="text"
                    margin="normal"
                    fullWidth
                  />
                  </div>
                  { !(Email==tempEmail) &&
                    <>
                    <div style={{marginLeft:'20px',marginTop:'25px'}}>
                      <Button
                       style={{
                            border: "5px solid bisque",
                            backgroundColor: "white",
                            color: "black",
                          }}
                        variant="success"
                        size="sm"
                        disabled={(!editProfile && (Email==userInfo.data.user.Email) ) || !complete}
                        onClick={() => this.handleOtp(userInfo,userInfo.data.user._id,Email,0)}
                      >
                      {parseInt(Object.values({ct}))==0 ? "Send Otp" :"Send Otp ( "+ parseInt(Object.values({ct})) + " sec )"}

                      </Button>
                    </div>
                    { sendEmailOtp && 
                      <>
                        <div style={{marginLeft:'20px',marginTop:'10px'}}>
                        <TextField
                          disabled={!editProfile}
                          size="small"
                          placeholder="Enter you Email OTP"
                          label="OTP"
                          variant="outlined"
                          onChange={this.handleChange('otp1')}
                          type="text"
                          margin="normal"
                          fullWidth
                        />
                        </div>
                        <div style={{marginLeft:'20px',marginTop:'25px'}}>
                          <Button
                           style={{
                            border: "5px solid bisque",
                            backgroundColor: "white",
                            color: "black",
                          }}
                            variant="success"
                            size="sm"
                            disabled={!editProfile || (otp1.length<=5)}
                            onClick={() => this.verifyOtp(userInfo,otp1,0,userInfo.data.user._id,Email)}
                          >
                          Verify OTP
                          </Button>
                        </div>
                      </>
                    }
                    </>
                  }
                  </div>
                <div className="row">
                  <div className="txtfld1" style={{marginLeft:"10.5vw"}}>
                  <TextField
                    value={PhoneNumber}
                    disabled={!editProfile}
                    size="small"
                    placeholder="Enter your Phone Number"
                    label="Phone Number"
                    variant="outlined"
                    onChange={this.handleChange('PhoneNumber')}
                    type="number" inputProps={{ min:1000000000, max: 9999999999, step: 1}}
                    margin="normal"
                    fullWidth
                  />
                  </div>
                  { !(PhoneNumber==tempPhoneNumber) &&
                    <>

                    <div style={{marginLeft:'20px',marginTop:'25px'}}>        
                       <Button
                        style={{
                            border: "5px solid bisque",
                            backgroundColor: "white",
                            color: "black",
                          }}
                         variant="success"
                         size="sm"
                         disabled={(!editProfile  && (PhoneNumber==userInfo.data.user.PhoneNumber) ) || !complete1}
                         onClick={() => this.handleOtp(userInfo,userInfo.data.user._id,PhoneNumber,1)}
                       >
                       {parseInt(Object.values({ct1}))==0 ? "Send Otp" :"Send Otp ( "+ parseInt(Object.values({ct1})) + " sec )"}
                       </Button>
                    </div>   
                    { sendPhoneOtp &&
                      <>
                        <div style={{marginLeft:'20px',marginTop:'10px'}}>
                          <TextField
                            disabled={!editProfile}
                            size="small"
                            placeholder="Enter you Phone OTP"
                            label="OTP"
                            variant="outlined"
                            onChange={this.handleChange('otp2')}
                            type="text"
                            margin="normal"
                            fullWidth
                          />
                        </div>
                        <div style={{marginLeft:'10px',marginTop:'25px'}}>
                          <Button
                           style={{
                            border: "5px solid bisque",
                            backgroundColor: "white",
                            color: "black",
                          }}
                            variant="success"
                            size="sm"
                            disabled={!editProfile || (otp2.length<=5)}
                            onClick={() => this.verifyOtp(userInfo,otp2,1,userInfo.data.user._id,PhoneNumber)}
                          >
                          Verify OTP
                          </Button>
                        </div>
                      </>
                    }
                    </>
                  }
                </div>
                {editProfile &&
                  <div className="txtfld1">
                    <TextField
                      disabled={!editProfile}
                      size="small"
                      placeholder="Enter your New Password"
                      label="New Password"
                      variant="outlined"
                      value={Password}
                      onChange={this.handleChange('Password')}
                      type="text" 
                      margin="normal"
                      fullWidth
                      autoComplete='off'
                    />
                  </div>
                }
          </div>

          <div>
            <div style={{marginTop:'30px',marginLeft:'-60px'}}>
              <Button
               style={{
                            border: "5px solid bisque",
                            backgroundColor: "white",
                            color: "black",
                          }}

                variant="warning"
                size="lg"
                onClick={() => this.getTests(userInfo)}
              >
                View Your Tests  
              </Button>
            </div>
            { editProfile   &&
            <>
              <div className="txtfld3">
                  <TextField
                    placeholder={Password.length>0 ? "Enter your old password" :"Enter your password"} /*change as the password changes to old or nothing*/
                    label={Password.length>0 ? "Enter your old password to edit" :"Enter your password to edit"}
                    variant="outlined"
                    onChange={this.handleChange('Validitypassword')}
                    type="password"
                    margin="normal" 
                    inputProps={{
                      type:"password",
                    autoComplete: 'new-password'
                   }}
                    disabled={!(editProfile &&
                     ((((userInfo.data.user.IdType!=IdType ||
                        userInfo.data.user.IdentificationIdNumber!=IdentificationIdNumber ||
                        userInfo.data.user.NearestLandmark!=NearestLandmark ||
                        userInfo.data.user.City!=City ||
                        userInfo.data.user.Pincode!=Pincode ||
                        userInfo.data.user.State!=State ||
                        userInfo.data.user.Country!=Country || (Password.length>=8)) && (Email==userInfo.data.user.Email ||(Email==tempEmail && tempEmail!=userInfo.data.user.Email)) && (PhoneNumber==userInfo.data.user.PhoneNumber || (PhoneNumber==tempPhoneNumber && tempPhoneNumber!=userInfo.data.user.PhoneNumber))) ||
                        (Email==userInfo.data.user.Email ||(Email==tempEmail && tempEmail!=userInfo.data.user.Email)) && (PhoneNumber==userInfo.data.user.PhoneNumber || (PhoneNumber==tempPhoneNumber && tempPhoneNumber!=userInfo.data.user.PhoneNumber))) && !(userInfo.data.user.IdType==IdType &&
                        userInfo.data.user.IdentificationIdNumber==IdentificationIdNumber &&
                        userInfo.data.user.NearestLandmark==NearestLandmark &&
                        userInfo.data.user.City==City &&
                        userInfo.data.user.Pincode==Pincode &&
                        userInfo.data.user.State==State &&
                        userInfo.data.user.Country==Country && userInfo.data.user.Email==Email && PhoneNumber==userInfo.data.user.PhoneNumber && Password.length<8)) 
                    )
                  }
                    size="small"
                    fullWidth
                  />
                  {}
                  <br />
              </div>
              <div style={{marginTop:'30px',marginLeft:'60px'}}>
                <Button
                 style={{
                            border: "5px solid bisque",
                            backgroundColor: "white",
                            color: "black",
                          }}
                  variant="info"
                  size="lg"
                  disabled={Validitypassword.length<=7 || !(editProfile &&
                    ((((userInfo.data.user.IdType!=IdType ||
                      userInfo.data.user.IdentificationIdNumber!=IdentificationIdNumber ||
                      userInfo.data.user.NearestLandmark!=NearestLandmark ||
                      userInfo.data.user.City!=City ||
                      userInfo.data.user.Pincode!=Pincode ||
                      userInfo.data.user.State!=State ||
                      userInfo.data.user.Country!=Country || (Password.length>=8)) && (Email==userInfo.data.user.Email ||(Email==tempEmail && tempEmail!=userInfo.data.user.Email)) && (PhoneNumber==userInfo.data.user.PhoneNumber || (PhoneNumber==tempPhoneNumber && tempPhoneNumber!=userInfo.data.user.PhoneNumber))) ||
                      (Email==userInfo.data.user.Email ||(Email==tempEmail && tempEmail!=userInfo.data.user.Email)) && (PhoneNumber==userInfo.data.user.PhoneNumber || (PhoneNumber==tempPhoneNumber && tempPhoneNumber!=userInfo.data.user.PhoneNumber))) && !(userInfo.data.user.IdType==IdType &&
                       userInfo.data.user.IdentificationIdNumber==IdentificationIdNumber &&
                       userInfo.data.user.NearestLandmark==NearestLandmark &&
                       userInfo.data.user.City==City &&
                       userInfo.data.user.Pincode==Pincode &&
                       userInfo.data.user.State==State &&
                       userInfo.data.user.Country==Country && userInfo.data.user.Email==Email && PhoneNumber==userInfo.data.user.PhoneNumber && Password.length<8)) 
                   )
                 }
                  onClick={() => this.EditDetails(userInfo,tempValues)}
                >
                  Edit Details  
                </Button>
              </div>
            </>
            }
          </div>
          {succeed1 && 
            <Redirect push
              to={{
                pathname: '/test', 
                data: values
              }} 
            />
          }
          
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return{
    userInfo:state.userInfo,
  };
};

const mapDispatchToProps = dispatch =>{
  return{
    onChangeUserInfo: (userInfo) => dispatch({type:actionTypes.CHANGE_STATE , userInfo:userInfo}),
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(ProfileView);
