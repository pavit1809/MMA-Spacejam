import React, { Component} from 'react';
import { Link,Redirect } from 'react-router-dom';
import './LoginNavbar.css';
import TnCModal from "./TnCModal";
import Axios from "axios";
import {Navbar,Nav,NavDropdown} from 'react-bootstrap'
import {
  Button
} from "@material-ui/core";
import * as actionTypes from './store/actions'
import {connect} from 'react-redux'

class LoginNavbar extends Component {
  state = {
    click:false,
    loggedOut:false,
    GotTests:false,
    testInfo:"0",
    succeed:false,
    ModalShow:false,
    proceed:false
  };
  handleClick = (value) => {
    value==true ? this.setState({ ['click']: false }) : this.setState({ ['click']: true });
  };

  closeMobileMenu = () => {
    this.setState({ ['click']: false });
  };

  LogOut = (e,data) =>{
      e.preventDefault();
      this.closeMobileMenu();
      const userInfo = {userInfo:data}
      Axios.post("http://localhost:5000/user/logout",userInfo)
      .then((res) => {
        this.setState({['loggedOut']:true});
        window.localStorage.clear();
      })
      .catch((err) => {
        console.log("Axios", err);
      });
  };
  getTests = (e,data) =>{
    e.preventDefault();
    this.closeMobileMenu();
    const userInfo = {userInfo:data}
      Axios.post("http://localhost:5000/user/allappointments",userInfo)
      .then((res) => {
          // this.setState({testInfo:res.data}); 
          this.props.onChangeTestInfo(res.data);
          this.setState({['succeed']:true});

      })
      .catch((err) => {
        console.log("Axios", err);
        this.handleModal(true);
        // this.props.onChangeTestInfo([]);
        // this.setState({['succeed']:true});

      });

  };
  proceedToHome = (x) =>{
    this.setState({proceed:true})
    this.setState({ModalShow:x})
  };
  handleModal = (x) =>{
    this.setState({ModalShow:x})
  };
  render(){
    // const {userInfo} = this.props;
    const {
      click,
      loggedOut,
      testInfo,
      GotTests,
      succeed,ModalShow,
      proceed
    }=this.state;
    const values={
      // userInfo,
      testInfo
    }
    return (
      <>
       <TnCModal
        btnshow={true}
        btntext={true}
        size="lg"
        name="No Appointments Booked Yet"
        head="Please book appointments to view them "
        show={ModalShow}
        onHide={() => this.handleModal(false)}
        onAgree={() => this.proceedToHome(false)}
      />
          <Navbar style={{backgroundColor:'#a5a89f' , fontColor:'bisque' ,opacity:'0.9'}} sticky="top" collapseOnSelect expand="lg" variant="dark">
            <Navbar.Brand as={Link} to='/loginHome'><b style={{fontSize:"30px"}}>M</b>ake <b style={{fontSize:"30px"}}>M</b>y <b style={{fontSize:"30px"}}>A</b>ppointment</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav"  />
            <Navbar.Collapse style={{marginTop:'1vh'}} id="responsive-navbar-nav">
              <Nav className="ml-auto" style={{marginRight:'30px'}} >
                <Nav.Link style={{marginRight:'50px' , textDecoration:"none"}} as={Link} to='/loginHome' active>HOME</Nav.Link>
                <Nav.Link style={{marginRight:'50px' , textDecoration:"none"}} as={Link} onClick={(e) => this.getTests(e,this.props.userInfo)} to='/test' active>TESTS</Nav.Link>
                <Nav.Link style={{marginRight:'50px' , textDecoration:"none"}} as={Link} to='/profile' active>PROFILE</Nav.Link>
                <Nav.Link style={{marginRight:'50px' , textDecoration:"none"}} as={Link} onClick={(e) => this.LogOut(e,this.props.userInfo)} to='/login' active>LOGOUT</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>

          {loggedOut && 
            <Redirect push
              to={{
                pathname: "/login", 
                // data: loggedOut
              }} 
            />
          }
          {succeed && 
            <Redirect push
              to={{
                pathname: '/test', 
                // data: values
              }} 
            />
          }
          {proceed &&
            <Redirect 
              to={{
                pathname: '/loginHome', 
                // data: values
              }} 
            />

          }
        </>
    );
  }
}
const mapStateToProps = state => {
  return{
    userInfo:state.userInfo,
    check:state.check,
    testInfo:state.testInfo,
    // CentreValue:state.CentreValue,
    // centreList:state.centreList,
    // slots:state.slots

  };
};

const mapDispatchToProps = dispatch =>{
  return{
    onChangeUserInfo: (userInfo) => dispatch({type:actionTypes.CHANGE_STATE , userInfo:userInfo}),
    onChangeTestInfo: (testInfo) => dispatch({type:actionTypes.CHANGE_TESTINFO , testInfo:testInfo}),
    onChangeCheck: (check) => dispatch({type:actionTypes.CHANGE_CHECK , check:check}),
    onChangeCentreValue: (CentreValue) => dispatch({type:actionTypes.CHANGE_CENTREVALUE , CentreValue:CentreValue}),
    onChangeCenterList: (centreList) => dispatch({type:actionTypes.CHANGE_CENTRELIST , centreList:centreList}),
    onChangeSlots: (slots) => dispatch({type:actionTypes.CHANGE_SLOTS , slots:slots})
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(LoginNavbar);
