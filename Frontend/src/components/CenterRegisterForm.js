import React, { Component } from 'react';
import { ThemeProvider as MuiThemeProvider  } from '@material-ui/core/styles';
import validateInfo from './error.js';
import { Link,Redirect } from 'react-router-dom';
import Axios from "axios";
import TnCModal from "./TnCModal";
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import {
  TextField,
  Button,
  Container,
  LinearProgress,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Checkbox,
  FormGroup,
  FormHelperText,
  Select
} from "@material-ui/core";
import './RegisterForm.css'
import * as actionTypes from './store/actions'
import {connect} from 'react-redux'
import Table from 'react-bootstrap/Table'
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
} from "@material-ui/pickers";
import moment from "moment";
import { format } from "date-fns";

export class CenterRegisterForm extends Component {

  state = {
    step:0,
    Name:"",
    Address:"",
    PhoneNo:"",
    Email:"",
    Password:"",
    NearestLandmark:"",
    City:"",
    Pincode:"",
    State:"",
    Country:"",
    OpeningTime1:"0",
    ClosingTime1:"0",
    OpeningTime:"0",
    ClosingTime:"0",
    FrontImage:"",
    FrontImageType:"",
    LicenseNum:"",
    isLoading:false,
    isLoaded:false,
    isRegistered:false,
    isFaulty:false,
    indicate:false,
    radioControl:"",
    ModalShow:false,
    Monday:false,
    Tuesday:false,
    Wednesday:false,
    Thursday:false,
    Friday:false,
    Saturday:false,
    Sunday:false,
    facilities:[],
    FacilityName:"",
    CapacityperSlot:"",
    Price:"",
    facilityShow:"",
    dropdown:["Diabetes","Thyroid","Thypoid","CT Scan","MRI","Thermal Scan","COVID-19"]

  };

  handleLoad = () =>  {

    this.setState({ ['isLoading']: true });
    this.setState({ ['isFaulty']: false });

  };

  handleRegister = (data) =>  {
    this.setState({ ['isRegistered']: true });
    this.setState({ ['isLoading']: false });
    this.setState({ ['isLoaded']: true });
    // this.setState({centerInfo : data});
    this.props.onChangeCenterInfo(data);
    setTimeout(
      () => this.setState({['indicate']:true}), 3000
    );
    
  };
  
  handleModal = (x) => {
    this.setState({ModalShow:x})
  };

  handleFaulty = () =>  {
    this.setState({ ['isFaulty']: true });
    this.setState({ ['isLoading']: false });

  };
  handleTime = (x,date,x1,date1) => {
    console.log(x)
    console.log(date)
    this.setState({ [x1] : date1})
    this.setState({ [x] : date });
  };

  handleChange = input => e => {
    this.setState({ [input]: e.target.value });
  };
  handleDelete = (i1,facilities) =>{
    const PseudoFacilities=[];
    if(facilities.length>0){
      facilities.map((value,i)=> (
        i!=i1 ? PseudoFacilities.push(value) : null
      ));
    }
    this.setState({facilities:PseudoFacilities});
    this.handleShow(PseudoFacilities);
  };

