import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Variables from './Variables';
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";
import Button from 'react-bootstrap/Button';
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const AddDishes = () => {

    const { id } = useParams();

    const splitedIds = id.split(/[-]/);


    // Add Dishes
    const [dishname, setDishname] = useState("");
    const [dishrate, setDishrate] = useState("");
    const [dishtype, setDishtype] = useState("");

    // Error box
    const [error, setError] = useState("");
    const [invaliddata, setInvaliddata] = useState(false);
    const [show, setShow] = useState(false);


    // Process Data

    const processData = () => {
        const credentials = {
            dishname: dishname,
            dishrate: dishrate,
            dishtype: dishtype
        }
        axios.post(`${Variables.hostId}/${splitedIds[0]}/adddish`, credentials)
            .then(res => {
                if (res.data.success) {
                    setError(res.data.message)
                    setShow(true)
                    setDishname("");
                    setDishrate("");
                    setDishtype("");
                } else {
                    setInvaliddata(true)
                }
            })
    }

    const handleClose = () => {
        setShow(!show)
    }

    const handleInvalid = () => {
        console.log(invaliddata)
        setInvaliddata(false);
    }

    useEffect(() => {
        setTimeout(handleInvalid, 4000)
    }, [invaliddata])



    return (
        <div className="container">
            <Navbar id={id} name={splitedIds[1]} />
            <div className="align-down">
                <div className='container text-center' style={{ display: "flex", justifyContent: "center" }}>
                    <div className='row text-center'>
                        <div className='col'>
                            {
                                invaliddata ? (
                                    
                                        <Alert show={invaliddata}>
                                           <div className = "container text-center">
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
                                    Add Dishes -  Featured
                                </div>
                                <div class="card-body">
                                    <div className='modal-gap'>
                                        <label style={{ color: "black" }}> Dish Name </label>
                                        <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Dish Name" name={dishname} value={dishname} onChange={(e) => setDishname(e.target.value)} />
                                    </div>
                                    <div className='modal-gap'>
                                        <label style={{ color: "black" }}> Dish Rate </label>
                                        <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='Dish Rate' name={dishrate} value={dishrate} onChange={(e) => setDishrate(e.target.value)} />
                                    </div>
                                    <div className='modal-gap'>
                                        <label style={{ color: "black" }}> Dish Type </label>
                                        <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='Dish-Type' name={dishtype} value={dishtype} onChange={(e) => setDishtype(e.target.value)} />
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
                                className="my-modal"
                            >
                                <Modal.Header closeButton>
                                    <Modal.Body className="text-center">
                                        {error}
                                    </Modal.Body>
                                </Modal.Header>
                            </Modal>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default AddDishes