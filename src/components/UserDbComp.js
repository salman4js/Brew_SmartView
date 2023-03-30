import React, { useState } from 'react';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const UserDbComp = (props) => {

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(!show);
  }

  // Handle checkin time format!
  function handleTimeFormat(time){
    try{
      const [hour, minutes] = time.split(":");
      var min = minutes.length > 1 ? minutes : "0" + minutes;
      if(hour > 12){
        const time = hour - 12 + ":" + min + " PM";
        return time;
      } else if(hour == 0) {
        const time = 12 + ":" + min + " AM";
        return time
      } else {
        const time = hour + ":" + min + " AM";
        return time;
      }
    } catch(err){
      console.error("Time format has been introduced in recent builds")
    }
  }

  return (
    <div class="col-4" style={{ paddingBottom: "10vh" }}>
      <div class="card">
        <div class="card-header text-center" style={{ color: "black", fontWeight: "bold" }}>
        </div>
        <Modal
          show={show}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Detailed Collections
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className='text-center'>
            <h4>{props.roomno}</h4>
            <p className="font-big">
              Customer Name -- {props.username}
            </p>
            <p className="font-big">
              Contact Details -- {props.phonenumber}
            </p>
            <p className="font-big">
              Alternative Contact Details -- {props.secphone}
            </p>
              {
                props.prebooked ==  true ? (
                  <p className="font-big">
                    PreBooked -- Yes
                  </p>
                ) : (
                  <p className="font-big">
                    PreBooked -- No
                  </p>
                )
              }
            <p className="font-big">
              Adults -- {props.adults}
            </p>
            <p className="font-big">
              Childrens -- {props.childrens}
            </p>
            <p className="font-big">
              Aadhar Number -- {props.aadharcard}
            </p>
            <p className="font-big">
              Checked In Days -- {props.stayeddays}
            </p>
            <p className="font-big">
              Checked In  -- {props.checkin} / {handleTimeFormat(props.checkinTime)}
            </p>
            <p className="font-big">
              Checked Out -- {props.checkout} / {handleTimeFormat(props.checkoutTime)}
            </p>
            {
              props.discount ===  undefined || props.discount === null ? (
                <p className="font-big">
                  Discount Applied - False
                </p>
              ) : (
                <div>
                  <p className="font-big">
                    Discount Applied - True
                  </p>
                  <p className="font-big">
                    Discount Amount - {props.discount === "" ? 0 : props.discount}
                  </p>
                </div>
              )
            }
            {
             props.advance === undefined || props.advance === null ? (
              <p className="font-big">
                Advance Applied - False
              </p>
             ) : (
              <div>
                <p className="font-big">
                  Advance Applied - True
                </p>
                <p className="font-big">
                  Advance Amount - {props.advance === "" ? 0 : props.advance}
                </p>
              </div>
             )
            }
            <p className="font-big">
                Dish Amount : {props.dishBill}
            </p>
            <p className='font-big'>
              Dish GST Amount: {props.foodGst}
            </p>
            <p className="font-big">
                Stay Amount : {props.bill}
            </p>
            <p className = "font-big">
              Channel : {props.channel}
            </p>
            {
              props.isGst ? (
                <div>
                  <p className = 'font-big'>
                    Stay GST Amount: {props.stayGst}
                  </p>
                  <p className='font-big'>
                    Total Paid Amount: {props.totalAmount}
                  </p>
                </div>
              ) : (
                <div>

                </div>
              )
            }
          </Modal.Body>
          <Modal.Footer>
            <Button className='btn btn-info' onClick={handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>

        <div class="card-body">
          <p style={{ color: "black" }}> Room No : {props.roomno} </p>
          <p style={{ color: "black" }}>Customer Name : {props.username}</p>
          <p style={{ color: "black" }}>Contact Number : {props.phonenumber}</p>
          <hr />
        </div>

        <div className='btn btn-success' onClick={handleClose}>
          Get Details
        </div>
      </div>
    </div>

  )
}

export default UserDbComp
