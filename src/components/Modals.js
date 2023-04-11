import React, { useState, useEffect } from 'react';
import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button';

const Modals = (props) => {

    const [show, setShow] = useState(props.show);

    const handleClose = () => {
        props.setShow(false);
    }

    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                {props.options && props.options.header && (
                    <Modal.Header closeButton>
                        {props.options.headerText}
                    </Modal.Header>
                )}
                <Modal.Body className="text-center">
                    {props.message}
                    {props.options && props.options.error && (
                        <div className = "text-center">
                                {props.options.errorView}
                        </div>
                    )}
                </Modal.Body>
                {props.options && props.options.footer && (
                    <Modal.Footer>
                        <Button variant = "btn btn-outline-success" onClick = {() => props.generateInvoice()}>
                            {props.options.footerAttr.btn.btn1}
                        </Button>
                    </Modal.Footer>
                )}
            </Modal>
        </div>

    )
}

export default Modals