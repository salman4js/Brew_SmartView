import React from 'react';
import CustomModalBody from './custom.modal.body/custom.modal.body.view'
import Modal from 'react-bootstrap/Modal';

const CustomModal = (props) => {

  return(
    <Modal
        show={props.modalData.show}
        onHide={() => props.modalData.onHide(false)}
        backdrop="static"
        keyboard={false}
        centered= {props.modalData.centered}
    >
        <Modal.Header closeButton>
          {props.modalData.header}
        </Modal.Header>
        <CustomModalBody data = {props.data} />
    </Modal>
  )
}

export default CustomModal;