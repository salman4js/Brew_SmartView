import React, { useState, useEffect } from 'react';
import Variables from './Variables';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";


const RoomsUpdate = (props) => {

    const [show, setShow] = useState(false);
    const [showerror, setShowerror] = useState(false);
    const [option, setOption] = useState([]);
    const [deletemodal, setDeletemodal] = useState(false);
    const [occupied, setOccupied] = useState(false);
    const [closeAlert, setCloseAlert] = useState(false);


    const splitedIds = (props.id).split(/[-]/);
    //console.log(splitedIds[0])


    // Udpate Rooms
    const [roomno, setRoomno] = useState(props.roomno);
    const [bedcount, setBedcount] = useState(props.bedcount);
    const [suitetype, setSuitetype] = useState(props.roomtype);
    const [success, setSuccess] = useState();

    //Loader--Modal
    const [loading, setLoading] = useState(false);


    const updateRooms = () => {
        setLoading(true);
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
                    setLoading(false);
                    setShowerror(true)
                    setSuccess(res.data.message);
                    handleClose();
                } else {
                    setLoading(false);
                    setShowerror(true)
                    setSuccess(res.data.message)
                }
            })
            .catch(err => {
                setShowerror(true);
                setSuccess("Some internal error occured!");
            })
            .finally(() => {
                // Reloading the component everytime the value gets updated!
                props.load();
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


    // Delete Room Data...

    const deleteRoom = () => {
        setLoading(true);
        console.log("Delete config triggered!");
        const credentials = {
            roomId: props.roomid
        }
        axios.post(`${Variables.hostId}/${props.lodgeId}/deleteroom`, credentials)
            .then(res => {
                if (res.data.success) {
                    setLoading(false);
                    setShowerror(true);
                    setSuccess(res.data.message);
                    deleteModal();
                    props.setLoad(true)
                } else {
                    setLoading(false);
                    setShowerror(true);
                    setSuccess(res.data.message)
                    deleteModal();
                }
            })
            .catch(err => {
                setShowerror(true);
                setSuccess("Some internal error occured!");
            })
            .finally(() => {
                // Reloading the component after the deletion
                props.load();
            })
    }

    const handleClose = () => {
        setShow(!show);
    }

    const handleCloseModal = () => {
        setShowerror(!showerror)
    }

    const handleCloseAlert = () => {
        setCloseAlert(!closeAlert);
    }

    const deleteModal = () => {
        if (props.engaged === "false") {
            setDeletemodal(!deletemodal)
        } else {
            setOccupied(!occupied);
        }
    }

    const Occupied = () => {
        setOccupied(!occupied);
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
                    <p style = {{color  :"black"}}>Price Per Day : {props.price} </p>
                </div>
                {
                    props.engaged == "false" ? (
                        <div className='btn btn-success' onClick={handleClose}>
                            Update Room Data
                        </div>
                    ) : (
                        <div className='btn btn-dark' onClick={handleCloseAlert}>
                            Update Room Data
                        </div>
                    )
                }
                <div className = "btn btn-danger minute-space" onClick={deleteModal}>
                        Delete Room Data
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
                {
                    closeAlert ? (
                        <Modal
                            show={closeAlert}
                            onHide={handleCloseAlert}
                            backdrop="static"
                            keyboard={false}
                        >
                            <Modal.Header closeButton>
                                <Modal.Body className="text-center">
                                    Room Already Occupied, Cannot edit occupied room data!
                                </Modal.Body>
                            </Modal.Header>
                        </Modal>
                    ) : (
                        <div>
                        </div>
                    )
                }
            </div>
            <div>
                {
                    deletemodal ? (
                        <Modal
                            show={deletemodal}
                            onHide={deleteModal}
                            backdrop="static"
                            keyboard={false}
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>Workflow Panel</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Do you really want to delete {props.roomno}'s data permanently?
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={deleteModal}>
                                    No
                                </Button>
                                <Button variant="primary" onClick={deleteRoom}>Yes</Button>
                            </Modal.Footer>
                        </Modal>
                    ) : (
                        <div>
                        </div>
                    )
                }
            </div>
            <div>
                {
                    occupied ? (
                        <Modal
                            show={occupied}
                            onHide={Occupied}
                            backdrop="static"
                            keyboard={false}
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>Workflow Panel</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Room no: {props.roomno} already occupied, Can't delete occupied room data!
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={Occupied}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    ) : (
                        <div>
                        </div>
                    )
                }
            </div>
            <div>
                {
                    loading ? (
                        <Modal
                            show={loading}
                            backdrop="static"
                        >
                            <Modal.Body>
                                Updating, please wait!
                            </Modal.Body>
                        </Modal>
                    ) : (
                        <div>
                        </div>
                    )
                }
            </div>
        </div>

    )
}

export default RoomsUpdate