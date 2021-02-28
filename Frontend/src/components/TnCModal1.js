import React from 'react';
import Axios from "axios";
import {Button,Modal} from 'react-bootstrap';
import Rating from '@material-ui/lab/Rating';
import {Typography,Box,TextField} from '@material-ui/core';
import './Test.css';
function TnCModal(props) {
  const [value, setValue] = React.useState(2);
  const [review, setReview] = React.useState("");
  const handlePost = (_id,rating,review) =>{
    const data = {_id,rating,review};
    Axios.post("http://localhost:5000/review/new", data)
    .then((res) => {
      // console.log("Hey this is your result", res);
      props.onAgree()
    })
    .catch((err) => {
      console.log("Axios", err);
    });
  };
  return (
    <Modal
    style={{backgroundColor:"linear-gradient(315deg, #b8c6db 0%, #f5f7fa 74%)"}}
      show={props.show} 
      onHide={props.onHide}
      backdrop="static"
      dialogClassName="modal-60w"
      className="special_modal"
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
                  placeholder="Enter your Suggestions/Comment"
                  label="Review"
                  variant="outlined"
                  value={review}
                  onChange={e => setReview(e.target.value)}
                  type="text"
                  fullWidth
          />
          <br />
          <br />
          <Box component="fieldset" mb={3} borderColor="transparent">
            <Typography component="legend">Rating :</Typography>
            <Rating
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
            />
          </Box>
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button style={{border:'5px solid bisque',backgroundColor:'white',color:'black'}} variant="danger" onClick={props.onHide}>
            Cancel
          </Button>
          <Button style={{border:'5px solid bisque',backgroundColor:'white',color:'black'}} variant="success" onClick={() => handlePost(props.id,value,review)}>
            Post
          </Button>
      </Modal.Footer>
    </Modal>
  );
}
export default TnCModal;