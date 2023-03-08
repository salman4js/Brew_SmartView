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
                        <Modal.Title className="contained-modal-title-vcenter">
                            {props.config.title.id}
                        </Modal.Title>
                    )}
                </Modal.Header>
                <Modal.Body>
                    {props.config.content && props.config.content.id.isRequired && props.config.content.id.components && (
                        <ValueModal methodid={props.config.content.id.id} data={props.config.content.id.attributes} />
                    )}
                    {props.config.content.id.id === "favourites" && (
                        <div>
                            <label style={{ color: "black", fontWeight: "bold" }}> Select Room Options </label>
                            <select class="form-select" aria-label="Default select example" onChange = {(e => props.roomno(e.target.value))}>
                                <option selected>Choose...</option>
                                {
                                    props.config.content.favourites.content.btn.btn1.data.map((options, key) => {
                                        return (
                                            <option>{options.roomno} - {options.suiteName}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    )}
                </Modal.Body>
                {props.config.btn && props.config.btn.isRequired && (
                    <Modal.Footer>
                        {props.config.content.id.id === "favourites" && (
                            <div>
                                <Button variant={props.config.content.favourites.content.btn.btn1.variant} onClick={() => props.handleOpenModal(props.config.content.id.attributes)}>{props.config.content.favourites.content.btn.btn1.id}</Button>
                            </div>
                        )}
                    </Modal.Footer>
                )}
            </Modal>
        </div>
    )
}

export default ModalValue;