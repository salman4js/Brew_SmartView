import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const PanelFooter = (props) => {
  return (
    <Modal.Footer>
        <Button variant="secondary" onClick={() => props.onFailure()}>
            {props.failure}
        </Button>
        <Button variant="primary" onClick={() => props.onSuccess()}>
            {props.success}
        </Button>
    </Modal.Footer>
  )
}

export default PanelFooter