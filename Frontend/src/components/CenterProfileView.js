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
  Select,
  MenuItem
}
  from '@material-ui/core';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import Table from 'react-bootstrap/Table'
import './CenterProfileView.css'
import * as actionTypes from './store/actions'
import {connect} from 'react-redux'

export class CenterProfileView extends React.Component {
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
    Address:"",
    LicenseNum:"",
    NearestLandmark:"",
    City:"",
    Pincode:"",
    State:"",
    Country:"",
    Email:"",
    PhoneNo:"",
    otp1:"",
    otp2:"",
    tempEmail:"",
    tempPhoneNo:"",
    Validitypassword:"",
    succeed1:false,
    Password:"",
    id:"",
    centerInfoPseudo:"",
    modal:false,
    proceed:false,
    facilities:[],
    facilityShow:"",
    FacilityName:"",
    CapacityperSlot:"",
    Price:"",
    dropdown:["Diabetes","Thyroid","Thypoid","CT Scan","MRI","Thermal Scan","COVID-19"],
    len:0
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

  copyToTemp = (data,x) => {
    this.setState({x:false})
    this.setState({Address:data.Address});
    this.setState({LicenseNum:data.LicenseNum});
    this.setState({NearestLandmark:data.NearestLandmark});
    this.setState({City:data.City});
    this.setState({Pincode:data.Pincode});
    this.setState({State:data.State});
    this.setState({Country:data.Country});
    this.setState({Email:data.Email});
    this.setState({PhoneNo:data.PhoneNo});
    this.setState({tempEmail:data.Email});
    this.setState({tempPhoneNo:data.PhoneNo});
    this.setState({Password:""});
    this.setState({id:data._id});
    this.setState({facilities:x});
    this.setState({len:x.length});
    console.log(2,x,x.length)
    this.handleShow(x,x.length);

  };

