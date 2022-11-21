import React, { useEffect, useState } from 'react';
import Variables from './Variables';
import Loading from "./Loading";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { getMouseEventOptions } from '@testing-library/user-event/dist/utils';


const DishUpdate = (props) => {

    const [show, setShow] = useState(false);
    const [showerror, setShowerror] = useState(false);

    // Loade--Modal
    const [loading, setLoading] = useState(false);

    // Options
    const [options, setOptions] = useState([]);

    // Udpate Rooms
    const [dishname, setDishname] = useState(props.dishname);
    const [dishrate, setDishrate] = useState(props.dishrate);
    const [dishtype, setDishtype] = useState(props.dishtype);
    const [available, setAvailable] = useState(props.engaged);

    const [success, setSuccess] = useState();

    const updateDish = () => {
        setLoading(true);
        const credentials = {
            dishname: dishname,
            dishrate: dishrate,
            dishtype: dishtype,
            available: available,
            dishId: props.dishid
        }
        axios.post(`${Variables.hostId}/${props.id}/dishupdater`, credentials)
            .then(res => {
                console.log(res.data);
                if (res.data.success) {
                    setLoading(false);
                    setShowerror(true);
                    setSuccess(res.data.message)
                    handleClose();
                    props.setLoad(!props.setLoad)
                } else {
                    setLoading(false);
                    setShowerror(true);
                    setSuccess(res.data.message)
                    props.setLoad(!props.setLoad)
                }
            })
    }

    const handleClose = () => {
        setShow(!show);
    }

    const handleCloseModal = () => {
        setShowerror(!showerror)
    }

    
    return (
                <div class="col-4" style={{ paddingBottom: "10vh" }}>
                    <div class="card text-center">
                        <div class="card-header" style={{ color: "black" }}>
                            <strong>Dish Type:  {props.dishtype}</strong>
                        </div>
                        <div class="card-body">
                            <p style={{ color: "black" }}>Dish Name: {props.dishname}</p>
                            <p style={{ color: "black" }}>Dish Rate: {props.dishrate}</p>
                            <p style={{ color: "black" }}>Stock: {props.engaged}</p>
                        </div>
                        <div className='btn btn-success' onClick={handleClose}>
                            Update Dish Data
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
                                Update Dish Data - Featured
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <h4>Dish Name : {props.dishname}</h4>
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
                                <div class="input-group mb-3">
                                    <select class="custom-select" id="inputGroupSelect01"  onChange={(e) => setDishtype(e.target.value)}>
                                        <option selected>{dishtype}</option>
                                        {
                                            props.options.map((item,key) => {
                                                if(item.dishType == dishtype){
                                                    return;
                                                } else {
                                                    return(
                                                        <option>
                                                            {item.dishType}
                                                        </option>
                                                    )
                                                }
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="modal-gap">
                                <label style={{ color: "black" }}> Stock </label>
                                <div class="input-group mb-3">
                                    <select class="custom-select" id="inputGroupSelect01" onChange={(e) => setAvailable(e.target.value)}>
                                        <option selected> Choose... </option>
                                        {
                                            props.engaged == "In Stock" ? (
                                                <option name={available} value="Out Of Stock"> Out Of Stock </option>

                                            ) : (
                                                <option name={available} value="In Stock"> In Stock </option>
                                            )
                                        }
                                    </select>
                                </div>
                            </div>

                        </Modal.Body>
                        <Modal.Footer>
                            <Button className="btn btn-secondary" onClick={handleClose}>Close</Button>
                            <Button className='btn btn-info' onClick={updateDish}> Save and Close </Button>
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
                    <div>
                        {
                            loading ? (
                                <Modal
                                show={loading}
                                backdrop="static"
                            >
                                <Modal.Body>
                                Updaing, please wait!
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

export default DishUpdate