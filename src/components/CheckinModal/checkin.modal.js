import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const CheckinModal = (props) => {
    return (
        <div>
            <Modal.Body>
                <div className = "modal-gap text-center">
                    {props.roomno}
                </div>
                <div className='modal-gap'>
                    <label style={{ color: "black" }}> Date Of Check In </label>
                    <DatePicker style={{ color: "black" }} className="form-control" placeholderText='Checkin Date would go here...' isClearable />
                </div>
                <div className='modal-gap'>
                    <label style={{ color: "black" }}> Date Of Check Out </label>
                    <DatePicker style={{ color: "black" }} className="form-control" placeholderText='Checkout Date would go here...' isClearable />
                </div>
                <label style={{ color: "black" }}> Customer Name </label>
                <input className="form-control dashboard-input" value={props.data.username} name={props.data.username} />
                <label style={{ color: "black" }}> Phone Number </label>

                <input className="form-control dashboard-input" value={props.data.phonenumber} name={props.data.phonenumber} />
                <label style={{ color: "black" }}> Second PhoneNumber </label>

                <input className="form-control dashboard-input" value={props.data.secondphonenumber} name={props.data.secpndphonenumber} />
                <label style={{ color: "black" }}> Aadhar Card </label>

                <input className="form-control dashboard-input" value={props.data.aadharcard} name={props.data.aadharcard} />
                <label style={{ color: "black" }}> Adults </label>

                <input className="form-control dashboard-input" placeholder="Adults" onChange={(e => props.adults(e.target.value))} />
                <label style={{ color: "black" }}> Childrens </label>

                <input className="form-control dashboard-input" placeholder="Childrens" onChange={(e => props.childrens(e.target.value))} />
                <label style={{ color: "black" }}> Discount </label>

                <input className="form-control dashboard-input" placeholder="Discount" onChange={(e => props.discount(e.target.value))} />
                <label style={{ color: "black" }}> Advance </label>

                <input className="form-control dashboard-input" placeholder="Advance" onChange={(e => props.advance(e.target.value))} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => props.handleClose(props.data)}>
                    Cancel
                </Button>
                {/* <Button variant="success">
                    Book & Close
                </Button> */}
            </Modal.Footer>
        </div>
    )
}

export default CheckinModal;