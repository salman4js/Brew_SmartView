import React, { useState, useEffect, useRef } from 'react';
import retrieveDate from '../../PreBook_Date_Spike/DateCorrector';
import EditPrebookRoomItem from '../../edit.room.view/edit.prebook.room.view/edit.prebook.room.item.view';
import { addRefundTracker } from './prebook.components.utils/prebook.components.utils';
import CustomModal from '../../CustomModal/custom.modal.view';
import GuestRegistration from '../../GRC/grc.view';
import axios from "axios";
import brewDate from 'brew-date';
import Modal from "react-bootstrap/Modal";
import Variables from '../../Variables';
import Button from "react-bootstrap/Button";
import {universalLang} from '../../universalLang/universalLang';
import {getStorage, setStorage} from '../../../Controller/Storage/Storage';
import { handleTimeFormat, compareTime, convert12to24, getTimeDate, refreshPage } from '../../common.functions/common.functions.js';


const Prebook_component = (props) => {
  
  // Video reference1
  const videoRef = useRef(null);
  
  // Video stream state handler!
  const [stream, setStream] = useState(null);
  
  // Current Date
  const date = brewDate.getFullDate("yyyy/mm/dd");
  var time = brewDate.getTime(); // Time in 24 hour format for easy comparison!
    
  // Time to handle channel manager, edit room price, and mismatching time booking price!
  const timeDate = getTimeDate();
  const getTime = timeDate.getTime;

  
  // Is grc enabled!
  var isGrcPreview = JSON.parse(getStorage('isGrcPreview'));
  
  // Custom modal state handler!
  const [customModal, setCustomModal] = useState({
    show: false,
    onHide: onHideCustomModal,
    header: undefined,
    bodyMessage: undefined,
    refundableAmount: undefined,
    centered: true,
    modalSize: 'medium',
    footerEnabled: true,
    footerButtons: [
      {
        btnId: "Refund Amount",
        disabled: false,
        variant: "success",
        onClick: onRefund
      },
      {
        btnId: "Cancel",
        disabled: false,
        variant: "secondary",
        onClick: onHideCustomModal
      }
    ]
  })

  // On show custom modal!
  async function _showCustomModal(message, refundableAmount){
    setStorage("refundable-amount", refundableAmount);
    await setCustomModal(prevState => ({...prevState, show: true, bodyMessage: message, header: "Refund Alert", refundableAmount: refundableAmount}))
  }
  
  // On hide custom modal!
  function onHideCustomModal(){
    setCustomModal(prevState => ({...prevState, show: false}))
  }
  
  // Custom modal child view!
  function customModalBodyItem(){
    return(
      <>
        <p>
          {customModal.bodyMessage}
        </p>
        <p>
          Refundable Amount: {customModal.refundableAmount} Rs
        </p>
      </>
    )
  }

  // On save custom modal!
  async function onRefund(){
    const data = {
      lodge: props.lodgeid,
      date: brewDate.getFullDate("dd/mm/yyyy"),
      refundFor: "Prebook cancelled, advance amount refund",
      roomno: props.roomno,
      roomId: props.roomid,
      username: props.customername,
      userId: props.prebookuser,
      refundAmount: getStorage("refundable-amount")
    }
    const result = await addRefundTracker(data);
    if(result.data.success){
      deletePrebook(); // When refund tracker updated, delete the prebook entry!
    }
  }
  
  // State handler for GRC preview!
  const [grcPreview, setGrcPreview] = useState({
    show: false,
    header: "Guest Registration Card Preview",
    centered: true,
    modalSize: "lg",
    footerEnabled: true,
    downloadTriggered: false,
    footerButtons: [
      {
        btnId: "Download",
        variant: "success",
        onClick: downloadGrcPreview
      },
      {
        btnId: "Cancel",
        variant: "secondary",
        onClick: cancelGrcPreview
      }
    ]
  })
  
  // Cancel the grc preview process!
  function cancelGrcPreview(){
    setGrcPreview(prevState => ({...prevState, show: false}));
    stopWebcam();
  }
  
  // Download Grc preview!
  function downloadGrcPreview(){
    setGrcPreview(prevState => ({...prevState, downloadTriggered: true}));
    deletePrebook();
  };
  
  // Trigger grc view!
  function toggleGrcView(value){
    setGrcPreview(prevState => ({...prevState, show: value}))
  }
  
  // Get prebook data for edit and GRC!
  function getPrebookData(){
    const prebookData = {
        customername: props.customername,
        phonenumber: props.phonenumber,
        roomno: props.roomno,
        dateofcheckin: props.dateofcheckin,
        dateofcheckout: props.dateofcheckout,
        checkinTime: props.checkinTime,
        checkoutTime: props.checkoutTime,
        adults: props.adults,
        childrens: props.childrens,
        discount: props.discount,
        aadharcard: props.aadhar,
        prebookId: props.prebookuser,
        lodgeId: props.lodgeid,
        roomno: props.roomno,
        roomid: props.roomid
    }
    
    return prebookData;
  }

  // Show GRC view!
  function _showGrcView(){
    // Form the data required for the GRC!
    const grcData = getPrebookData();
    return(
      <GuestRegistration data = {grcData} modalData = {grcPreview} />
    )
  }

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
  
  // Custom Modal on hide!
  function isCustomModalDestroyed(){
    return !editDetails.isEditMode;
  }
  
  // Trigger custom modal!
  function _triggerCustomModal(){
    _triggerEditMode(false)
  }
  
  // Custom Modal view child registration!
  function _showPrebookEditView(){
    
    // Form neccessary data from the prebook details
    const prebookData = getPrebookData()
    
    // Check for pending amount in advance!
    if(pending.isPending){
      prebookData['advance'] = props.advance;
      prebookData['advancePending'] = pending.pendingAmount
    }
    
    return(
      <div>
        <EditPrebookRoomItem data = {prebookData} show = {editDetails.isEditMode} onHide = {() => _triggerEditMode(false)} onReload = {() => updateItemView(true)}  />
      </div>
    )
  }
  
  // Update the item view from the parents component!
  function updateItemView(value){
    props.setLoad(value);
  }

  // Pending amount state handler!
  const [pending, setPending] = useState({
    isPending: false,
    pendingAmount: undefined,
    label: "Pending Amount",
    placeholder: `Remaining amount has to be paid: `,
    value: undefined
  })
  
  // Edit details state handler!
  const [editDetails, setEditDetails] = useState({
    isEditMode: false
  })
  
  // trigger edit mode and vice versa!
  function _triggerEditMode(value){
    setEditDetails(prevState => ({...prevState, isEditMode: value}))
  }
  
  // Update pending amount state!
  function updatePendingState(state, value){
    setPending(prevState => ({...prevState, isPending: state, pendingAmount: value}));
  }
  
  // pending amount needs to be paid!
  function pendingAmount(){
    const pendingAmount = props.prebookprice - props.advance;
    if(pendingAmount > 0){
      updatePendingState(true, pendingAmount);
    }
  }
  
  // Function to select checkin time!
  function _changeCheckinTime(value){
    setCheckinTime(prevState => ({...prevState, expCheckinTime: value}))
  }

  // Handle More Details Modal
  const handleClose = () => {
    setStorage("refundable-amount", 0); // Set the default value as 0, 
    // Everytime the preview modal appears!
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
        advanceDiscount: props.discount,
        channel: props.channel,
        userId: props.prebookuser,
        dateTime: brewDate.getFullDate("dd/mmm") + " " + brewDate.getTime()
      }
      axios.post(`${Variables.hostId}/${props.lodgeid}/adduserrooms`, credentials)
        .then(res => {
          if (res.data.success) {
            setLoading(false);
            handleCheckinModal();
            handleClose();
            setShowerror(true);
            setSuccess(res.data.message);
            if(isGrcPreview){ // Call the grc preview only if its enabled!
              toggleGrcView(true);
            } else {
              deletePrebook();
            }
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
    setLoading(true);
    const credentials = {
      prebookUserId: props.prebookuser
    }
    axios.post(`${Variables.hostId}/${props.lodgeid}/deleteprebookuserrooms`, credentials)
      .then(res => {
        if (res.data.success) {
          setLoading(false);
          deletePrebookModal();
          props.setLoad(true);
        } else {
          setLoading(false);
          deletePrebookModal();
          handleClose();
          _showCustomModal(res.data.message, res.data.refundAmount)
        }
      })
  }
  
  // Check for the camera access and turn on the camera accordingly!
  function checkCameraAccess(){
    if(show){
      if(isGrcPreview){
        accessMedia()
      }
    } else {
      stopWebcam();
    }
  }
  
  // Access the user media devices!
  function accessMedia(){
    navigator.mediaDevices.getUserMedia({
      video: true
    })
    .then((value) => {
      setStream(value) // Camear object stream!
      let video = videoRef.current;
      video.srcObject = value;
      video.play()
    })
    .catch((err) => {
      console.warn("Error occured, while accessing camera!")
    })
  }
  
  // Stop the web camera access!
  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };
  
  // Take picture!
  function takePicture(){
    let video = videoRef.current;
    let canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    let context = canvas.getContext('2d');
    
    // Draw the current video frame on the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert the canvas content to a data URL representing a PNG image
    let dataURL = canvas.toDataURL('image/png');

    // Save the image data to local storage
    setStorage("userMedia", dataURL); 
    stopWebcam()
  }
  
  // On render function!
  useEffect(() => {
    pendingAmount()
  }, [])
  
  // Call the access media function only when the grc preview state changes!
  useEffect(() => {
    checkCameraAccess();
  }, [show])
  

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
          <div className="container text-center checkin-modal">

            <p className = "heading-title">
                Pre Book Price : {props.prebookprice}
            </p>
            {isGrcPreview && (
              <div className = "modal-gap">
                <video className = "container" ref = {videoRef}> </video>
                <button className = "btn btn-info" onClick = {() => takePicture()}> Take Photo </button>
              </div>
            )}
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
          <Button variant="info" onClick={() => _triggerEditMode(true)}>
            Edit details
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
      
      {/* Edit Prebook Customer Details */}
      {editDetails.isEditMode && (
        _showPrebookEditView()
      )}
      
      {/* GRC preview */}
      {grcPreview.show && (
        _showGrcView()
      )}

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
      
      {customModal.show && (
        <CustomModal modalData = {customModal} showBodyItemView = {() => customModalBodyItem()} />
      )}
      
    </div>
  )
}

export default Prebook_component;