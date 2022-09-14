import React, { useEffect, useState } from 'react';
import Modal from "react-bootstrap/Modal";
import axios from 'axios';

const ModalCheckOut = (props) => {

    const [stay, setStay] = useState();

    const current = new Date();
    const date = `${current.getFullYear()}/${current.getMonth()+1}/${current.getDate()}`;

    useEffect(() => {
        console.log(props.user);
        props.userid(props.user)
        const date1 = new Date(props.checkin);
        console.log(date1);
        const date2 = new Date(date);
        
        const diffTime = Math.abs(date2 - date1);
        console.log(diffTime);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        console.log(diffTime + " milliseconds");
        props.stayeddays(diffDays + " days");
        props.checkoutdate(date);
        setStay(diffDays + " days");
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
                    No.Of.Days Stay : {stay}
                </p>
                <p className="acknowledgement">
                    (Please verify all the above details before checking out a customer!)
                </p>
            </Modal.Body>
        </div>
    )
}

export default ModalCheckOut
