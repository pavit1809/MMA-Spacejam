import React from 'react';
import Axios from "axios";
import {Button,Modal} from 'react-bootstrap';
import Rating from '@material-ui/lab/Rating';
import {Typography,Box,TextField} from '@material-ui/core';

function TnCModal2(props) {
  const [otp, setOtp] = React.useState("");
  const [idnum, setIdnum] = React.useState("");
  const [errmsg, setErrmsg] = React.useState("");
  const handlePost = (userid,appid,centerInfo,otp,idnum) =>{

    const data = {userid,appid,centerInfo,otp,idnum};
    // console.log(data);
    Axios.post("http://localhost:5000/center/userverify", data)
    .then((res) => {
  
      props.onAgree()
      window.location.reload();
    })
    .catch((err) => {
      if(err.response.status==400){
          setErrmsg(err.response.data);
      }
    });
  };
  return (
    <Modal
    style={{backgroundColor:"linear-gradient(315deg, #b8c6db 0%, #f5f7fa 74%)"}}
    show={props.show} 
      onHide={props.onHide}
      backdrop="static"
      dialogClassName="modal-60w"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title >
          {props.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>{props.head}</h4>
        <p>
          {props.text}
          <TextField
                  placeholder="Enter OTP"
                  label="OTP"
                  variant="outlined"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  type="text"
                  fullWidth
          />
          <br />
          <br />
          <TextField
                  placeholder="ID NUMBER"
                  label="ID Number"
                  variant="outlined"
                  value={idnum}
                  onChange={e => setIdnum(e.target.value)}
                  type="text"
                  fullWidth
          />
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button style={{border:'5px solid bisque',backgroundColor:'white',color:'black'}} variant="danger" onClick={props.onHide}>
            Cancel
          </Button>
          <Button style={{border:'5px solid bisque',backgroundColor:'white',color:'black'}} variant="success" onClick={() => handlePost(props.userid,props.appid,props.centerInfo,otp,idnum)}>
            Verify
          </Button>
          <br/>
          <h2>{errmsg}</h2>
      </Modal.Footer>
    </Modal>
  );
}
export default TnCModal2;