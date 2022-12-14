import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Variables from './Variables';
import Loading from "./Loading";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";
import Button from 'react-bootstrap/Button';
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import CustomError from './CustomError';
import changeScreen from './Action';


const AddDishes = () => {

    const { id } = useParams();
    const token = localStorage.getItem("token");
    const splitedIds = id.split(/[-]/);

    // Loader
    const [loading, setLoading] = useState(false);


    // Add Dishes
    const [dishname, setDishname] = useState("");
    const [dishrate, setDishrate] = useState("");
    const [dishtype, setDishtype] = useState("");

    // Error box
    const [error, setError] = useState("");
    const [invaliddata, setInvaliddata] = useState(false);
    const [show, setShow] = useState(false);

    // Options
    const [options, setOptions] = useState([]);


    // Process Data
    const processData = () => {
        setLoading(true);
        console.log("Loader function has been called")
        const isnum = /^\d+$/;
        if (!isnum.test(dishrate)) {
            setLoading(false);
            setShow(true)
            setError("Dish Rate should be in Numbers format...")
        } else {
            const credentials = {
                dishname: dishname,
                dishrate: dishrate,
                dishtype: dishtype
            }
            axios.post(`${Variables.hostId}/${splitedIds[0]}/adddish`, credentials)
                .then(res => {
                    if (res.data.success) {
                        setLoading(false);
                        console.log("Loader function has been called with 200");
                        setError(res.data.message)
                        setShow(true)
                        setDishname("");
                        setDishrate("");
                        setDishtype("");
                    } else {
                        setLoading(false);
                        setError(res.data.message);
                        console.log("Loader has been called with 404");
                        setInvaliddata(true)
                    }
                })
        }
    }

    const handleClose = () => {
        setShow(!show)
    }

    const handleInvalid = () => {
        console.log(invaliddata)
        setInvaliddata(false);
    }

    // Dish Type data.
    const getData = () => {
        setLoading(true);
        axios.post(`${Variables.hostId}/${splitedIds[0]}/alldishtype`)
            .then(res => {
                if (res.data.success) {
                    setOptions(res.data.message);
                    setLoading(false);
                } else {
                    setLoading(false);
                    return;
                }
            })
    }

    useEffect(() => {
        setTimeout(handleInvalid, 4000)
    }, [invaliddata])


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

    useEffect(() => {
        getData();
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
                                                    Add Dishes -  Featured
                                                </div>
                                                <div class="card-body">
                                                    <div className='modal-gap'>
                                                        <label style={{ color: "black" }}> Dish Type </label>
                                                        <select class="form-select" aria-label="Default select example" onChange={(e) => setDishtype(e.target.value)}>
                                                            <option selected>Choose...</option>
                                                            {
                                                                options.map((item, key) => {
                                                                    return (
                                                                        <option>{item.dishType}</option>
                                                                    )
                                                                })
                                                            }
                                                        </select>
                                                    </div>
                                                    <div className='modal-gap'>
                                                        <label style={{ color: "black" }}> Dish Name </label>
                                                        <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Dish Name" name={dishname} value={dishname} onChange={(e) => setDishname(e.target.value)} />
                                                    </div>
                                                    <div className='modal-gap'>
                                                        <label style={{ color: "black" }}> Dish Rate </label>
                                                        <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='Dish Rate' name={dishrate} value={dishrate} onChange={(e) => setDishrate(e.target.value)} />
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
                ) : (
                    <div>
                        <CustomError />
                    </div>
                )
            }
        </div>
    )
}

export default AddDishes;
