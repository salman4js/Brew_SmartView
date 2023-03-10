import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import PanelFooter from '../Panel/PanelFooter'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Dots from '../Loader/Dots';

const CheckinModal = (props) => {

    return (
        <div>
            <Modal.Body>
                <div className='modal-gap text-center'>
                    <label style={{ color: "black", fontWeight: "bold" }}> Select Room Options </label>
                    <select class="form-select" aria-label="Default select example" onChange={(e => props.roomno(e.target.value))}>
                        <option selected>Choose...</option>
                        {
                            props.roomdata.map((options, key) => {
                                return (
                                    <option>{options.roomno} - {options.suiteName} - {options.price}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <div className="modal-gap text-center">
                    {props.roomno}
                </div>
                {props.error === false && (
                    <div>
                        {props.node === "Check-In" && (
                            <div className='modal-gap'>
                                <label style={{ color: "black" }}> Date Of Check In </label>
                                <DatePicker style={{ color: "black" }} className="form-control" placeholderText='Checkin Date would go here...' selected={Date.now()} excludeDates={props.excludeDates} dateFormat='y-MM-dd' minDate={new Date()} isClearable />
                            </div>
                        )}
                        {props.node === "Prebook" && (
                            <div className='modal-gap'>
                                <label style={{ color: "black" }}> Date Of Check In </label>
                                <DatePicker style={{ color: "black" }} className="form-control" placeholderText='Checkin Date would go here...' selected={props.checkin} excludeDates={props.excludeDates} dateFormat='y-MM-dd' minDate={new Date()}onChange = {(e) => props.dateofcheckin(e)} isClearable />
                            </div>
                        )}
                        <div className='modal-gap'>
                            <label style={{ color: "black" }}> Date Of Check Out </label>
                            <DatePicker style={{ color: "black" }} className="form-control" placeholderText='Checkout Date would go here...'  excludeDates={props.excludeDates} selected={props.checkout} dateFormat='y-MM-dd' minDate={new Date()} onChange = {(e) => props.dateofcheckout(e)} isClearable />
                        </div>
                    </div>
                )}

                {/* Handle date error */}
                <Dots errortext={"Please choose a valid room number to check available dates!"} error={props.error} />

                <label style={{ color: "black" }}> Adults </label>

                <input className="form-control dashboard-input" placeholder="Adults" onChange={(e => props.adults(e.target.value))} />
                <label style={{ color: "black" }}> Childrens </label>

                <input className="form-control dashboard-input" placeholder="Childrens" onChange={(e => props.childrens(e.target.value))} />
                <label style={{ color: "black" }}> Discount </label>

                <input className="form-control dashboard-input" placeholder="Discount" onChange={(e => props.discount(e.target.value))} />
                <label style={{ color: "black" }}> Advance </label>

                <input className="form-control dashboard-input" placeholder="Advance" onChange={(e => props.advance(e.target.value))} />
            </Modal.Body>
            
            <PanelFooter failure = {"Close"} success = {"Book and Close"} onFailure = {() => props.handleClose(props.data, props.node)} onSuccess = {() => props.handleCheckIn(props.data, props.node)} />
        </div>
    )
}

export default CheckinModal;