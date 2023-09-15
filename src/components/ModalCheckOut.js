import React, { useEffect, useState } from 'react';
import Modal from "react-bootstrap/Modal";
import InlineToast from './InlineToast/Inline.toast.view';
import brewDate from 'brew-date';
import { getStorage } from '../Controller/Storage/Storage';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ModalCheckOut = (props) => {

    const [stay, setStay] = useState();
    const date = brewDate.getFullDate("yyyy/mm/dd");
    
    // Configurations!
    var isExtra = JSON.parse(getStorage("isExtra"));
    var isCheckinDateEditable = JSON.parse(getStorage('isCheckinDateEditable'));
        
    // Ensure Channel enabled or not!
    function ensureChannel(){
        return props.isChannel === "Walk-In" ? false : true
    }
    
    // Get remainingAmount to be paid by the customer for edit customer details!
    function getRemainingAmount(){
      var advance = props.advance !== undefined ? props.advance : 0;
      return props.getTotalAmountWithGST() - advance;
    }
    
    // Edit details state handler!
    const [editDetails, setEditDetails] = useState({
        isEdit: props.edit,
        username: props.username,
        phonenumber: props.phone,
        secondphonenumber: props.secondphonenumber,
        advance: props.advance,
        isAdvanceAttrChanges: false,
        prevAdvance: props.advance,
        aadharcard: props.aadharcard,
        adults: props.adults,
        childrens: props.childrens,
        dateofcheckin: props.tempData === undefined ? null : new Date(props.tempData),
        dateofcheckout: props.tempData === undefined ? null : new Date(props.tempData),
        userId: props.user,
        timeofcheckin: props.checkInTime
    });

    // Update the state to be updated in the parent component!
    props.updateDetails(editDetails);

    useEffect(() => {

        const isHourly = JSON.parse(getStorage("isHourly"));

        // Send out back the channel configuration!
        props.setChannel(ensureChannel(), props.isChannel);

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
            {!props.isEdit ? (
                <div>
                    <Modal.Body className = "checkin-modal">
                        <div>
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
                              ID Number : {props.aadharcard}
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
                          {isExtra && (
                              <div>
                                  <p className="font-big">
                                      Extra Bed: {props.extraBeds}
                                  </p>
                                  <p className="font-big">
                                      Extra Bed Price Per Bed: {props.extraBedPrice}
                                  </p>
                              </div>
                          )}
                          <p className='font-big'>
                              No.Of. {stay !== undefined && stay.split(" ")[1] } stay : {stay}
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
                        </div>
                    </Modal.Body>
                </div>
            ) : (
                    <div className='container text-center heading-top' style = {{marginTop: "20px"}}>
                        <div className="modal-gap">
                            <label style={{ color: "black" }}> Customer Name </label>
                            <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Customer Name" name = {editDetails.username} value = {editDetails.username} 
                            onChange = {(e) => setEditDetails(prevState => ({...prevState, username: e.target.value}))} />
                        </div>
                        <div className="modal-gap">
                            <label style={{ color: "black" }}> Phone Number </label>
                            <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Phone Number" name = {editDetails.phonenumber} value = {editDetails.phonenumber} 
                            onChange={(e) => setEditDetails(prevState => ({...prevState, phonenumber: e.target.value }))} />
                        </div>
                        <div className="modal-gap">
                            <label style={{ color: "black" }}> Second Phone Number </label>
                            <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Second Phone Number" name = {editDetails.secondphonenumber} value = {editDetails.secondphonenumber} 
                            onChange = {(e) => setEditDetails(prevState => ({...prevState, secondphonenumber: e.target.value}))} />
                        </div>
                        <div className="modal-gap">
                            <label style={{ color: "black" }}> Payment (Given amount) </label>
                            <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter payments made by customer" name = {editDetails.advance} value = {editDetails.advance} 
                            onChange = {(e) => setEditDetails(prevState => ({...prevState, advance: e.target.value, isAdvanceAttrChanges: true}))} />
                            <InlineToast message = {`Remaining amount to be paid by this customer ${getRemainingAmount()}`} />
                        </div>
                        <div className="modal-gap">
                            <label style={{ color: "black" }}> Adults </label>
                            <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Adults" name = {editDetails.adults} value = {editDetails.adults} 
                            onChange = {(e) => setEditDetails(prevState => ({...prevState, adults: e.target.value}))} />
                        </div>
                        <div className="modal-gap">
                            <label style={{ color: "black" }}> Childrens </label>
                            <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Childrens" name = {editDetails.childrens} value = {editDetails.childrens} 
                            onChange = {(e) => setEditDetails(prevState => ({...prevState, childrens: e.target.value}))} />
                        </div>
                        <div className="modal-gap">
                            <label style={{ color: "black" }}> ID Number </label>
                            <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="ID Number" name = {editDetails.aadharcard} value = {editDetails.aadharcard} 
                            onChange={(e) => setEditDetails(prevState => ({...prevState, aadharcard: e.target.value}))} />
                        </div>
                        {isCheckinDateEditable && (
                          <div className="modal-gap">
                              <label style={{ color: "black" }}> Date of Checkin </label>
                              <DatePicker style={{ color: "black" }} className="form-control" placeholderText='Date of checkout' selected = {editDetails.dateofcheckin} dateFormat='y-MM-dd'
                              onChange = {(e) => setEditDetails(prevState => ({...prevState, dateofcheckin: e}))} isClearable />
                          </div>
                        )}
                        <div className="modal-gap">
                            <label style={{ color: "black" }}> Date of Checkout </label>
                            <DatePicker style={{ color: "black" }} className="form-control" placeholderText='Date of checkout' selected = {editDetails.dateofcheckout} dateFormat='y-MM-dd' minDate={new Date()} 
                            excludeDates = {props.excludeDates} onChange = {(e) => setEditDetails(prevState => ({...prevState, dateofcheckout: e}))} isClearable />
                        </div>
                    </div>
            )}
        </div>
    )
}

export default ModalCheckOut
