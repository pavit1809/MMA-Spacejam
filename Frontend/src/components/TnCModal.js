import {Button,Modal} from 'react-bootstrap';

function TnCModal(props) {
  return (
    <Modal
      style={{backgroundColor:"linear-gradient(315deg, #b8c6db 0%, #f5f7fa 74%)"}}
      show={props.show} 
      onHide={props.onHide}
      backdrop="static"
      size={props.size}
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
        </p>
      </Modal.Body>
      <Modal.Footer>
        {!props.btnshow && <Button style={{border:'5px solid bisque',backgroundColor:'white',color:'black'}} variant="danger" onClick={props.onHide}>
                    Decline
                  </Button>}
          <Button style={{border:'5px solid bisque',backgroundColor:'white',color:'black'}} variant="success" onClick={props.onAgree}>
            {!props.btntext ? "Agree" : "Continue"}
          </Button>
      </Modal.Footer>
    </Modal>
  );
}
export default TnCModal;