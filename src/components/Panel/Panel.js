import React from 'react';
import Modal from 'react-bootstrap/Modal';

const Panel = (props) => {
  return (
    <Modal.Body>
        {props.text}
    </Modal.Body>
  )
}

export default Panel;