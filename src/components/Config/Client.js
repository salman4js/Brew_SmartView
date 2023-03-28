import React, { useState, useEffect, useLayoutEffect } from 'react';
import Variables from '../Variables';
import Success from '../ToastHandler/Success';
import Error from '../ToastHandler/Error';
import Feed from '../Configure_Transport/Feed_tMode/Feed';
import axios from 'axios';
import Loading from '../Loading';
import { Link, useParams } from "react-router-dom";

// Importing Config Matrix!
import ConfigMatrix from './config.matrix/config.matrix.view';


const Client = () => {

    // Get ID and token!
    const { id } = useParams();
    const splitedIds = id.split(/[-]/);
    const token = localStorage.getItem("token");

    // Loader option handler!
    const [loader, setLoader] = useState(false);
    const [loading, setLoading] = useState(false);

    //Success and error handler!
    const [success, setSuccess] = useState(false);
    const [successText, setSuccessText] = useState();
    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState();

    // State handler for GST!
    const [isGst, setIsGst] = useState(false);

    // Hourly basis state handler!
    const [isHourly, setIsHourly] = useState(false);

    const successHandler = () => {
        setSuccess(!success);
    }

    const errorHandler = () => {
        setError(false);
    }

    // Set Options
    const [options, setOptions] = useState([]);
    const [dropdown, setDropdown] = useState();
    const [value, setValue] = useState([]);

    // Get the config options from the server
    const showConfig = () => {
        axios.get(`${Variables.hostId}/${splitedIds[0]}/config-get`)
            .then(res => {
                if (res.data.success) {
                    setOptions(res.data.message);
                } else {
                    // TODO: Error Handling!
                }
            })
    }

    // Show applied config from the server!
    const checkConfig = () => {
        axios.get(`${Variables.hostId}/${splitedIds[0]}/config-checking`)
            .then(res => {
                if (res.data.success) {
                    setValue(res.data.message);
                } else {
                    //TODO : Erro handling!
                }
            })
    }

    // Check Matrix Data!
    const checkMatrix = () => {
        axios.get(`${Variables.hostId}/${splitedIds[0]}/check-matrix`)
            .then(res => {
                if(res.data.success){
                    setIsGst(res.data.isGstEnabled);
                    setIsHourly(res.data.isHourly);
                }
            })
        
    }

    // Disbale the enabled config!
    const onDelete = (id) => {
        setLoader(true);
        const data = {
            id: id
        }
        axios.post(`${Variables.hostId}/${splitedIds[0]}/delete-config`, data)
            .then(res => {
                if (res.data.success) {
                    setLoader(false);
                    console.log(res.data.message);
                } else {
                    setLoader(false);
                    console.log(res.data.message);
                }
            })
            .catch(err => {
                setError(!error);
                setErrorText("Some internal error occured!")
            })
            .finally(() => {
                checkConfig();
            })

    }

    // Process the data!
    const processData = () => {
        setLoader(true);
        const data = {
            config: dropdown,
            id: splitedIds[0]
        }
        axios.post(`${Variables.hostId}/${splitedIds[0]}/create-config`, data)
            .then(res => {
                if (res.data.success) {
                    setLoader(false);
                    setSuccess(!success);
                    setSuccessText(res.data.message);
                } else {
                    setLoader(false)
                    setError(!error);
                    setErrorText(res.data.message);
                }
            })
            .catch(err => {
                setLoader(false);
                setError(!error);
                setErrorText("Some internal error occured!");
            })
            .finally(() => {
                checkConfig();
            })
    }

    // GST handler!
    function handleGST() {
        setIsGst(!isGst);
    }

    // Handle Hourly!
    function handleHourly(){
        setIsHourly(!isHourly);
    }

    // Change Matrix config data!
    function changeMatrix() {
        console.log("Hourly", isHourly);
        setLoading(true);
        const data = {
            isGst: isGst,
            isHourly: isHourly
        }
        axios.post(`${Variables.hostId}/${splitedIds[0]}/config-update-matrix`, data)
            .then(resp => {
                if (resp.data.success) {
                    setLoading(false);
                    setSuccess(!success)
                    setSuccessText(resp.data.message);
                } else {
                    setLoading(false);
                    setSuccess(!success)
                    setSuccessText(resp.data.message);
                }
            })
            .catch(err => {
                setLoading(false)
                setError(!error)
                setErrorText("Some internal error occured")
            })
            .finally(() => {
                checkMatrix();
            })

    }

    // Getting the data before the DOM renders!
    useLayoutEffect(() => {
        showConfig();
    }, [])

    // Check the config collection when the DOM renders!
    useEffect(() => {
        checkConfig();
        checkMatrix();
    }, [])

    // Reseting the error message back to the initial state
    useEffect(() => {
        setTimeout(errorHandler, 4000);
    }, [error])


    return (
        <div className="container align-down" style={{ display: "flex", justifyContent: "center" }}>
            {
                loading ? (
                    <Loading />
                ) : (
                    <div className='row'>
                        <div className='col'>
                            {
                                error ? (
                                    <Error error={error} errorText={errorText} />
                                ) : (
                                    <div>
                                    </div>
                                )
                            }
                            <div class="card text-center" style={{ width: "50vh" }}>
                                <div class="card-header" style={{ color: "black" }}>
                                    Config -  Featured
                                </div>
                                <div class="card-body">
                                    <div className='modal-gap'>
                                        <label style={{ color: "black" }}> Change Config </label>
                                        <select class="form-select" aria-label="Default select example" onChange={(e) => setDropdown(e.target.value)}>
                                            <option selected>Choose...</option>
                                            {
                                                options.map((item, key) => {
                                                    return (
                                                        <option>{item}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                    <br />
                                    <button className='btn btn-info' onClick={() => processData()}> Add Data </button>
                                </div>
                                <div style={{ color: "black", fontSize: "18px" }}>
                                    <div>
                                        {
                                            loader ? (
                                                <div className="modal-gap">
                                                    Loading, please wait...
                                                </div>
                                            ) : (
                                                <div className="overscroll">
                                                    {
                                                        value.map((item, key) => {
                                                            return (
                                                                <Feed name={item.config} id={item._id} onDelete={(id) => onDelete(id)} />
                                                            )
                                                        })
                                                    }
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                            {/* Success Handler */}
                            {
                                success ? (
                                    <Success show={success} text={successText} handleClose={successHandler} />
                                ) : (
                                    <div>

                                    </div>
                                )
                            }
                        </div>
                        <div className='col'>
                            {
                                error ? (
                                    <Error error={error} errorText={errorText} />
                                ) : (
                                    <div>
                                    </div>
                                )
                            }
                            <div class="card text-center" style={{ width: "50vh" }}>
                                <div class="card-header" style={{ color: "black" }}>
                                    Config -  Matrix
                                </div>
                                <div class="card-body">
                                    <ConfigMatrix isGst = {isGst} handleGST = {() => handleGST()} isHourly = {isHourly} handleHourly = {() => handleHourly()} />
                                    <br />
                                    <button className="btn btn-primary" onClick={() => changeMatrix()}>Update Changes</button>
                                </div>
                            </div>
                            {/* Success Handler */}
                            {
                                success ? (
                                    <Success show={success} text={successText} handleClose={successHandler} />
                                ) : (
                                    <div>

                                    </div>
                                )
                            }
                        </div>
                    </div>
                )
            }

        </div>
    )
}

export default Client