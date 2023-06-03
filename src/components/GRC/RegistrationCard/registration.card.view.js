import React, {useRef, useEffect} from 'react';
import { getStorage } from "../../../Controller/Storage/Storage";


const RegistrationCard = (props) => {
  
  // Reference for the user media photo!
  const photoRef = useRef(null);
  
  // Get hotel data from the storage
  const hotelData = {
    area: getStorage('area'),
    emailId: getStorage('emailId'),
    ownnerNumber: getStorage('owner-number'),
    lodgeName: props.data.lodgeName,
    userMedia: getStorage('userMedia')
  }
  
  // Function to render the guest details!
  function guestDetails(){
    return(
      <div className = "left-align">
        <div>
            Guest Name: {props.data.customername}
        </div>
        <div>
            Phone Number: {props.data.phonenumber}
        </div>
        <div>
            Nationality: Indian
        </div>
        <div>
          PAX (A - C) : A{props.data.adults}, C{props.data.childrens}
        </div>
      </div>
    )
  }
  
  // Function to render the room details1
  function roomDetails(){
    return(
      <div className = "right-align">
        <div>
            Room No: {props.data.roomno}
        </div>
        <div>
            Room Type: {props.data.roomtype}
        </div>
        <div>
            Checkin Date & Time: {props.data.checkin}, {props.data.checkinTime}
        </div>
        <div>
          Exp. Checkout Date & Time: {props.data.checkout}, {props.data.checkoutTime}
        </div>
      </div>
    )
  }
  
  // Function to render guest registration questions!
  function guestQuestions(){
    return(
      <div className = "left-align">
        {props.reqQuestions.guestQuestions.map((options, key) => {
          return(
            <div style = {{width: '100%'}}>
              <div>
                {options}:
              </div>
              <div className = "table-view-bill-line"></div>
            </div>
          )
        })}
      </div>
    )
  }
  
  // function to render hotel registration questions!
  function hotelQuestions() {
    return (
      <div className="hotel-question-guest-registration-card" style={{ marginTop: '20px', marginBottom: '20px' }}>
        {props.reqQuestions.hotelQuestions.map((option, index) => (
          <div class="form-check" key={index}>
            <input class="form-check-input" type="checkbox" value="" id={`flexCheckDefault${index}`} />
            <label class="form-check-label dashboard-input" for={`flexCheckDefault${index}`} style={{ color: "black" }}>
              {option}
            </label>
          </div>
        ))}
      </div>
    );
  }
  
  
  return(
    <div className = "grc-container">
      <div className = "text-center">
        {hotelData.lodgeName}
        <p>
          {hotelData.emailId}, {hotelData.ownnerNumber} 
        </p>
        <p>
          {hotelData.area}
        </p>
      </div>
      <div className=" text-center" style={{ fontWeight: "bold" }}>
          GUEST REGISTRATION CARD
      </div>
      <div className="row grc-table-view">
          <div className="col surround-border">
              {guestDetails()}
          </div>
          <div className="col surround-border">
              {roomDetails()}
          </div>
      </div>
      <div className = "row">
        <div className = "col surround-border">
          {guestQuestions()}
        </div>
        <div className = "col surround-border">
          {hotelQuestions()}
        </div>
        <div className = "col surround-border">
          <img width = {220} height = {145} src = {getStorage('userMedia')}>
          </img>
        </div>
      </div>
      <div className = "text-center">
          <div className = "authorized-sign">
              <div className = "text-center invoice-total">
                  <div className = "invoice-total">
                      Guest Signature
                  </div>
              </div>
          </div>
      </div>
  </div>
  )
}

export default RegistrationCard;