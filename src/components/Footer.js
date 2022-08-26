import React, {useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {Link} from "react-router-dom";

const Footer = () => {

    const [show, setShow] = useState(false);

    const handleShow = () => {
        console.log(show);
        setShow(!show);
    }

  return (
    <div className="main-footer text-center">
      <div className='container'>
      <Modal show={show}>
      <Modal.Header closeButton>
            <Modal.Title> Add New Rooms </Modal.Title>
          </Modal.Header>
          <Modal.Body>
                <div className='modal-gap'>
                    <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder = "Room No"  />
                </div>
                <div className='modal-gap'>
                    <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='Bed Count' />
                </div>
                <div className='modal-gap'>    
                    <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='Suite-Type' />
                </div>
          </Modal.Body>
        
        <Modal.Footer>
            <div className = "row">
                <Button variant="outline-secondary" onClick = {() => handleShow()}>
                    Save & Close
                </Button>
            </div>
          </Modal.Footer>
      </Modal>
        <Link to = "" className = "nav-link dropdown-item" style = {{color : "black"}} onClick = {handleShow}> Add Rooms </Link>
      </div>
    </div>
  )
}

export default Footer