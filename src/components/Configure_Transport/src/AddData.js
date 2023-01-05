import React, { useState, useLayoutEffect, useEffect } from 'react';
import Navbar from '../../Navbar';
import CustomError from '../../CustomError';
import Variables from '../../Variables';
import FeedVehicle from '../Feed_tVehicle/FeedVehicle';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import Loading from '../../Loading';
import { Link, useParams } from 'react-router-dom';

const AddData = () => {

    // Id and token handler!
    const { id } = useParams();
    const splitedIds = id.split(/[-]/);
    const token = localStorage.getItem("token");

    // Success and error handler!
    const [success, setSuccess] = useState(false);
    const [s_message, setS_message] = useState();
    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState();

    // CSS handler!
    const [duty, setDuty] = useState(false);

    // Success and error handler controller!
    const handleSuccess = () => {
        setSuccess(false);
    }

    const handleError = () => {
        setError(false);
    }

    // Loader handler!
    const [loading, setLoading] = useState(false);

    // Vehicle entry data handler!
    const [loader, setLoader] = useState(false);
    const [data, setData] = useState([]);
    const [compLoader, setCompLoader] = useState(false);

    // Options dropdown handler!
    const [options, setOptions] = useState([]);

    // Input value handler!
    const [dropdown, setDropdown] = useState();
    const [vehicle, setVehicle] = useState();
    const [charge, setCharge] = useState();

    // API call for retrieving the options!
    const getData = () => {
        setLoading(true);
        axios.get(`${Variables.hostId}/${splitedIds[0]}/tMode`)
            .then(res => {
                if (res.data.success) {
                    setOptions(res.data.message);
                    setLoading(false);
                } else {
                    setLoading(false);
                    // TODO :: Error handler!
                }
            })
    }

    // Getting the vehicle entry data before the dom renders!
    const vehicleEntry = () => {
        // Re loading the component to make the changes visible!
        setCompLoader(true);
        setLoader(true);
        axios.get(`${Variables.hostId}/${splitedIds[0]}/getAllVehicle`)
            .then(res => {
                if (res.data.success) {
                    setLoader(false);
                    setData(res.data.message);
                    setCompLoader(false);
                } else {
                    setLoader(false);
                    setError(true);
                    setErrorText(res.data.message);
                }
            })
    }

    // Sending the value to the API
    const processData = () => {
        //setLoading(true);
        const data = {
            vehicle: vehicle,
            charge: charge,
            mode: dropdown
        }
        axios.post(`${Variables.hostId}/${splitedIds[0]}/add_tvehicle`, data)
            .then(res => {
                if (res.data.success) {
                    setSuccess(!success);
                    setS_message(res.data.message);
                    // Calling the API again to get the latest data's
                    vehicleEntry()
                    setVehicle("");
                    setCharge("");
                } else {
                    //setLoading(false);
                    setError(!error);
                    setErrorText(res.data.message);
                }
            })
    }

    // API call for toggle the value!
    const onToggle = (tid) => {
        setLoader(true);
        const data = {
            id: tid
        }
        axios.put(`${Variables.hostId}/${splitedIds[0]}/ontoggle`, data)
            .then(res => {
                if (res.data.success) {
                    setLoader(false);
                    setSuccess(!success);
                    if (res.data.response.duty) {
                        setS_message(res.data.message + " to occupied");
                    } else {
                        setS_message(res.data.message + " to available");
                    }
                } else {
                    setLoader(false);
                    setError(!error);
                    setErrorText(res.data.message);
                }
            })
            // Gets the updated modal!
            .then(vehicleEntry());
    }

    // API call for deleting the entry!
    const deleteEntry = (tid) => {
        setCompLoader(true);
        setLoader(true);
        const data = {
            id : tid
        }
        axios.post(`${Variables.hostId}/${splitedIds[0]}/deleteentry`, data)
            .then(res => {
                if(res.data.success){
                    setCompLoader(false);
                    setLoader(false);
                    setSuccess(!success);
                    setS_message(res.data.message);
                } else {
                    setCompLoader(false);
                    setLoader(false);
                    setError(!error);
                    setErrorText(res.data.message);
                }
            })
    }

    // Getting the data before the DOM loads
    useLayoutEffect(() => {
        getData();
        vehicleEntry();
    }, [])

    // Reseting the error message back to the initial state
    useEffect(() => {
        setTimeout(() => {
            handleError();
        }, 4000);
    }, [error])

    // Re-Loading the component everytime the duty gets changed!
    useEffect(() => {
        vehicleEntry();
    }, [compLoader])

    return (
        <div>
            {
                token ? (
                    loading ? (
                        <Loading />
                    ) : (
                        <div>
                            <Navbar id={id} name={splitedIds[1]} className="sticky" />
                            <div className="align-down-tVehicle">
                                <div className='container text-center' style={{ display: "flex", justifyContent: "center" }}>
                                    <div className='row text-center'>
                                        <div className='col'>
                                            {/* Error and success handler */}
                                                {
                                                    error ? (

                                                        <Alert show={error}>
                                                            <div className="container text-center">
                                                                {errorText}
                                                            </div>
                                                        </Alert>
                                                    ) : (
                                                        <div>
                                                        </div>
                                                    )
                                                }
                                            <div class="card text-center" style={{ width: "50vh" }}>
                                                <div class="card-header" style={{ color: "black" }}>
                                                    Add Transport Data -  Featured
                                                </div>
                                                <div class="card-body">
                                                    <div className='modal-gap'>
                                                        <label style={{ color: "black" }}> Transport Mode </label>
                                                        <select class="form-select" aria-label="Default select example" onChange={(e) => setDropdown(e.target.value)}>
                                                            <option selected>Choose...</option>
                                                            {
                                                                options.map((item, key) => {
                                                                    return (
                                                                        <option>{item.tMode}</option>
                                                                    )
                                                                })
                                                            }
                                                        </select>
                                                    </div>
                                                    <div className='modal-gap'>
                                                        <label style={{ color: "black" }}> Vehicle Name </label>
                                                        <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Transport Vehicle" onChange={(e) => setVehicle(e.target.value.toUpperCase())} />
                                                    </div>
                                                    <div className='modal-gap'>
                                                        <label style={{ color: "black" }}> Charge/Km </label>
                                                        <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='Transport Charge/Km' onChange={(e) => setCharge(e.target.value)} />
                                                    </div>
                                                    <br />
                                                    <button className='btn btn-info' onClick={processData}> Add Data </button>
                                                </div>
                                                <div style={{ color: "black", fontSize: "18px" }}>
                                                    {
                                                        loader ? (
                                                            <div className="modal-gap">
                                                                Loading, Please wait.....
                                                            </div>
                                                        ) : (
                                                            <div className="overscroll">
                                                                {
                                                                    data.map((item, key) => {
                                                                        return (
                                                                            <FeedVehicle id={item._id} vehicle={item.vehicle} charge={item.charge} mode={item.mode} duty={item.duty} onToggle={(id) => onToggle(id)} onDelete = {(id) => deleteEntry(id)}/>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Success handler! */}
                            <Modal
                                show={success}
                                onHide={handleSuccess}
                                backdrop="static"
                                keyboard={false}
                            >
                                <Modal.Header closeButton>
                                    <Modal.Body className="text-center">
                                        {s_message}!
                                    </Modal.Body>
                                </Modal.Header>
                            </Modal>
                        </div>
                    )
                ) : (
                    <div>
                        <CustomError />
                    </div>
                )
            }
        </div>
    )
}

export default AddData