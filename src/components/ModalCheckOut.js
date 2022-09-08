import React, { useEffect } from 'react';
import Modal from "react-bootstrap/Modal";
import axios from 'axios';

const ModalCheckOut = (props) => {

    const current = new Date();
    const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;

    useEffect(() => {
        const date1 = new Date(props.checkin);
        const date2 = new Date(date);
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        console.log(diffTime + " milliseconds");
        console.log(diffDays + " days");
    }, [])
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
                <p className='font-big'>
                    Check-Out Date : {date}
                </p>
                <p className='font-big'>
                    No.Of.Days Stay :
                </p>
                <p className="acknowledgement">
                    (Please verify all the above details before checking out a customer!)
                </p>
            </Modal.Body>
        </div>
    )
}

export default ModalCheckOut