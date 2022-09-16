import React, { useState, useEffect } from 'react';
import CustomError from './CustomError';
import Navbar from './Navbar';
import Variables from './Variables';
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const AddRooms = () => {

    const { id } = useParams();
    const token = localStorage.getItem("token");

    const splitedIds = id.split(/[-]/);



    // Add Rooms 
    const [roomno, setRoomno] = useState("");
    const [bedcount, setBedcount] = useState("");
    const [suitetype, setSuitetype] = useState("");
    const [option, setOption] = useState([]);

    // Error Messages
    const [error, setError] = useState();
    const [show, setShow] = useState(false);
    const [invaliddata, setInvaliddata] = useState(false);

    const handleClose = () => {
        setShow(!show);
    }

    const handleInvalid = () => {
        setInvaliddata(false);
    }

    // Add rooms
    const processData = (e) => {
        e.preventDefault();
        const credentials = {
            roomno: roomno,
            bedcount: bedcount,
            suitename: suitetype
        }
        axios.post(`${Variables.hostId}/${splitedIds[0]}/createroom`, credentials)
            .then(res => {
                {
                    if (res.data.success) {
                        setError(res.data);
                        setShow(true);
                        setRoomno("");
                        setBedcount("");
                        setSuitetype("");
                    } else {
                        setInvaliddata(true)
                    }
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


    useEffect(() => {
        setTimeout(handleInvalid, 4000)
    }, [invaliddata])

    useEffect(() => {
        G_Options()
    }, [])

    return (
        <div>
            {
                token ? (
                    <div className='container'>
                        <Navbar id={id} name={splitedIds[1]} />
                        <div className="align-down">
                            <div className='container text-center' style={{ display: "flex", justifyContent: "center" }}>
                                <div className='row text-center'>
                                    <div className='col'>
                                        {
                                            invaliddata ? (

                                                <Alert show={invaliddata}>
                                                    <div className="container text-center">
                                                        That's a bad input!
                                                    </div>
                                                </Alert>
                                            ) : (
                                                <div>
                                                </div>
                                            )
                                        }
                                        <div class="card text-center" style={{ width: "50vh" }}>
                                            <div class="card-header" style={{ color: "black" }}>
                                                Add Rooms -  Featured
                                            </div>
                                            <div class="card-body">
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
                                                        {
                                                            option.map((item, key) => {
                                                                return (
                                                                    <option>{item.suiteType}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>

                                                </div>
                                                <br />
                                                <button className='btn btn-info' onClick={processData}> Add Data </button>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                {
                                    error == undefined ? (
                                        <div>
                                        </div>
                                    ) : (
                                        <Modal
                                            show={show}
                                            onHide={handleClose}
                                            backdrop="static"
                                            keyboard={false}
                                        >
                                            <Modal.Header closeButton>
                                                <Modal.Body className="text-center">
                                                    {error.message} Successfully!
                                                </Modal.Body>
                                            </Modal.Header>
                                        </Modal>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                ) : (
                    <CustomError />
                )
            }
        </div>
    )
}

export default AddRooms