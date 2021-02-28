import React from "react";
import Bounce from "react-reveal/Bounce";
import { Link, Redirect } from "react-router-dom";
import CardComponent from "./CardComponent";
import CardComponent1 from "./CardComponent1";
import { style1 } from "./CardData";
import "./CentreCards.css";
import { TextField, LinearProgress, Select, MenuItem } from "@material-ui/core";
import Axios from "axios";
import * as actionTypes from "./store/actions";
import { connect } from "react-redux";

export class CentreCards extends React.Component {
  state = {
    centre: "0",
    selected: false,
    initial: true,
    origcode: "",
    slots: "",
    CentreValue: "",
  };
  handleChange = (input) => (e) => {
    this.setState({ [input]: e.target.value });
  };
  handleSlot = (x, y) => {
    // console.log(x);
    // this.setState({CentreValue:x});
    this.props.onChangeCentreValue(x);
    const flag1 = x;
    const flag2 = { data: y.data };
    // console.log(flag1,flag2);
    const ret = { userInfo: flag2, flag1 };
    console.log(ret);
    Axios.post("http://localhost:5000/user/allslots", ret)
      .then((res) => {
        this.handleClick(res);
      })
      .catch((err) => {
        console.log("Axios", err);
        // this.handleProceedFaulty();
      });
  };
  handleClick = (x) => {
    // this.setState({slots:x.data});
    this.props.onChangeslots(x.data);
    this.setState({ selected: true });
  };
  show(centreList, userInfo) {
    /* tochange */
    console.log(userInfo);
    this.setState({ initial: false });
    let len = centreList.length;
    let i;
    const code: JSX.Element[] = [];
    // code.push(<CardComponent1  handleSlot={this.handleSlot} data="hey" img='/images/Add.jpg'
    //   alt='Post_normal'
    //   Name='Some Random text'
    //   Address='Some Random text'
    //   Cost='text'
    //   Distance='Some'
    //   OpeningTime='Random'
    //   ClosingTime='Random'
    //   Rating='3'
    //   Tags={['Some', 'Random', 'text','Some', 'Random', 'text','Some']}/>);
    for (i = 0; i < len - 2; i += 3) {
      let value = centreList[i];
      let value1 = centreList[i + 1];
      let value2 = centreList[i + 2];
      code.push(
        <div className="home__hero-row">
          <CardComponent1
            handleSlot={this.handleSlot}
            data={value}
            data1={userInfo}
            Tags={value.tags}
            img={value.cen.FrontImage}
            Name={value.cen.Name}
            Address={value.cen.Address}
            Cost={value.costing}
            Distance={value.dis}
            OpeningTime={value.cen.OpeningTime}
            ClosingTime={value.cen.ClosingTime}
          />
          <CardComponent1
            handleSlot={this.handleSlot}
            data={value1}
            data1={userInfo}
            Tags={value1.tags}
            img={value1.cen.FrontImage}
            Name={value1.cen.Name}
            Address={value1.cen.Address}
            Cost={value1.costing}
            Distance={value1.dis}
            OpeningTime={value1.cen.OpeningTime}
            ClosingTime={value1.cen.ClosingTime}
          />
          <CardComponent1
            handleSlot={this.handleSlot}
            data={value2}
            data1={userInfo}
            Tags={value2.tags}
            img={value2.cen.FrontImage}
            Name={value2.cen.Name}
            Address={value2.cen.Address}
            Cost={value2.costing}
            Distance={value2.dis}
            OpeningTime={value2.cen.OpeningTime}
            ClosingTime={value2.cen.ClosingTime}
          />
        </div>
      );
    }
    let value = centreList[3 * parseInt(len / 3)];
    if (len % 3 == 1) {
      let value = centreList[3 * parseInt(len / 3)];
      code.push(
        <div className="home__hero-row">
          <CardComponent1
            handleSlot={this.handleSlot}
            data={value}
            data1={userInfo}
            Tags={value.tags}
            img={value.cen.FrontImage}
            Name={value.cen.Name}
            Address={value.cen.Address}
            Cost={value.costing}
            Distance={value.dis}
            OpeningTime={value.cen.OpeningTime}
            ClosingTime={value.cen.ClosingTime}
          />
        </div>
      );
    }
    if (len % 3 == 2) {
      let value = centreList[3 * parseInt(len / 3)];
      let value1 = centreList[3 * parseInt(len / 3) + 1];
      code.push(
        <div className="home__hero-row">
          <CardComponent1
            handleSlot={this.handleSlot}
            data={value}
            data1={userInfo}
            Tags={value.tags}
            img={value.cen.FrontImage}
            Name={value.cen.Name}
            Address={value.cen.Address}
            Cost={value.costing}
            Distance={value.dis}
            OpeningTime={value.cen.OpeningTime}
            ClosingTime={value.cen.ClosingTime}
          />
          <CardComponent1
            handleSlot={this.handleSlot}
            data={value1}
            data1={userInfo}
            Tags={value1.tags}
            img={value1.cen.FrontImage}
            Name={value1.cen.Name}
            Address={value1.cen.Address}
            Cost={value1.costing}
            Distance={value1.dis}
            OpeningTime={value1.cen.OpeningTime}
            ClosingTime={value1.cen.ClosingTime}
          />
        </div>
      );
    }
    this.setState({ origcode: code });
  }
  render() {
    // const { centreList,userInfo} = this.props;        /* tochange */

    const {
      centre,
      selected,
      initial,
      origcode,
      slots,
      CentreValue,
    } = this.state;

    const values = {
      slots,
      // userInfo,
      CentreValue,
    };
    return (
      <div className="helper">
        {initial && this.show(this.props.centreList, this.props.userInfo)}{" "}
        {/* tochange */}
        {origcode}
        {selected && (
          <Redirect
            push
            to={{
              pathname: "/selectionPage2",
              // data: values           /* tochange */
            }}
          />
        )}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo,
    centreList: state.centreList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onChangeUserInfo: (userInfo) =>
      dispatch({ type: actionTypes.CHANGE_STATE, userInfo: userInfo }),
    onChangeslots: (slots) =>
      dispatch({ type: actionTypes.CHANGE_SLOTS, slots: slots }),
    onChangeCentreValue: (CentreValue) =>
      dispatch({
        type: actionTypes.CHANGE_CENTREVALUE,
        CentreValue: CentreValue,
      }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CentreCards);
