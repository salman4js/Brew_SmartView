import React, {useState, useEffect} from 'react';
import Modal from "react-bootstrap/Modal";

const Modals = (props) => {

    const [show, setShow] = useState(props.show);

    const handleClose = () => {
        setShow(!show)
    }

    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Body className = "text-center">
                    {props.message} 
                </Modal.Body>
            </Modal>
        </div>

    )
}

export default Modals