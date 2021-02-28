import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import "./CenterLoginHome.css";
import * as actionTypes from './store/actions'
import {connect} from 'react-redux'
import Axios from "axios";
import StickyHeadTable from './StickyHeadTable'
import MuiAlert from '@material-ui/lab/Alert';
import Progress from './Progress';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
export class CenterReviews extends Component {
  state= {
    val:100
  };
  render() {
    const{ 
      val
    } = this.state;
    const{reviews}=this.props;
    return(
    <div>
    <div className="row">
      <div className="reviews">
      <h1>Your Reviews</h1>
        <StickyHeadTable arr={reviews.arr}/>
      </div>
      <div style={{marginLeft:'10vw', marginTop:'10vh'}}>
      {reviews.flag==0 
        ?
          <Alert style={{border:"2px solid  bisque" , boxShadow: "-10px 25px 50px #a5a89f"}} severity="error">{reviews.comment}</Alert>
        :
          <Alert style={{border:"2px solid  bisque" , boxShadow: "-10px 25px 50px #a5a89f"}}  severity="success">{reviews.comment}</Alert>
      }
      <Progress style={{border:"2px solid  bisque" , boxShadow: "-10px 25px 50px #a5a89f"}}  value={reviews.posper}/>

      </div>
    </div>

    <br/>
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

export default connect(mapStateToProps,mapDispatchToProps)(CenterReviews);
