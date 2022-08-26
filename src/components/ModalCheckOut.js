import React, { useEffect } from 'react';
import Modal from "react-bootstrap/Modal"

const ModalCheckOut = (props) => {
    useEffect(() => {
        props.userid(props.user)
    },[])
    return (
        <div>
            <Modal.Body>
                <h4 className="strong text-center">{props.roomno}</h4>
                <p className="font-big">
                    Customer Name : {props.username}
                </p>
                <p className="font-big">
                    Customer Phone Number : {props.phone}
                </p>
                <p className="font-big">
                    Check-In Date : {props.checkin}
                </p>
                <p className='font-big'>
                    Head Count of Adults : {props.adults}
                </p>
                <p className="font-big">
                    Head Count of childrens : {props.childrens}
                </p>
                <p className = "acknowledgement">
                    (Please verify all the above details before checking out a customer!)
                </p>
            </Modal.Body>
        </div>
    )
}

export default ModalCheckOut