import React, { useState, useEffect } from 'react';
import retrieveDate from '../../PreBook_Date_Spike/DateCorrector';
import axios from "axios";
import brewDate from 'brew-date';
import Modal from "react-bootstrap/Modal";
import Variables from '../../Variables';
import Button from "react-bootstrap/Button";



const Prebook_component = (props) => {

  // Current Date
  const date = brewDate.getFullDate("yyyy/mm/dd");

  // More Details
  const [show, setShow] = useState(false);

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


  // Check-In to the model
  const processData = () => {
    setLoading(true);
    console.log(props.dateofcheckin);
    console.log(date);
    // Validating current date before booking
    if((date == props.dateofcheckin) === false){
      setLoading(false);
      setShowerror(true);
      handleCheckinModal();
      setSuccess("You can't checkin with mismatching booking dates!");
    } else {
      const credentials = {
        customername: props.customername,
        phonenumber: props.phonenumber,
        secondphonenumber: props.secphonenumber,
        adults: props.adults,
        childrens: props.childrens,
        aadhar: props.aadhar,
        checkin: props.dateofcheckin,
        checkout : props.dateofcheckout,
        roomid: props.roomid,
        roomno: props.roomno,
        prebookprice : props.prebookprice,
        prebook : true
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
          console.log("Prebook user data deleted");
          handleClose();
          deletePrebookModal();
          props.setLoad(true);
        } else {
          console.log("Some internal error occured!")
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
          <p style={{ color: "black" }}>Aadhar Number: {props.aadhar}</p>
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
              Date of check-out: {props.dateofcheckout}
            </p>
            <p className="heading-title">
              Advance Paid: {props.advance}
            </p>
            <p className="heading-title">
              Adults Count: {props.adults}
            </p>
            <p className="heading-title">
              Childrens Count: {props.childrens}
            </p>
            <p className="heading-title">
              Aadhar Number: {props.aadhar}
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