import { Link,Redirect } from 'react-router-dom';
import React from "react";
import "./ParticularCard.css";
import Axios from "axios";
import Ratings from "./StarRatingComponent";
import EnhancedTable from "./EnhancedTable";
import TnCModal from "./TnCModal";
import { Button } from "react-bootstrap";
import * as actionTypes from './store/actions'
import {connect} from 'react-redux'


export class ParticularCard extends React.Component {
  state = {
    selectedTime: "0",
    ModalShow1:false,
    ModalShow2:false,
    ModalShow3:false,
    disableSuccess:true,
    proceedToHome:false,
    client:""
  };
  handleModal1 = (x) => {
    this.setState({disableSuccess:true})
    this.setState({ModalShow1:x})
  };
  handleModal2 = (x) => {
    this.setState({disableSuccess:true})
    this.setState({ModalShow2:x})
  };
  handleModal3 = (x) => {
    this.setState({disableSuccess:true})
    this.setState({ModalShow3:x})
  };
  handleTime = (x) => {
    if (x.length > 0) this.setState({ selectedTime: x });
    else this.setState({ selectedTime: "0" });
  };
  success = (userInfo,CentreValue,selectedTime) => {
    const data={userInfo,CentreValue,selectedTime}
    console.log(data)
    this.handleModal1(false);
    this.setState({disableSuccess:false})
    Axios.post("http://localhost:5000/user/newappointment", data)
    .then((res) => {
      this.handleModal2(true) ;
    })
    .catch((err) => {
      console.log("Axios", err);
      this.handleModal3(true) ;
    });
  };
  render() {
    const { 
      selectedTime,
      ModalShow1,
      ModalShow2,
      ModalShow3,
      disableSuccess,
      proceedToHome,
  client
    } = this.state;
    // const { CentreValue, userInfo, slots } = this.props; /* tochange */
    const values={
      // CentreValue,
      selectedTime,
      // userInfo
    }
    return (
      <div >
      <TnCModal
        size="lg"
        name="Terms & Conditions"
        head="Read The Terms And Conditions Carefully"
        text="Please check your time slot details, test name, date selected and test center details. 
        You're booking an appointment at your own discretion. The portal is not responsible for any 
        mishaps in the test centre. If you cancel an appointment after booking, you'll be given a 
        penalty that you'll have to pay on your next appointment."
        show={ModalShow1}
        onHide={() => this.handleModal1(false)}
        onAgree={() => this.success(this.props.userInfo,this.props.CentreValue,selectedTime)}
      />
      <TnCModal
        btntext={true}
        btnshow={true}
        size="sm"
        name="Success"
        head="Your appointment has been booked successfully."
        text="Please visit tests tab to view your appointment details and post your reviews."
        show={ModalShow2}
        onHide={() => this.handleModal2(false)}
        onAgree={() => this.setState({proceedToHome:true})}
      />
      <TnCModal
        btntext={true}
        btnshow={true}
        size="sm"
        name="Failed"
        head="Your appointment booking failed due to an error."
        text="Please try again."
        show={ModalShow3}
        onHide={() => this.handleModal3(false)}
        onAgree={() => this.handleModal3(false)}
      />
        <div className="user-row">
          <div className="user-col">
            <div className="UserPanel">
              <div className="user-avatar">
                {<img style={{borderRadius:"5px"}} src={this.props.CentreValue.cen.FrontImage} alt="profile" />}
              </div>

              <div className="center-details">
                <h4>
                  <b>{this.props.CentreValue.cen.Name}</b>
                </h4>
              </div>
              <div className="center-details">
                
                  <b>Address: </b>
                  {this.props.CentreValue.cen.Address}
                
              </div>
              <div className="center-details">
                
                  <b>Phone Number: </b>
                  {this.props.CentreValue.cen.PhoneNo}
                
              </div>
              <div className="center-details">
                
                  <b>Email: </b>
                  {this.props.CentreValue.cen.Email}
                
              </div>
              <div className="center-details">
                Timings:
                
                  {this.props.CentreValue.cen.OpeningTime} - {this.props.CentreValue.cen.ClosingTime}
                
              </div>
              <div className="center-details">
                Rating:
              </div>
              <div className="center-details">
                <h6>
                  <Ratings rating={this.props.CentreValue.cen.AvgStars} />
                </h6>
              </div>
              
            </div>
          </div>
          <div className="user-col">
            <div className="tble">
              <EnhancedTable handleTime={this.handleTime} slots={this.props.slots} />
            </div>
            <div className="box">
              <div className="row">
                  <div className="details-col">
                      <div className="details-row">
                         Date Selected :{" "}
                        {this.props.CentreValue.askeddate}
                      </div>
                      <div className="details-row">
                        Test : {this.props.CentreValue.service}
                      </div>
                      <div className="details-row">
                        Distance : {this.props.CentreValue.dis} Km
                      </div>
                      <div className="details-row">
                        Cost : ₹{this.props.CentreValue.costing}
                      </div>
                      <div className="details-row">
                        Fine : ₹{this.props.CentreValue.fine==null ? 0 :this.props.CentreValue.fine=="" }
                      </div>
                      <div className="details-row">
                        Total : ₹
                        {parseFloat(this.props.CentreValue.costing) +
                          parseFloat(this.props.CentreValue.fine==null ? 0 :this.props.CentreValue.fine=="" )}
                      </div>
                  </div>

                    <div className="details-col">
                      <div className="proceed-btn">
                        <Button
                          disabled={disableSuccess && (selectedTime == "0" || selectedTime == [])}
                          style={{border:'5px solid bisque',backgroundColor:'white',color:'black',marginLeft:'10vw',marginBottom:"-32vh"}}
                          onClick={() => this.handleModal1(true)}
                        >
                          BOOK
                        </Button>
                      </div>
                    </div>

                    
              </div>
            </div>
          </div>
        </div>
        {proceedToHome && <Redirect to={{
                      pathname: "/loginHome", 
                      // data: {userInfo}
                     }} />}
      </div>
    );
  }
}
const mapStateToProps = state => {
  return{
    userInfo:state.userInfo,
    slots:state.slots,
    CentreValue:state.CentreValue  
  };
};

const mapDispatchToProps = dispatch =>{
  return{
    onChangeUserInfo: (userInfo) => dispatch({type:actionTypes.CHANGE_STATE , userInfo:userInfo}),
    onChangeslots: (slots) => dispatch({type:actionTypes.CHANGE_SLOTS , slots:slots}),
    onChangeCentreValue: (CentreValue) => dispatch({type:actionTypes.CHANGE_CENTREVALUE , CentreValue:CentreValue})
  };
};
export default connect(mapStateToProps,mapDispatchToProps)(ParticularCard);
