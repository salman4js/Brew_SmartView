import React from 'react';
import Modal from 'react-bootstrap/Modal';

const Panel = (props) => {
  return (
    <Modal.Body className = {props.className}>
        {props.text}
    </Modal.Body>
  )
}

export default Panel;