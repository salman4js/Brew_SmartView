import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ValueModal from './ValueModal';

const ModalValue = (props) => {
    return (
        <div>
            <Modal
                show={props.show}
                onHide={props.handleClose}
                backdrop="static"
                keyboard={false}
                className="my-modal"
                centered
            >
                <Modal.Header closeButton>
                    {props.config.title && props.config.title.isRequired && (
                        <Modal.Title className = "contained-modal-title-vcenter">
                            {props.config.title.id}
                        </Modal.Title>
                    )}
                </Modal.Header>
                <Modal.Body>
                    {props.config.content && props.config.content.id.isRequired && props.config.content.id.components && (
                        <ValueModal methodid = {props.config.content.id.id} data = {props.config.content.id.attributes}  />
                    )}
                </Modal.Body>
                {props.config.btn && props.config.btn.isRequired && (
                    <Modal.Footer>
                        <Button variant = "secondary" onClick={() => props.handleClose()}>{props.config.btn.btn.id}</Button>
                    </Modal.Footer>
                )}
            </Modal>
        </div>
    )
}

export default ModalValue;