import React from 'react';
import Modal from 'react-bootstrap/Modal';


const CustomModalBody = (props) => {  

  // Show Custom Modal Body Data!
  function _showCustomModalBody(){
    return props.data()
  }
  
  return(
    <Modal.Body>
      {_showCustomModalBody()}
    </Modal.Body>
  )
}

export default CustomModalBody;
