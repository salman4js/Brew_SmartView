import React, { useState, useEffect } from 'react'
import Navbar from './Navbar';
import Variables from './Variables';
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const ConfigureBill = () => {

    const [suitetype, setSuitetype] = useState();
    const [price, setPrice] = useState();

    const [error, setError] = useState();
    const [show, setShow] = useState(false);
    const [invaliddata, setInvaliddata] = useState(false);


    const handleClose = () => {
        setShow(!show);
    }

    const handleInvalid = () => {
        setInvaliddata(false);
    }

    const { id } = useParams();
    const splitedIds = id.split(/[-]/);
    const token = localStorage.getItem("token");

    const processData = (e) => {
        e.preventDefault();
        console.log(suitetype);
        console.log(price);
        const data = {
            suitetype: suitetype,
            price: price
        }
        axios.post(`${Variables.hostId}/${splitedIds[0]}/addroomtype`, data)
            .then(res => {
                {
                    if (res.data.success) {
                        setError(res.data);
                        setShow(true);
                        setSuitetype("");
                        setPrice("");
                    } else {
                        setInvaliddata(true)
                    }
                }
            })
    }

    useEffect(() => {
        setTimeout(handleInvalid, 4000)
    }, [invaliddata])


    return (
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
                                    Configure Settings - Feautured
                                </div>
                                <div class="card-body">
                                    <div className='modal-gap'>
                                        <label style={{ color: "black" }}> Suite Type </label>
                                        <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Suite Type" name={suitetype} value={suitetype} onChange={(e) => setSuitetype(e.target.value)} />
                                    </div>
                                    <div className='modal-gap'>
                                        <label style={{ color: "black" }}> Price </label>
                                        <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='Price Per Day!' name={price} value={price} onChange={(e) => setPrice(e.target.value)} />
                                    </div>
                                    <br />
                                    <button className='btn btn-info' onClick={processData}> Add Data </button>
                                </div>
                            </div>
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
                                {error.message}!
                            </Modal.Body>
                        </Modal.Header>
                    </Modal>
                )
            }
        </div>
    )
}

export default ConfigureBill