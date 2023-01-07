import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../Navbar';
import Feed from './Feed_tMode/Feed';
import axios from 'axios';
import Variables from '../Variables';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import CustomError from '../CustomError';
import { Link, useParams } from "react-router-dom";

const AddMode = () => {

    // Id and token handler
    const { id } = useParams();
    const splitedIds = id.split(/[-]/);
    const token = localStorage.getItem("token");

    // Value handler!
    const [t_Mode, setT_Mode] = useState();

    // Get Data value handler!
    const [datamode, setDatamode] = useState([]);

    // Error and success message handler!
    const [showsuccess, setShowsuccess] = useState(false);
    const [success, setSuccess] = useState();
    const [showerror, setShowerror] = useState(false);
    const [error, setError] = useState();

    // Success Modal Handler!
    const handleClose = () => {
        setShowsuccess(!showsuccess);
    }

    // Loader
    const [loading, setLoading] = useState(false);

    // Error Dialog Handler!
    const handleError = () => {
        setShowerror(false);
    }

    // API Call for adding the data!
    const processData = () => {
        if(t_Mode === undefined){
            setShowerror(!showerror);
            setError("Please check your input!");
        } else if(t_Mode === null){
            setShowerror(!showerror);
            setError("Please check your input!");
        } else if(t_Mode === ""){
            setShowerror(!showerror);
            setError("Please check your input!")
        } else {
            const data = {
                tMode : t_Mode
            }
            setLoading(true);
            axios.post(`${Variables.hostId}/${splitedIds[0]}/add-tMode`, data)
                .then(res => {
                    if(res.data.success){
                        setLoading(false);
                        setShowsuccess(!showsuccess);
                        setSuccess(res.data.message);
                        setT_Mode("");
                        getData();
                    } else {
                        setLoading(false);
                        setShowerror(!showerror);
                        setError(res.data.message);
                    }
                })
        }
    }

    // API call for retrieving the data from the server
    const getData = () => {
        setLoading(true);
        axios.get(`${Variables.hostId}/${splitedIds[0]}/tMode`)
            .then(res => {
                if(res.data.success){
                    setLoading(false);
                    setDatamode(res.data.message);
                } else {
                    setLoading(false);
                    setShowsuccess(!showsuccess)
                    setSuccess(res.data.message);
                }
            })
    }

     // Delete t_mode functionality
    const onDelete = (id) => {
        console.log(id)
        setLoading(true);
        const data = {
        tMode_id : id
        }
        axios.post(`${Variables.hostId}/${splitedIds[0]}/delete_tMode`, data)
        .then(res => {
            if (res.data.success) {
            setLoading(false);
            getData();
            } else {
            setLoading(false);
            setShowerror(true);
            setError(res.data.message);
            }
        })
    }

    // Re-Rendering the error dialog back to the initial state
    useEffect(() => {
        setTimeout(handleError, 4000)
    }, [showerror])


    // Binding the function with component
    useEffect(() => {
        getData();
    }, []);

    return (
        <div>
            {
                token ? (
                    <div>
                        <Navbar id={id} name={splitedIds[1]} className="sticky" />
                        <div className="align-down">

                            <div className='container text-center' style={{ display: "flex", justifyContent: "center" }}>
                                <div className='row text-center'>
                                    <div className='col'>
                                        {
                                            showerror ? (

                                                <Alert show={showerror}>
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
                                                Transport Settings - Feautured
                                            </div>
                                            <div class="card-body">
                                                <div className='modal-gap'>
                                                    <label style={{ color: "black" }}> Transport Mode </label>
                                                    <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Transport Mode" name= {t_Mode} value = {t_Mode} onChange={(e) => setT_Mode(e.target.value.toUpperCase())} />
                                                </div>
                                                <br />
                                                <button className='btn btn-info' onClick={processData}> Add Data </button>
                                            </div>
                                            <div style={{ color: "black", fontSize: "18px" }}>
                                                <div>
                                                   <div>
                                                    {
                                                            loading ? (
                                                                <div className = "modal-gap">
                                                                    Loading, Please wait.....
                                                                </div>
                                                            ) : (
                                                                <div  className = "overscroll">
                                                                    {
                                                                        datamode.map((item,key) => {
                                                                            return(
                                                                                <Feed name = {item.tMode} id = {item._id} lodgeId = {splitedIds[0]} loader = {setLoading} error = {setShowerror} errormessage = {setError} onDelete = {(id) => onDelete(id)}/>
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
                            </div>
                        </div>
                        {/* Success Handler */}
                        <Modal
                            show={showsuccess}
                            onHide={handleClose}
                            backdrop="static"
                            keyboard={false}
                        >
                            <Modal.Header closeButton>
                                <Modal.Body className="text-center">
                                    {success}!
                                </Modal.Body>
                            </Modal.Header>
                        </Modal>
                    </div>
                ) : (
                    <div>
                        <CustomError />
                    </div>
                )
            }
        </div>
    )
}

export default AddMode;