import React, { useEffect, useState, memo } from 'react';
import Alert from "react-bootstrap/Alert"
import Variables from './Variables';
import Button from "react-bootstrap/Button";
import axios from "axios";


const Notify = (props) => {


    const sendDelivered = () => {
        const credentials = {
            userdishId: props.userdishid
        }
        console.log(props.userdishid);
        console.log(props.id);
        axios.post(`${Variables.hostId}/${props.id}/senddelivered`, credentials)
            .then(res => {
                console.log(res.data.message);
                props.setReboot(!props.setReboot);
            })
    }

    return (
        <div className='container text-center'>
            <Alert variant="info">
                <p className = "alert-heading"> {props.roomno}</p>
                <hr />
                <p className='strong'>
                    Dish Name :  {props.dishname}
                </p>
                <p className='strong'>
                    Quantity : {props.quantity}
                </p>
                <p className='strong'>
                    Comments : {props.comments}
                </p>
                <hr />
                {
                    props.delivered == "Yes" ? (
                        <div>

                        </div>
                    ) : (
                        <div className="d-flex justify-content-end">
                            <Button variant="outline-success" onClick={sendDelivered}>
                                Delivered!
                            </Button>
                        </div>
                    )
                }
            </Alert>
        </div>
    )
}

export default memo(Notify);