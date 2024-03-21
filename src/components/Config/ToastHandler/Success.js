import React from 'react';
import Modal from 'react-bootstrap/Modal';

const success = (props) => {
  return (
    <Modal
        show={props.show}
        onHide={props.handleClose}
        backdrop="static"
        keyboard={false}
    >
        <Modal.Header closeButton>

        </Modal.Header>
    </Modal>
  )
}

export default success;