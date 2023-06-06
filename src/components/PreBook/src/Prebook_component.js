import React, { useState, useEffect } from 'react';
import retrieveDate from '../../PreBook_Date_Spike/DateCorrector';
import axios from "axios";
import brewDate from 'brew-date';
import Modal from "react-bootstrap/Modal";
import Variables from '../../Variables';
import Button from "react-bootstrap/Button";
import { handleTimeFormat, compareTime, convert12to24, getTimeDate } from '../../common.functions/common.functions.js';


const Prebook_component = (props) => {

  // Current Date
  const date = brewDate.getFullDate("yyyy/mm/dd");
  var time = brewDate.getTime(); // Time in 24 hour format for easy comparison!
  
  // Time to handle channel manager, edit room price, and mismatching time booking price!
  const timeDate = getTimeDate();
  const getTime = timeDate.getTime;

  // More Details
  const [show, setShow] = useState(false);
  
  // State handler for checkin time decider!
  const [checkinTime, setCheckinTime] = useState({
    expCheckinTime: undefined,
    changeCheckinTime: _changeCheckinTime
  });
  
  // Get buttons className!
  function getButtonClassName(){
    if(checkinTime.expCheckinTime){
      return "btn btn-primary";
    } else if(checkinTime.expCheckinTime === undefined){
      return "btn btn-info";
    } else {
      return "btn btn-secondary"
    }
  }
  
  // Function to select checkin time!
  function _changeCheckinTime(value){
    setCheckinTime(prevState => ({...prevState, expCheckinTime: value}))
  }

  // Handle More Details Modal
  const handleClose = () => {
    setShow(!show);
  }

  // Toast Messages
  const [success, setSuccess] = useState();
  const [showerror, setShowerror] = useState(false);

  // handling Toast Messages
  const handleCloseModal = () => {
    setShowerror(!showerror)
  }

  // Loader -- Modal
  const [loading, setLoading] = useState(false);

  // Delete prebook alert modal
  const [showDeletePrebookModal, setShowDeletePrebookModal] = useState(false);
  const deletePrebookModal = () => {
    setShowDeletePrebookModal(!showDeletePrebookModal);
  }

  // handle check-in modal
  const [checkinModal, setCheckinModal] = useState(false);
  const handleCheckinModal = () => {
    setCheckinModal(!checkinModal);
  }
  
  // Get the time in comparable format
  function loadTime(){
    try{
      const checkinTime = convert12to24(props.checkinTime);
      const currentTime = time.split(":")
      const checkin = checkinTime.split(":");
      const checkinResult = formDate(checkin);
      const currentResult = formDate(currentTime);
      return {checkinTime: checkinResult.getTime(), currentTime: currentResult.getTime()};
    } catch(err){
        console.log("Earlier release we dont have checkin time!")
    }
  }
  
  // Do time check!
  function timeCheck(){
    const loadedTime = loadTime();
    return loadedTime.currentTime >= loadedTime.checkinTime;
  }
  
  // Form the date!
  function formDate(date){
    const newDate = new Date();
    newDate.setHours(date[0]);
    newDate.setMinutes(date[1]);
    return newDate;
  }
  
  // Check for expected and actual checkin time button disabled!
  function isButtonDisabled(){
    if(checkinTime.expCheckinTime !== undefined && checkinTime.expCheckinTime === true){
      return true;
    } else {
      return false;
    }
  }
  
  // Function to get the checkin time incase of late entry!
  function getCheckinTime(){
    if(checkinTime.expCheckinTime !== undefined && checkinTime.expCheckinTime === true){
      return props.checkinTime;
    } else {
      return getTime;
    }
  }

  // Check-In to the model
  const processData = () => {

    setLoading(true);
    // Validating current date before booking
    if((date == props.dateofcheckin) === false){
      setLoading(false);
      setShowerror(true);
      handleCheckinModal();
      setSuccess("You can't checkin with mismatching booking dates!");
    } else if(!timeCheck()) {
      setLoading(false);
      setShowerror(true);
      handleCheckinModal();
      setSuccess("You can't checkin with mismatching booking time!");
    } else {
      const credentials = {
        customername: props.customername,
        phonenumber: props.phonenumber,
        secondphonenumber: props.secphonenumber,
        adults: props.adults,
        childrens: props.childrens,
        aadhar: props.aadhar,
        checkin: props.dateofcheckin,
        expCheckinTime: props.checkinTime,
        checkinTime: getCheckinTime(),
        actualCheckinTime: getTime,
        checkoutTime: props.checkoutTime,
        checkout : props.dateofcheckout,
        roomid: props.roomid,
        roomno: props.roomno,
        prebookprice : props.prebookprice,
        prebook : true,
        discount: props.discount, // Sending duplicate data to the server to prevent including more schema values
        advance: props.advance, // Sending duplicate data to the server to prevent including more schema values
        advancePrebookPrice : props.advance,
        advanceDiscount: props.discount,
        channel: props.channel
      }
      axios.post(`${Variables.hostId}/${props.lodgeid}/adduserrooms`, credentials)
        .then(res => {
          if (res.data.success) {
            setLoading(false);
            handleCheckinModal();
            handleClose();
            setShowerror(true);
            setSuccess(res.data.message);
            deletePrebook();
            // props.setLoad(!props.setLoad);
          } else {
            setLoading(false);
            setShowerror(true);
            setSuccess(res.data.message)
          }
        })
    }
  }

  // Delete prebook order
  const deletePrebook = () => {
    const credentials = {
      prebookUserId: props.prebookuser
    }
    axios.post(`${Variables.hostId}/${props.lodgeid}/deleteprebookuserrooms`, credentials)
      .then(res => {
        if (res.data.success) {
          handleClose();
          deletePrebookModal();
          props.setLoad(true);
        } else {
          console.log("Some internal error occured!");
        }
      })
  }

  return (
    <div class="col-4" style={{ paddingBottom: "10vh" }}>
      <div class="card text-center">
        <div class="card-header" style={{ color: "black" }}>
          <strong>Room No: {props.roomno}</strong>
        </div>
        <div class="card-body">
          <p style={{ color: "black" }}>Customer Name: {props.customername}</p>
          <p style={{ color: "black" }}>Phone Number: {props.phonenumber}  </p>
          <p style={{ color: "black" }}>Date of checkin: {props.dateofcheckin}</p>
          <p style={{ color: "black" }}>ID Number: {props.aadhar}</p>
        </div>
        <div className="btn btn-success" onClick={handleClose}>
          More Details
        </div>
      </div>
      {/* Delete Prebook Modal Alert */}
      <Modal
        show={showDeletePrebookModal}
        onHide={deletePrebookModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center">Delete Entry!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this entry?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={deletePrebookModal}>
            No, Cancel
          </Button>
          <Button variant="success" onClick={deletePrebook}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* handle checkin modal */}
      <Modal
        show={checkinModal}
        onHide={handleCheckinModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center">Confirm Check-In</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to checkin this entry?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCheckinModal}>
            No, Cancel
          </Button>
          <Button variant="success" onClick={processData}>
            Yes, CheckIn
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Data component */}
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center">More Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container text-center">

            <p className = "heading-title">
                Pre Book Price : {props.prebookprice}
            </p>
            {timeCheck() && (
              <div>
                <p className = "heading-title info-message">
                    Guest arrived late, Which time do you want to choose as their arrival time?
                </p>
                <p className = "heading-title">
                    <span>
                      <button className = "btn btn-info" disabled = {checkinTime.expCheckinTime !== undefined ? isButtonDisabled() : false} onClick = {() => _changeCheckinTime(true) }>
                        Take Expected Check In
                      </button>
                      <button className = "btn btn-info" style = {{marginLeft: '10px'}} disabled = {checkinTime.expCheckinTime !== undefined ? !isButtonDisabled() : false} onClick = {() => _changeCheckinTime(false) }>
                        Take Actual Check In
                      </button>
                    </span>
                </p>
              </div>
            )}
            <p className="heading-title">
              Customer Name: {props.customername}
            </p>
            <p className="heading-title">
              Phone Number: {props.phonenumber}
            </p>
            <p className="heading-title">
              Second Number: {props.secphonenumber}
            </p>
            <p className="heading-title">
              Date of Check-In: {props.dateofcheckin}
            </p>
            <p className="heading-title">
              Time of Check-In: {props.checkinTime}
            </p>
            <p className="heading-title">
              Date of check-out: {props.dateofcheckout}
            </p>
            <p className="heading-title">
              Time of check-out: {props.checkoutTime}
            </p>
            <p className="heading-title">
              Advance Paid: {props.advance}
            </p>
            <p className="heading-title">
              Discount Amount : {props.discount}
            </p>
            <p className="heading-title">
              Adults Count: {props.adults}
            </p>
            <p className="heading-title">
              Childrens Count: {props.childrens}
            </p>
            <p className="heading-title">
              ID Number: {props.aadhar}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={deletePrebookModal}>
            Cancel Pre Booking
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="success" onClick={handleCheckinModal}>
            Check-In
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Loader -- Modal */}
      <Modal
        show={loading}
        backdrop="static"
      >
        <Modal.Body>
          Updating, please wait!
        </Modal.Body>
      </Modal>

      {/* Server Response */}
      <div>
        {
          success == undefined ? (
            <div>
            </div>
          ) : (
            <Modal
              show={showerror}
              onHide={handleCloseModal}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton>
                <Modal.Body className="text-center">
                  {success}
                </Modal.Body>
              </Modal.Header>
            </Modal>
          )
        }
      </div>
    </div>
  )
}

export default Prebook_component;