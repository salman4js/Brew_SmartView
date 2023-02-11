import React, { useState } from 'react';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const UserDbComp = (props) => {

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(!show);
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
              Checked In  -- {props.checkin}
            </p>
            <p className="font-big">
              Checked Out -- {props.checkout}
            </p>
            {
              props.discount ? (
                <p className="font-big">
                  Discount Applied -- True
                </p>
              ) : (
                <p className="font-big">
                  Discount Applied --  False
                </p>
              )
            }
            {
              props.advance ? (
                <p className="font-big">
                  Advance Paid -- True
                </p>
              ) : (
                <p className="font-big">
                 Advance Paid -- False
                </p>
              )
            }
            <p className="font-big">
                Amount Paid : {props.bill}
            </p>
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