  handleAddAnother = (FacilityName,CapacityperSlot,Price,facilities) =>{
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
      this.setState({facilities:PseudoFacilities});
    }
    this.handleShow(PseudoFacilities);
  };

  handleShow = (PseudoFacilities) =>{
    var code=[];
    if(PseudoFacilities.length>0)
    {
      code.push(<Table striped bordered hover >
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Facility Name</th>
                    <th>Capacity per Slot</th>
                    <th>Price</th>
                    <th>Delete Option</th>
                  </tr>
                </thead>
                <tbody>
                  {PseudoFacilities.map((value,i) => (
                  <tr>
                    <td>{i+1}</td>
                    <td>{value.FacilityName}</td>
                    <td>{value.CapacityperSlot}</td>
                    <td>{value.Price}</td>
                    <td><DeleteOutlinedIcon onClick={()=>this.handleDelete(i,PseudoFacilities)}/></td>
                  </tr>
                  ))}
                </tbody>
              </Table>
      )
    }
        this.setState({facilityShow:code})
    };

  // Proceed to next step
  nextStep = () => {
    const { step } = this.state;
    this.setState({
      step: step + 1
    });
  };

  // Go back to prev step
  prevStep = () => {
    const { step } = this.state;
    this.setState({
      step: step - 1
    });
  };

  register = (data) =>{
    this.handleModal(false);
    this.handleLoad();
    // this.handleRegister();
    console.log(data);
    Axios.post("http://localhost:5000/center/signup1", data)
    .then((res) => {
      console.log( res);
      res.status==201 ? this.handleRegister(res) : this.handleFaulty();

    })
    .catch((err) => {
      console.log("Axios", err);
      this.handleFaulty();
    });
  };
  handleImage = input => e => {
    if(e.target.files[0]!=undefined){
    console.log(e.target.files[0]);
      this.setState({ FrontImageType: e.target.files[0].type });
      const reader=new FileReader();
      reader.onload=this.handleBase64.bind(this);
      reader.readAsBinaryString(e.target.files[0]);
    }
  };

  handleBase64 = (e) =>{
    let binaryString = e.target.result;
    this.setState({ FrontImage: btoa(binaryString) });
    // console.log(btoa(binaryString));
  };
  handleOffdays = x => e =>{
    console.log(x)
    console.log(e.target.checked)
    this.setState({ [x]:e.target.checked })
  };
  dropdownShow = (data,FacilityName) => {
    return(
      <div style={{marginBottom:"-2vh"}}>
      <Select required displayEmpty value={FacilityName} onChange={this.handleChange('FacilityName')} style={{margin:'20px',minWidth:'120px'}} variant="outlined">
        <MenuItem value="" disabled><em>None</em></MenuItem>
        {data.length>0 && data.map((value,i) => {
          return(
              <MenuItem value={value}>{value}</MenuItem >
            )
        })}
      </Select>
      </div>
      )
  }
  render() {

     const{ 
      step,
      Name,
      PhoneNo,
      Address,
      Email,
      Password,
      NearestLandmark,
      City,
      Pincode,
      State,
      Country,
      OpeningTime1,
      ClosingTime1,
      OpeningTime,
      ClosingTime,
      FrontImage,
      FrontImageType,
      LicenseNum,
      isLoading,
      isLoaded,
      isRegistered,
      isFaulty,
      indicate,
      radioControl,
      ModalShow,
      Monday,
      Tuesday,
      Wednesday,
      Thursday,
      Friday,
      Saturday,
      Sunday,
      facilities,
      FacilityName,
      CapacityperSlot,
      Price,
      facilityShow,
      dropdown
    } = this.state;
    const offdays ={
      Monday,
      Tuesday,
      Wednesday,
      Thursday,
      Friday,
      Saturday,
      Sunday
    };
    const values = { 
      Name,
      PhoneNo,
      Address,
      Email,
      Password,
      NearestLandmark,
      City,
      Pincode,
      State,
      Country,
      OpeningTime,
      ClosingTime,
      FrontImage,
      FrontImageType,
      LicenseNum,
      offdays,
      facilities
    };

    // const  errors = validateInfo(values);
    switch (step) {
      case 0:
        return(
        <> 
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <div  className="form_input">
            <div className="terms"> 
              <br/> 
              <h1>Center Registration Form</h1>
              <br />
              <br />
              <div className="reg-row">
                <div className="reg-col">
                  <div className="reg-img">
                    <img src="/images/register.gif" />  
                  </div>
                </div>
                <div className="reg-col">
                  <div className="txtfld">
                  <TextField
                    placeholder="Enter Your Name"
                    label="Name"
                    variant="outlined"
                    value={Name}
                    onChange={this.handleChange('Name')}
                    type="text"
                    fullWidth
                  />
                  <br />
                  <br />
                  </div>
                  <div className="txtfld">
                  <TextField
                    placeholder="Enter you Address"
                    label="Address"
                    value={Address}
                    variant="outlined"
                    onChange={this.handleChange('Address')}
                    type="text"
                    margin="normal"
                    fullWidth
                  />
                  <br />
                  </div>
                  <div className="txtfld">
                  <TextField
                    placeholder="Enter your Phone Number"
                    label="Phone Number"
                    value={PhoneNo}
                    variant="outlined"

                    onChange={this.handleChange('PhoneNo')}
                    type="number" inputProps={{ min:1000000000, max: 9999999999, step: 1}}
                    // helperText={(! errors.PhoneNo  && parseInt(values.PhoneNo)) ? "Not a valid Phone Number": '' }
                    // error={(! errors.PhoneNo && parseInt(values.PhoneNo))} 
                    margin="normal"
                    fullWidth
                  />
                  <br />
                  <br />
                  </div>

                  <div className="txtfld">
                  <TextField
                    placeholder="Enter you Email address"
                    label="Email address"
                    value={Email}
                    variant="outlined"
                    onChange={this.handleChange('Email')}
                    type="text"
                    margin="normal"
                    fullWidth
                  />
                  <br />
                  </div>
                  <div className="txtfld">
                  <TextField
                    placeholder="Enter your Password"
                    label="Password"
                    variant="outlined"
                    onChange={this.handleChange('Password')}
                    // helperText={(! errors.Password && parseInt(values.Password)) ? "The Password should be at least 8 characters long": '' }
                    // error={(! errors.Password && parseInt(values.Password))} 
                    type="password"
                    margin="normal"
                    fullWidth
                  />
                  <br />
                  </div>
                  <div className="txtfld">
                  <KeyboardTimePicker
                  format="HH:mm"
                  margin="normal"
                  value={OpeningTime1}
                  minutesStep={30}
                  onChange={(date) =>
                    this.handleTime('OpeningTime',format(date, "HH:mm"),'OpeningTime1',date)
                  }
                />
                  <br />
                  </div>
                  <div className="txtfld">
                  <KeyboardTimePicker
                  format="HH:mm"
                  margin="normal"
                  minutesStep={30}
                  id="date-picker-inline"
                  value={ClosingTime1}
                  onChange={(date) =>
                    this.handleTime('ClosingTime',format(date, "HH:mm"),'ClosingTime1',date)
                  }
                />
                  
                  <br />
                  </div>
                  <div className="txtfld">
                  <TextField
                    placeholder="Enter you Nearest Landmark"
                    label="Nearest Landmark"
                    value={NearestLandmark}
                    variant="outlined"
                    onChange={this.handleChange('NearestLandmark')}
                    type="text"
                    margin="normal"
                    fullWidth
                  />
                  <br />
                  </div>
                  <div className="txtfld">
                  <TextField
                    placeholder="Enter you City / Area / Province"
                    label="City / Area / Province"
                    value={City}
                    variant="outlined"
                    onChange={this.handleChange('City')}
                    type="text"
                    margin="normal"
                    fullWidth
                  />
                  <br />
                  </div>
                  <div className="txtfld">
                  <TextField
                    placeholder="Enter you Pincode"
                    value={Pincode}
                    label="Pincode"
                    variant="outlined"
                    onChange={this.handleChange('Pincode')}
                    type="text"
                    margin="normal"
                    fullWidth
                  />
                  <br />
                  </div>
                  <div className="txtfld">
                  <TextField
                    placeholder="Enter you State / Union Territory"
                    label="State / Union Territory"
                    value={State}
                    variant="outlined"
                    onChange={this.handleChange('State')}
                    type="text"
                    margin="normal"
                    fullWidth
                  />
                  <br />
                  </div>
                  <div className="txtfld">
                  <TextField
                    placeholder="Enter you Country"
                    value={Country}
                    label="Country"
                    variant="outlined"
                    onChange={this.handleChange('Country')}
                    type="text"
                    margin="normal"
                    fullWidth
                  />
                  <br />
                  </div>
                  <div className="txtfld">
                  <TextField
                    placeholder="Enter the Google Drive Link for the image"
                    variant="outlined"
                    onChange={this.handleImage('FrontImage')}
                    type="text"
                    fullWidth
                  />
                  </div>
                  
                  <div className="txtfld">
                  <TextField
                    placeholder="Enter you License Number"
                    value={LicenseNum}
                    label="License Number"
                    variant="outlined"
                    onChange={this.handleChange('LicenseNum')}
                    type="number"
                    margin="normal"
                    fullWidth
                  />
                  <br />
                  </div>
                  <div className='txtfld'>
                  <FormLabel component="legend">Offdays</FormLabel>
                  <FormGroup aria-label="position" row>
                    <FormControlLabel
                      value="Monday"
                      control={<Checkbox style={{color:"#a5a89f"}} onChange={this.handleOffdays('Monday')} checked={Monday}/>}
                      label="Monday"
                      labelPlacement="bottom"
                    />
                    <FormControlLabel
                      value="Tuesday"
                      control={<Checkbox style={{color:"#a5a89f"}} onChange={this.handleOffdays('Tuesday')} checked={Tuesday}/>}
                      label="Tuesday"
                      labelPlacement="bottom"
                    />
                    <FormControlLabel
                      value="Wednesday"
                      control={<Checkbox style={{color:"#a5a89f"}} onChange={this.handleOffdays('Wednesday')} checked={Wednesday}/>}
                      label="Wednesday"
                      labelPlacement="bottom"
                    />
                    <FormControlLabel
                      value="Thursday"
                      control={<Checkbox style={{color:"#a5a89f"}} onChange={this.handleOffdays('Thursday')} checked={Thursday}/>}
                      label="Thursday"
                      labelPlacement="bottom"
                    />
                    <FormControlLabel
                      value="Friday"
                      control={<Checkbox style={{color:"#a5a89f"}} onChange={this.handleOffdays('Friday')} checked={Friday}/>}
                      label="Friday"
                      labelPlacement="bottom"
                    />
                    <FormControlLabel
                      value="Saturday"
                      control={<Checkbox style={{color:"#a5a89f"}} onChange={this.handleOffdays('Saturday')} checked={Saturday}/>}
                      label="Saturday"
                      labelPlacement="bottom"
                    />
                    <FormControlLabel
                      value="Sunday"
                      control={<Checkbox style={{color:"#a5a89f"}} onChange={this.handleOffdays('Sunday')} checked={Sunday}/>}
                      label="Sunday"
                      labelPlacement="bottom"
                    />
                  </FormGroup>
                  </div>
                  <br/>
                  <div className="btn1">
                    {!isLoading && !isLoaded && <Button
                         style={{
                            border: "5px solid bisque",
                            backgroundColor: "white",
                            color: "black",
                          }}
                        variant="contained"
                      
                        onClick={() => this.nextStep()}
                      >
                        Proceed
                      </Button>}
                  </div>
                  
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  
                </div>

              </div>

            </div>
          </div>
        </MuiPickersUtilsProvider>
        </>
        );
      case 1:
        return(
        <>
          <TnCModal
            size="lg"
            name="Terms & Conditions"
            head="Read The Terms And Conditions Carefully"
            text="The protal is not responsible for any mishaps in the test centre.If you cancel an appointment of the user
            that can in further run decrease your positive credibility decreasing the capacity per slot of the test centre slot."
            show={ModalShow}
            onHide={() => this.handleModal(false)}
            onAgree={() => this.register(values)}
          />
          <div  className="form_input">
            <div className="terms"> 
              <br/> 
              <h1>Add Facility</h1>
              
              <div className="reg-row">
                <div className="reg-col">
                  <div className="reg-img">
                    <img src="/images/register.gif" />  
                  </div>
                </div>

                <div className="reg-col">
                  <div className="txtfld">
                    <label style={{marginTop:"5vh",marginBottom:"-2vh",marginLeft:"2vw"}}>Facility Name</label>
                    {this.dropdownShow(dropdown,FacilityName)}
                  </div>
                  
                  <div className="txtfld" style={{width:"20vw",marginLeft:"46.5vw"}}>
                  <TextField
                    placeholder="Enter the Capacity per Slot"
                    label="Capacity per Slot"
                    variant="outlined"
                    value={CapacityperSlot}
                    onChange={this.handleChange('CapacityperSlot')}
                    type="number" 
                    margin="normal"
                    fullWidth
                    required
                  />
                  </div>
                  <div className="txtfld" style={{width:"20vw",marginLeft:"46.5vw"}}>
                  <TextField
                    placeholder="Enter the Price"
                    label="Price"
                    variant="outlined"
                    value={Price}
                    onChange={this.handleChange('Price')}
                    type="number"
                    inputProps={{min:"0.01" ,step:"0.01"}}
                    margin="normal"
                    fullWidth
                    required
                  />
                  </div>
                  <br />
                  <div className="btn2">
                  {!isLoading && !isLoaded && <Button
                       style={{
                            border: "5px solid bisque",
                            backgroundColor: "white",
                            color: "black",
                            marginLeft:"10vw"
                          }}

                        variant="contained"
                        onClick={() => this.handleAddAnother(FacilityName,CapacityperSlot,Price,facilities)}
                      >
                        Add
                      </Button>}
                  </div>
                  <br /><br />
                  <br /><br />
                <div className="txtfld">{facilityShow}</div>
                <br /><br />
                  <div className="btn1">
                    {!isLoading && !isLoaded && <Button
                       style={{
                            border: "5px solid bisque",
                            backgroundColor: "white",
                            color: "black",
                          }}

                        variant="contained"
                      
                        onClick={() => this.handleModal(true)}
                      >
                        Proceed
                      </Button>}
                  </div>
                  <div className="btn2">
                    {!isLoading && !isLoaded && <Button
                       style={{
                            border: "5px solid bisque",
                            backgroundColor: "white",
                            color: "black",
                          }}

                        variant="contained"
                      
                        onClick={ () => this.prevStep()}
                      >
                        Back
                      </Button>}
                  </div>
                  <br/>
                  <br/>
                  <br/>
                  <div className="no-chng">
                    {isLoading && <LinearProgress />}                
                  {isFaulty && <div style={{color:"red",fontSize:'20px',marginLeft:'40vw'}}>* Please fill in your details properly.</div>}
                {isRegistered && isLoaded && <div  style={{fontSize:'20px',marginLeft:'30vw',marginRight:"30vw",textAlign:"center"}}>You have Registered Successfully.Redirecting to Verification page.</div>}
                {!isRegistered && isLoaded && <div style={{color:"red",fontSize:'20px',marginLeft:'30vw',marginRight:"30vw",textAlign:"center"}}>The information provided is invalid. Please try again.</div>}
                <br />
                  {indicate && <Redirect to={{
                        pathname: "/centerVerify", 
                       }} />}
                  </div>
                  <br />
                  <br />
                  <br />
                  <br />
                </div>

              </div>

            </div>
          </div>
        </>
        );
    }
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

export default connect(mapStateToProps,mapDispatchToProps)(CenterRegisterForm);