import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Panel from '../Panel/Panel';

const success = (props) => {
  return (
    <Modal
        show={props.show}
        onHide={props.handleClose}
        backdrop="static"
        keyboard={false}
    >
        <Modal.Header closeButton>
            <Panel className = "text-center" text = {props.text} />
        </Modal.Header>
    </Modal>
  )
}

export default success;