import React, { useState, useEffect } from 'react';
import Variables from './Variables';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";


const RoomsUpdate = (props) => {

    const [show, setShow] = useState(false);
    const [showerror, setShowerror] = useState(false);
    const [option, setOption] = useState([]);


    const splitedIds = (props.id).split(/[-]/);
    console.log(splitedIds[0])


    // Udpate Rooms
    const [roomno, setRoomno] = useState(props.roomno);
    const [bedcount, setBedcount] = useState(props.bedcount);
    const [suitetype, setSuitetype] = useState(props.roomtype);
    const [success, setSuccess] = useState();


    const updateRooms = () => {
        const credentials = {
            roomno: roomno,
            bedcount: bedcount,
            suitename: suitetype,
            roomId: props.roomid
        }
        axios.post(`${Variables.hostId}/${props.id}/roomupdater`, credentials)
            .then(res => {
                console.log(res.data);
                if (res.data.success) {
                    setShowerror(true)
                    setSuccess(res.data.message);
                    handleClose();
                    props.setLoad(!props.setLoad)
                } else {
                    setShowerror(true)
                    setSuccess(res.data.message)
                    props.setLoad(!props.setLoad)
                }
            })
    }

     // Getting Options
     const G_Options = () => {
        axios.post(`${Variables.hostId}/${splitedIds[0]}/allroomtype`)
            .then(data => {
                console.log(data.data.suiteType);
                setOption(data.data);
            })
    }

    const handleClose = () => {
        setShow(!show);
    }

    const handleCloseModal = () => {
        setShowerror(!showerror)
    }

    useEffect(() => {
        G_Options()
    }, [])

    return (

        <div class="col-4" style={{ paddingBottom: "10vh" }}>
            <div class="card text-center">
                <div class="card-header" style={{ color: "black" }}>
                    <strong>Room No : {props.roomno} </strong>
                </div>
                <div class="card-body">
                    <p style={{ color: "black" }}>Engaged : {props.engaged}</p>
                    <p style={{ color: "black" }}>Bed Count : {props.bedcount}</p>
                    <p style={{ color: "black" }}> Room Type : {props.roomtype}</p>
                </div>
                <div className='btn btn-success' onClick={handleClose}>
                    Update Room Data
                </div>
            </div>
            <Modal
                show={show}

                aria-labelledby="contained-modal-title-vcenter"
                centered
                keyboard={false}
                background="static"
                className="text-center"
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter" className="container text-center">
                        Update Room Data - Featured
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Room No : {props.roomno}</h4>
                    <div className='modal-gap'>
                        <label style={{ color: "black" }}> Room No </label>
                        <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Room No" name={roomno} value={roomno} onChange={(e) => setRoomno(e.target.value)} />
                    </div>
                    <div className='modal-gap'>
                        <label style={{ color: "black" }}> Bed Count </label>
                        <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='Bed Count' name={bedcount} value={bedcount} onChange={(e) => setBedcount(e.target.value)} />
                    </div>
                    <div className='modal-gap'>
                        <label style={{ color: "black" }}> Suite Type </label>
                        <select class="form-select" aria-label="Default select example" onChange={(e) => setSuitetype(e.target.value)}>
                            <option selected>Choose...</option>
                            {
                                option.map((item, key) => {
                                    return (
                                        <option>{item.suiteType}</option>
                                    )
                                })
                            }
                        </select>

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="btn btn-secondary" onClick={handleClose}>Close</Button>
                    <Button className='btn btn-info' onClick={updateRooms}> Save and Close </Button>
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
        </div>

    )
}

export default RoomsUpdate