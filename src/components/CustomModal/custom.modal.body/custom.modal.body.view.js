import React from 'react';
import Modal from 'react-bootstrap/Modal';


const CustomModalBody = (props) => {  
  
  // Show Custom Modal Body Data!
  function _showCustomModalBody(){
    return props.data()
  }
  
  // Show custom modal body header!
  function _showBodyFooter(){
    return props.modalData.bodyFooterView();
  }
  
  return(
    <Modal.Body>
      {_showCustomModalBody()}
      {props.modalData.bodyFooter && (
        _showBodyFooter()
      )}
    </Modal.Body>
  )
}

export default CustomModalBody;
