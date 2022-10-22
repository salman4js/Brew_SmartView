import React, { useState } from 'react';
import { saveAs } from "file-saver";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Variables from './Variables';

const GenerateQR = (props) => {

    const [show, setShow] = useState(false);
    const [data, setData] = useState();

    //Loader
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        setShow(!show);
    }

    const DownloadQR = () => {
        saveAs(data, `${props.roomno}.jpg`);
        handleClose();
    }

    const generateQR = () => {
        setLoading(true);
        const roomspec = props.lodgeid.concat('-' + props.roomid);
        console.log(roomspec);
        const credentials = {
            room_spec_id: roomspec
        }
        axios.post(`${Variables.hostId}/${props.id}/generator`, credentials)
            .then(res => {
                if (res.data.success) {
                    setLoading(false);
                    console.log("Generated successfully!");
                    setData(res.data.message);
                    handleClose();
                } else {
                    setLoading(false);
                    console.log(res.data.message)
                }
            })
    }

    return (
        <div class="col-4" style={{ paddingBottom: "10vh" }}>
            <div class="card text-center">
                <div class="card-header" style={{ color: "black" }}>
                    <strong>Room No : {props.roomno}</strong>
                </div>
                <div class="card-body">
                    <p style={{ color: "black" }}>Engaged : {props.engaged}</p>
                    <p style={{ color: "black" }}>Bed Count : {props.bedcount}</p>
                    <p style={{ color: "black" }}> Room Type : {props.roomtype}</p>
                </div>
                <div className='btn btn-secondary' onClick={generateQR}>
                    Generate QR
                </div>
                <Modal
                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>QR Code - Room No: {props.roomno} - Feautured</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <img src={data} alt="Girl in a jacket" width="450" height="400" />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="outline-primary" onClick={DownloadQR}>Download</Button>
                    </Modal.Footer>
                </Modal>
                
            </div>
        </div >
    )
}

export default GenerateQR