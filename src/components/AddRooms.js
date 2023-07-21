import React, { useState, useEffect } from 'react';
import CustomError from './CustomError';
import changeScreen from './Action';
import Navbar from './Navbar';
import Variables from './Variables';
import Loading from './Loading';
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const AddRooms = () => {

    const { id } = useParams();
    const token = localStorage.getItem("token");

    const splitedIds = id.split(/[-]/);

    //Loader
    const [loading, setLoading] = useState(false);

    // Add Rooms 
    const [roomno, setRoomno] = useState("");
    const [bedcount, setBedcount] = useState("");
    const [suitetype, setSuitetype] = useState("");
    const [option, setOption] = useState([]);
    const [price, setPrice] = useState("");
    const [extra, setExtra] = useState("");

    // Error Messages
    const [error, setError] = useState();
    const [show, setShow] = useState(false);
    const [invaliddata, setInvaliddata] = useState(false);

    const handleClose = () => {
        setShow(!show);
    }

    // Error Handling
    const handleInvalid = () => {
        setInvaliddata(false);
    }

    // Setter for the price value
    const setValues = (value) => {
        setSuitetype(value);
        const values = {
            suitename: value
        }
        axios.post(`${Variables.hostId}/${splitedIds[0]}/getprice`, values)
            .then(res => {
                if (res.data.success) {
                    res.data.message.map((options,key) => {
                        setPrice(options.price);
                        setExtra(options.extraBedPrice);
                    })
                } else {
                    setLoading(false);
                    setError(res.data.message)
                    setInvaliddata(true);
                    setRoomno("");
                    setBedcount("");
                    setSuitetype("");
                    setPrice("");
                }
            })
    }

    // Add rooms
    const processData = (e) => {
        e.preventDefault();
        setLoading(true);
        const credentials = {
            roomno: roomno,
            bedcount: bedcount,
            suitename: suitetype,
            price: price,
            extraBedPrice: extra
        }
        axios.post(`${Variables.hostId}/${splitedIds[0]}/createroom`, credentials)
            .then(res => {
                {
                    if (res.data.success) {
                        setLoading(false);
                        setError(res.data);
                        setShow(true);
                        setRoomno("");
                        setBedcount("");
                        setSuitetype("");
                        setPrice("");
                    } else {
                        setLoading(false);
                        setError(res.data.message)
                        setInvaliddata(true);
                        setRoomno("");
                        setBedcount("");
                        setSuitetype("");
                        setPrice("");
                    }
                }
            })
    }

    // Getting Options
    const G_Options = () => {
        setLoading(true);
        axios.post(`${Variables.hostId}/${splitedIds[0]}/allroomtype`)
            .then(data => {
                setOption(data.data.message);
                setLoading(false);
            })
    }


    useEffect(() => {
        setTimeout(handleInvalid, 4000)
    }, [invaliddata])

    useEffect(() => {
        G_Options()
    }, [])

    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split(".")[1]));
        } catch (e) {
            return null;
        }
    };

    const AuthVerify = () => {
        const user = localStorage.getItem("token");

        if (user) {
            const decodedJwt = parseJwt(user);

            if (decodedJwt.exp * 1000 < Date.now()) {
                localStorage.clear();
                changeScreen();
            }
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            AuthVerify();
        }, 9000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div>
            {
                token ? (
                    loading ? (
                        <Loading />
                    ) : (
                        <div>
                            <Navbar id={id} name={splitedIds[1]} />
                            <div className="align-down">
                                <div className='container text-center' style={{ display: "flex", justifyContent: "center" }}>
                                    <div className='row text-center'>
                                        <div className='col'>
                                            {
                                                invaliddata ? (

                                                    <Alert show={invaliddata}>
                                                        <div className="container text-center">
                                                            {error}
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
                                                        <label style={{ color: "black" }}> Suite Type </label>
                                                        <select class="form-select" aria-label="Default select example" onChange={(e) => setValues(e.target.value)}>
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
                                                    <div className='modal-gap'>
                                                        <label style={{ color: "black" }}> Room No </label>
                                                        <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Room No" name={roomno} value={roomno} onChange={(e) => setRoomno(e.target.value)} />
                                                    </div>
                                                    <div className='modal-gap'>
                                                        <label style={{ color: "black" }}> Bed Count </label>
                                                        <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='Bed Count' name={bedcount} value={bedcount} onChange={(e) => setBedcount(e.target.value)} />
                                                    </div>
                                                    <div className='moal-gap'>
                                                        <label style={{ color: "black" }}> Price Per Day </label>
                                                        <input type="text" className="form-control" id="priceperday" aria-describedby="priceperday" placeholder='Price Per Day' name={price} value={price} />
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
                    )
                ) : (
                    <CustomError />
                )
            }
        </div>
    )
}

export default AddRooms