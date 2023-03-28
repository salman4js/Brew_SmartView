import React, { useEffect, useState } from 'react';
import Modal from "react-bootstrap/Modal";
import brewDate from 'brew-date';
import { getStorage } from '../Controller/Storage/Storage';

const ModalCheckOut = (props) => {

    const [stay, setStay] = useState();
    const date = brewDate.getFullDate("yyyy/mm/dd");

    useEffect(() => {

        const isHourly = JSON.parse(getStorage("isHourly"));

        if(isHourly){
             // Hourly calculation!
            const checkinDateTime = props.checkin +  " " +props.checkInTime;
            const checkoutDateTime = date + " " + props.currentTime;
            const difference = brewDate.diffHours(checkinDateTime, checkoutDateTime);
            props.checkoutdate(date);
            props.userid(props.user)
            setStay(difference);
            props.stayeddays(difference);
        } else {
            // Assigning today's date as checkout date back to the component!
            props.checkoutdate(date);
            props.userid(props.user)
            const date1 = new Date(props.checkin);
            const date2 = new Date(date);
            
            const diffTime = Math.abs(date2 - date1);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            if(diffDays == 0) {
                props.stayeddays(diffDays+1 + " Days");
                setStay(diffDays+1 + " Days");
            } else {
                    props.stayeddays(diffDays + " days");
                    props.checkoutdate(date);
                    setStay(diffDays + " Days");
            }
        }
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
                <p className = "font-big">
                    Second Number : {props.secondphonenumber}
                </p>
                <p className = "font-big">
                    Aadhar Number : {props.aadharcard}
                </p>
                <p className="font-big">
                    Check-In Date : {props.checkin}
                </p>
                <p className = "font-big">
                    Check-In Time : {props.checkInTime}
                </p>
                <p className='font-big'>
                    Check-Out Date : {date}
                </p>
                <p className = "font-big">
                    Check-Out Time : {props.currentTime}
                </p>
                <p className='font-big'>
                    Head Count of Adults : {props.adults}
                </p>
                <p className="font-big">
                    Head Count of childrens : {props.childrens}
                </p>
                <p className='font-big'>
                    No.Of.Days Stay : {stay}
                </p>
                {
                    props.discount ? (
                        <p className='font-big'>
                            Discount Applied: True
                        </p>
                    ) : (
                        <p className='font-big'>
                            Discount Applied:  False
                        </p>
                    )
                }
                {
                    props.tempData == undefined ? (
                        <p className="acknowledgement">
                            (Customer hasn't provided any checkout information, Hence taking today's date as checkout date!)
                        </p>
                    ) : (
                        <p className="acknowledgement">
                            {
                                date == props.tempData ? (
                                    <p>
                                        Provided checkout date is matching with today's date, Customer is good to checkout!
                                    </p>
                                ) : (
                                    <div>
                                        <p className = "acknowledgement error-text">
                                            Provided checkout date({props.tempData}) is not matching with the today's date({date})!
                                        </p>
                                    </div>
                                )
                            }
                        </p>
                    )
                }
                <p className="acknowledgement">
                    (Please verify all the above details before checking out a customer!)
                </p>
            </Modal.Body>
        </div>
    )
}

export default ModalCheckOut
