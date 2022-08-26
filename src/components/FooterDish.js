import React, {useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const FooterDish = () => {

    const [show, setShow] = useState(false);

    const handleShow = () => {
        setShow(!show);
    }

  return (
    <div className="main-footer text-center">
      <div className='container'>
      <Modal show={show}>
      <Modal.Header closeButton>
            <Modal.Title> Add New Dishes! </Modal.Title>
          </Modal.Header>
          <Modal.Body>
                <div className='modal-gap'>
                    <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder = "Dish Name"  />
                </div>
                <div className='modal-gap'>
                    <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='Dish Rate' />
                </div>
                <div className='modal-gap'>    
                    <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='Dish-Type' />
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
        <button type="button" className='btn btn-outline-info' onClick={() => handleShow()}>
          Add Dish!
        </button>
      </div>
    </div>
  )
}

export default FooterDish;