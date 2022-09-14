import React, { useState } from 'react';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Variables from './Variables';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ModalCheckOut from './ModalCheckOut';



const HomeRoom = (props) => {

    const current = new Date();
    const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;

    const [show, setShow] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showerror, setShowerror] = useState(false);
    const [userdata, setUserdata] = useState([]);


    // Customer Data
    const [customername, setCustomername] = useState();
    const [customerphonenumber, setCustomerphonenumber] = useState();
    const [secondphonenumber, setSecondphonenumber] = useState();
    const [adults, setAdults] = useState();
    const [childrens, setChildrens] = useState();
    const [day, setDay] = useState(null);
    const [stayeddays, setStayeddays] = useState();
    const [checkoutdate, setCheckoutdate] = useState();
    const [aadhar, setAadhar] = useState();
    const [showmodal, setShowmodal] = useState();
    const [userid, setUserid] = useState();

    const handleClose = () => {
        setShow(!show)
    }

    const handleModal = () => {
        setShowmodal(!showmodal)
    }


    const handleCloseModal = () => {
        setShowerror(!showerror)
    }


    // Add Data to the model
    const processData = () => {

        console.log(date);
        const credentials = {
            customername: customername,
            phonenumber: customerphonenumber,
            secondphonenumber: secondphonenumber,
            adults: adults,
            childrens: childrens,
            aadhar: aadhar,
            checkin: new Date(current.getFullYear(), current.getMonth(), current.getDate()+1),
            roomid: props.roomid,
            roomno : props.roomno
        }
        axios.post(`${Variables.hostId}/${props.id}/adduserrooms`, credentials)
            .then(res => {
                if (res.data.success) {
                    handleClose();
                    setShowerror(true);
                    setSuccess(res.data.message)
                    props.setLoad(!props.setLoad);
                } else {
                    setShowerror(true);
                    setSuccess(res.data.message)
                }
            })
    }

    // Retrieve User Room data from the API
    const getUserData = () => {
        const credentials = {
            roomid: props.roomid
        }
        axios.post(`${Variables.hostId}/${props.id}/userroom`, credentials)
            .then(res => {
                if (res.data.success) {
                    setUserdata(res.data.message);
                    handleModal();
                } else {
                    setShowerror(true);
                    setSuccess(res.data.message)
                }
            })
    }

    // Check Out Customer Data
    const clearData = () => {
        console.log(stayeddays);
        console.log(checkoutdate);
        const credentials = {
            userid : userid,
            roomid : props.roomid,
            stayeddays : stayeddays,
            checkoutdate : checkoutdate
        }
        console.log(credentials);
        axios.post(`${Variables.hostId}/${props.id}/deleteuser`, credentials)
        .then(res => {
            if(res.data.success){
                handleModal();
                setShowerror(true);
                setSuccess(res.data.message)
                props.setLoad(!props.setLoad);
            } else {
                setShowerror(true);
                setSuccess(res.data.message)
            }
        })
    }

    return (
        <div class="col-4" style={{ paddingBottom: "10vh" }}>
            <div class="card text-center">
                <div class="card-header" style={{ color: "black" }}>
                    <strong>Room No : {props.roomno}</strong>
                </div>
                <div class="card-body">
                    <p style={{ color: "black" }}>Engaged : {props.engaged}</p>
                    <p style={{ color: "black" }}>Bed Count : {props.bedcount}</p>
                    <p style={{ color: "black" }}> Room Type : {props.roomtype}</p>
                </div>

                {/* // Check In Modal */}
                <Modal
                    show={show}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    background="static"
                    className="text-center"
                >
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Check In - Feautured
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4 className='strong'>{props.roomno}</h4>

                        <div className="modal-gap">
                            <label style={{ color: "black" }}> Customer Name </label>
                            <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Customer Name" name={customername} value={customername} onChange={(e) => setCustomername(e.target.value)} />
                        </div>
                        <div className='modal-gap'>
                            <label style={{ color: "black" }}> Customer Phone Number </label>
                            <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='Customer Phone Number' name={customerphonenumber} value={customerphonenumber} onChange={(e) => setCustomerphonenumber(e.target.value)} />
                        </div>
                        <div className='modal-gap'>
                            <label style={{ color: "black" }}> Customer Second Phone Number </label>
                            <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='Customer Second Phone Number' name={secondphonenumber} value={secondphonenumber} onChange={(e) => setSecondphonenumber(e.target.value)} />
                        </div>
                        <div className='modal-gap'>
                            <label style={{ color: "black" }}> Adults </label>
                            <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='No.of.adults' name={adults} value={adults} onChange={(e) => setAdults(e.target.value)} />
                        </div>
                        <div className='modal-gap'>
                            <label style={{ color: "black" }}> Childrens If Any! </label>
                            <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='No.of.childrens' name={childrens} value={childrens} onChange={(e) => setChildrens(e.target.value)} />
                        </div>
                        <div className='modal-gap'>
                            <label style={{ color: "black" }}> Aadhar Number of anyone adult </label>
                            <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='Aadhar Card Number' name={aadhar} value={aadhar} onChange={(e) => setAadhar(e.target.value)} />
                        </div>
                        <div className='modal-gap'>
                            <label style={{ color: "black" }}> Date Of Check In - (Default Date is Today's Date!) </label>
                            <DatePicker style={{ color: "black" }} className="form-control" selected={Date.now()} dateFormat='y-MM-dd' minDate={new Date()} isClearable />
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="btn btn-secondary" onClick={handleClose}>Close</Button>
                        <Button className='btn btn-info' onClick={processData}> Save and Close </Button>
                    </Modal.Footer>
                </Modal>

                {/* // Check Out Modal */}
                <Modal
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    background="static"
                    show={showmodal}
                >
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Check Out - Feautured
                        </Modal.Title>
                    </Modal.Header>
                    {
                        userdata.map((item, key) => {
                            return (
                                <ModalCheckOut roomno={props.roomno} username={item.username} phone={item.phonenumber} adults={item.adults} childrens={item.childrens} user = {item._id} userid = {setUserid} checkin = {item.dateofcheckin} stayeddays = {setStayeddays} checkoutdate = {setCheckoutdate} />
                            )
                        })
                    }
                    <Modal.Footer>
                        <Button className="btn btn-secondary" onClick={handleModal}>Close</Button>
                        <Button className="btn btn-info" onClick={clearData}> Check-Out & Generate Bill </Button>
                    </Modal.Footer>
                </Modal>
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
                {
                    (props.engaged == "true" ? (
                        <div className="btn btn-dark" onClick={getUserData}>
                            Check-Out
                        </div>
                    ) : (
                        <div className="btn btn-info" onClick={handleClose}>
                            Check-In
                        </div>

                    )
                    )
                }
            </div>
        </div>
    )
}

export default HomeRoom
