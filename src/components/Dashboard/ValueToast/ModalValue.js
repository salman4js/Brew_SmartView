import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ValueModal from './ValueModal';
import Panel from '../../Panel/Panel';

const ModalValue = (props) => {
    return (
        <div>
            <Modal
                show={props.show}
                onHide={props.handleClose}
                background="static"
                className="text-center"
                centered
            >
                {props.toast === true ? (
                    <div>
                        <Modal.Header closeButton>
                            <Panel className = "text-center" text = {props.toastMessage} />
                        </Modal.Header>
                    </div>
                ) : (
                    <div>
                        <Modal.Header closeButton>
                            {props.config.title && props.config.title.isRequired && (
                                <Modal.Title className="contained-modal-title-vcenter">
                                    {props.config.title.id}
                                </Modal.Title>
                            )}
                        </Modal.Header>
                        <Modal.Body>
                            {props.config.content && props.config.content.id.isRequired && props.config.content.id.components && (
                                <ValueModal methodid={props.config.content.id.id} data={props.config.content.id.attributes} />
                            )}
                        </Modal.Body>
                        {props.config.btn && props.config.btn.isRequired && (
                            <div>
                                {props.config.content.id.id === "favourites" && (
                                    <Modal.Footer>
                                        <Button variant={props.config.content.favourites.content.btn.btn2.variant} onClick={() => props.handleOpenModal(props.config.content.id.attributes, props.config.content.favourites.content.btn.btn2.id)}>{props.config.content.favourites.content.btn.btn2.id}</Button>
                                        <Button variant={props.config.content.favourites.content.btn.btn1.variant} onClick={() => props.handleOpenModal(props.config.content.id.attributes, props.config.content.favourites.content.btn.btn1.id)}>{props.config.content.favourites.content.btn.btn1.id}</Button>
                                    </Modal.Footer>
                                )}
                            </div>
                        )}
                    </div>
                )
            }
            </Modal>
        </div>
    )
}

export default ModalValue;