  handleOtp = (centerInfo,id,value,flag) =>{
    if(flag==0){
      
      //AXIOS
      this.start();
      const data={centerInfo,id,value,flag};
      Axios.post("http://localhost:5000/center/sendotp",data)
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
      const data={centerInfo,id,value,flag};
      Axios.post("http://localhost:5000/center/sendotp",data)
      .then((res) => {
        this.setState({sendPhoneOtp:true});
        this.setState({verifiedPhoneOtp:false});
      })
      .catch((err) => {
        console.log("Axios", err);
      });
    }
    
  };
  verifyOtp = (centerInfo,otp,flag,id,value) => {
    if(flag==0){
      //AXIOS
      const data={centerInfo,id,otp,flag};
      Axios.post("http://localhost:5000/center/verifyotponupd",data)
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
      const data={centerInfo,id,otp,flag};
      Axios.post("http://localhost:5000/center/verifyotponupd",data)
      .then((res) => {
        this.setState({verifiedPhoneOtp:true})
        this.setState({tempPhoneNo:value})
        this.setState({sendPhoneOtp:false});
        this.setState({otp2:""});
      })
      .catch((err) => {
        console.log("Axios", err);
      });
    }
  };
  EditDetails = (centerInfo,data) =>{
    //AXIOS
    const ret={centerInfo,data}
    Axios.post("http://localhost:5000/center/update",ret)
      .then((res) => {
        this.setState({editProfile:false});
        // this.setState({centerInfoPseudo:res});
        this.props.onChangecenterInfo(res);
        this.setState({modal:true});
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
  };
  handleChange1 = input => e => {
    this.setState({ [input]: e.target.value });
  };
  handleDelete = (i1,facilities,len) =>{
    const PseudoFacilities=[];
    if(facilities.length>0){
      facilities.map((value,i)=> (
        i!=i1 ? PseudoFacilities.push(value) : null
      ));
    }
    this.setState({facilities:PseudoFacilities});
    this.handleShow(PseudoFacilities,len);
  };

  handleAddAnother = (FacilityName,CapacityperSlot,Price,facilities,len) =>{
    const Facility = {FacilityName,CapacityperSlot,Price};
    const PseudoFacilities=[];
    if(facilities.length>0){
      facilities.map(value => PseudoFacilities.push(value));
    }
    if(FacilityName!=="" && CapacityperSlot!=="" && facilities!=="")
    {
      PseudoFacilities.push(Facility);
      this.setState({FacilityName:""})
      this.setState({CapacityperSlot:""})
      this.setState({Price:""})
      this.setState({facilities:PseudoFacilities})
    }
    this.handleShow(PseudoFacilities,len);
  };

  handleShow = (PseudoFacilities,len) =>{
    var code=[];
    console.log('hey');
    console.log(1,PseudoFacilities);
    if(PseudoFacilities.length>0)
    {
      code.push(<Table responsive="lg" size="sm" striped bordered hover >
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Facility</th>
                    <th>Capacity</th>
                    <th>Price</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {PseudoFacilities.map((value,i) => (
                  <tr>
                    <td>{i+1}</td>
                    <td>{value.FacilityName}</td>
                    <td>{value.CapacityperSlot}</td>
                    <td>{value.Price}</td>
                    <td>{i>=len && <DeleteOutlinedIcon onClick={()=>this.handleDelete(i,PseudoFacilities,len)}/>}</td>
                  </tr>
                  ))}
                </tbody>
              </Table>
      )
    }
        this.setState({facilityShow:code})
  };
  dropdownShow = (data,FacilityName) => {
    return(
      <>
      <Select required displayEmpty value={FacilityName} onChange={this.handleChange('FacilityName')} style={{margin:'5px',minWidth:'80px'}} variant="outlined">
        <MenuItem value="" disabled><em>None</em></MenuItem>
        {data.length>0 && data.map((value,i) => {
          return(
              <MenuItem value={value}>{value}</MenuItem >
            )
        })}
      </Select>
      </>
      )
  };
  render() {
    const { 
      editProfile,
      Address,
      LicenseNum,
      NearestLandmark,
      City,
      Pincode,
      State,
      Country,
      Email,
      PhoneNo,
      x,
      sendPhoneOtp,
      sendEmailOtp,
      otp1,
      otp2,
      verifiedPhoneOtp,
      verifiedEmailOtp,
      tempEmail,
      tempPhoneNo,
      Validitypassword,
      testInfo,
      succeed1,
      Password,
      id,
      len,
      centerInfoPseudo,
      modal,
      proceed,
      ct,ct1,
      complete,
      complete1,
      facilities,
      FacilityName,
      CapacityperSlot,
      Price,
      facilityShow,
      dropdown

    } = this.state;
    const { centerInfo,facilitiesList } = this.props; 
    const tempValues={
      Address,
      LicenseNum,
      NearestLandmark,
      City,
      Pincode,
      State,
      Country,
      Email,
      PhoneNo,
      Password,
      Validitypassword,
      facilities,
      id
    }
    const values ={
      centerInfo,
      testInfo
    }
    return (
      <div className="pvbody">
      {console.log(facilitiesList)}
      {x && this.copyToTemp(centerInfo.data.center,facilitiesList)}
      
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
        <Avatar style={{width:'80px',height:'80px',backgroundColor:'#a5a89f' , marginLeft:'40px', marginTop:'20px'}} src={centerInfo.data.center.FrontImage} />
        <div >
            <Typography style={{width:'80px',height:'80px', marginLeft:'40px', marginTop:'20px',whiteSpace:'nowrap',fontSize:'40px'}}>{centerInfo.data.center.Name}</Typography>
          <div className="row">
              <Typography style={{marginTop:'-30px',marginLeft:'50px',fontSize:'20px'}}>Opening Time: {centerInfo.data.center.OpeningTime}</Typography>
              <Typography style={{marginTop:'-30px',marginLeft:'40px',fontSize:'20px'}}>Closing Time: {centerInfo.data.center.ClosingTime}</Typography>
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
              style={{color:"#a5a89f"}}
              checked={editProfile}
              onChange={this.handleEdit('editProfile')}
              color="primary"
            />
          }
          label="Edit Profile"
        />
        <div  className="row">
          
          <div className="profile-details"> 
                
              
                <div className="txtfld1">
                <TextField
                  disabled={!editProfile}
                  value={LicenseNum}
                  placeholder="Enter your License Number"
                  label="License Number"
                  variant="outlined"
                  onChange={this.handleChange('LicenseNum')}
                  type="text"
                  margin="normal"
                  size="small"
                  fullWidth
                />
                <br />
                </div>
                <div className="txtfld1">
                  <TextField
                    value={Address}
                    disabled={!editProfile}
                    size="small"
                    placeholder="Enter you Address"
                    label="Address"
                    variant="outlined"
                    onChange={this.handleChange('Address')}
                    type="text"
                    margin="normal"
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
                  <div className="txtfld1" style={{marginLeft:"11vw"}}>
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
                    <div style={{marginLeft:'10px',marginTop:'25px'}}>
                      <Button
                        style={{
                            border: "5px solid bisque",
                            backgroundColor: "white",
                            color: "black",
                          }}
                        variant="success"
                        size="sm"
                        disabled={(!editProfile && (Email==centerInfo.data.center.Email) ) || !complete}
                        onClick={() => this.handleOtp(centerInfo,centerInfo.data.center._id,Email,0)}
                      >
                      {parseInt(Object.values({ct}))==0 ? "Send Otp" :"Send Otp ( "+ parseInt(Object.values({ct})) + " sec )"}

                      </Button>
                    </div>
                    { sendEmailOtp && 
                      <>
                        <div style={{marginLeft:'10px',marginTop:'10px'}}>
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
                        <div style={{marginLeft:'10px',marginTop:'25px'}}>
                          <Button
                            style={{
                            border: "5px solid bisque",
                            backgroundColor: "white",
                            color: "black",
                          }}
                            variant="success"
                            size="sm"
                            disabled={!editProfile || (otp1.length<=5)}
                            onClick={() => this.verifyOtp(centerInfo,otp1,0,centerInfo.data.center._id,Email)}
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
                  <div className="txtfld1" style={{marginLeft:"11vw"}}>
                  <TextField
                    value={PhoneNo}
                    disabled={!editProfile}
                    size="small"
                    placeholder="Enter your Phone Number"
                    label="Phone Number"
                    variant="outlined"
                    onChange={this.handleChange('PhoneNo')}
                    type="number" inputProps={{ min:1000000000, max: 9999999999, step: 1}}
                    margin="normal"
                    fullWidth
                  />
                  </div>
                  { !(PhoneNo==tempPhoneNo) &&
                    <>

                    <div style={{marginLeft:'10px',marginTop:'25px'}}>        
                       <Button
                       style={{
                            border: "5px solid bisque",
                            backgroundColor: "white",
                            color: "black",
                          }}
                         variant="success"
                         size="sm"
                         disabled={(!editProfile  && (PhoneNo==centerInfo.data.center.PhoneNo) ) || !complete1}
                         onClick={() => this.handleOtp(centerInfo,centerInfo.data.center._id,PhoneNo,1)}
                       >
                       {parseInt(Object.values({ct1}))==0 ? "Send Otp" :"Send Otp ( "+ parseInt(Object.values({ct1})) + " sec )"}
                       </Button>
                    </div>   
                    { sendPhoneOtp &&
                      <>
                        <div style={{marginLeft:'10px',marginTop:'10px'}}>
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
                            onClick={() => this.verifyOtp(centerInfo,otp2,1,centerInfo.data.center._id,PhoneNo)}
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
            <div style={{marginTop:'-6vh',width:'25vw',marginLeft:"-5vw",padding:'7px 20px' ,  boxShadow: '0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24)'}}>
              <h4>{!editProfile ? " Facilites" : " Edit Facilities"} </h4>
                {facilityShow}
                {editProfile &&
                  <>
                  <div className="txtfld4">
                    <label htmlFor="username">Facility Name</label>
                    {this.dropdownShow(dropdown,FacilityName)}
                  </div>
                  <div className="txtfld4">
                  <TextField
                    size="small"
                    placeholder="Enter the Capacity per Slot"
                    label="Capacity per Slot"
                    variant="outlined"
                    value={CapacityperSlot}
                    onChange={this.handleChange1('CapacityperSlot')}
                    type="number" 
                    margin="normal"
                    fullWidth
                    required
                  />
                  </div>
                  <div className="txtfld4">
                  <TextField
                    placeholder="Enter the Price"
                    size="small"
                    label="Price"
                    variant="outlined"
                    value={Price}
                    onChange={this.handleChange1('Price')}
                    type="number"
                    inputProps={{min:"0.01" ,step:"0.01"}}
                    margin="normal"
                    fullWidth
                    required
                  />
                  <br />
                  </div>
                  <div>
                  <Button
                    style={{
                            border: "5px solid bisque",
                            backgroundColor: "white",
                            color: "black",
                          }}
                        variant="success"
                        onClick={() => this.handleAddAnother(FacilityName,CapacityperSlot,Price,facilities,len)}
                      >
                        Add
                      </Button>
                  </div>
                  </>
                }
            </div>
            { editProfile   &&
            <>
              <div className="txtfld5" >
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
                     ((((centerInfo.data.center.Address!=Address ||
                        centerInfo.data.center.LicenseNum!=LicenseNum ||
                        centerInfo.data.center.NearestLandmark!=NearestLandmark ||
                        centerInfo.data.center.City!=City ||
                        centerInfo.data.center.Pincode!=Pincode ||
                        centerInfo.data.center.State!=State ||
                        centerInfo.data.center.Country!=Country || (Password.length>=8)) && (Email==centerInfo.data.center.Email ||(Email==tempEmail && tempEmail!=centerInfo.data.center.Email)) && (PhoneNo==centerInfo.data.center.PhoneNo || (PhoneNo==tempPhoneNo && tempPhoneNo!=centerInfo.data.center.PhoneNo))) ||
                        (Email==centerInfo.data.center.Email ||(Email==tempEmail && tempEmail!=centerInfo.data.center.Email)) && (PhoneNo==centerInfo.data.center.PhoneNo || (PhoneNo==tempPhoneNo && tempPhoneNo!=centerInfo.data.center.PhoneNo))) && !(centerInfo.data.center.Address==Address &&
                        centerInfo.data.center.LicenseNum==LicenseNum &&
                        centerInfo.data.center.NearestLandmark==NearestLandmark &&
                        centerInfo.data.center.City==City &&
                        centerInfo.data.center.Pincode==Pincode &&
                        centerInfo.data.center.State==State &&
                        centerInfo.data.center.Country==Country && centerInfo.data.center.Email==Email && PhoneNo==centerInfo.data.center.PhoneNo && Password.length<8)) 
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
                    ((((centerInfo.data.center.Address!=Address ||
                      centerInfo.data.center.LicenseNum!=LicenseNum ||
                      centerInfo.data.center.NearestLandmark!=NearestLandmark ||
                      centerInfo.data.center.City!=City ||
                      centerInfo.data.center.Pincode!=Pincode ||
                      centerInfo.data.center.State!=State ||
                      centerInfo.data.center.Country!=Country || (Password.length>=8)) && (Email==centerInfo.data.center.Email ||(Email==tempEmail && tempEmail!=centerInfo.data.center.Email)) && (PhoneNo==centerInfo.data.center.PhoneNo || (PhoneNo==tempPhoneNo && tempPhoneNo!=centerInfo.data.center.PhoneNo))) ||
                      (Email==centerInfo.data.center.Email ||(Email==tempEmail && tempEmail!=centerInfo.data.center.Email)) && (PhoneNo==centerInfo.data.center.PhoneNo || (PhoneNo==tempPhoneNo && tempPhoneNo!=centerInfo.data.center.PhoneNo))) && !(centerInfo.data.center.Address==Address &&
                       centerInfo.data.center.LicenseNum==LicenseNum &&
                       centerInfo.data.center.NearestLandmark==NearestLandmark &&
                       centerInfo.data.center.City==City &&
                       centerInfo.data.center.Pincode==Pincode &&
                       centerInfo.data.center.State==State &&
                       centerInfo.data.center.Country==Country && centerInfo.data.center.Email==Email && PhoneNo==centerInfo.data.center.PhoneNo && Password.length<8)) 
                   )
                 }
                  onClick={() => this.EditDetails(centerInfo,tempValues)}
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
    centerInfo:state.centerInfo
  };
};

const mapDispatchToProps = dispatch =>{
  return{
    onChangeCenterInfo: (centerInfo) => dispatch({type:actionTypes.CHANGE_CENTERINFO , centerInfo:centerInfo}),
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(CenterProfileView);
