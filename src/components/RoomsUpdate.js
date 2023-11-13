import React, { useState, useEffect } from 'react';
import Variables from './Variables';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from 'axios';
import { editRoomModel, deleteRoomModel } from './NewDashboard/property.container/checkin.view/checkin.form.utils';

const RoomsUpdate = (props) => {

    const [show, setShow] = useState(false);
    const [showerror, setShowerror] = useState(false);
    const [option, setOption] = useState([]);
    const [deletemodal, setDeletemodal] = useState(false);
    const [occupied, setOccupied] = useState(false);
    const [closeAlert, setCloseAlert] = useState(false);


    const splitedIds = (props.id).split(/[-]/);
    //console.log(splitedIds[0])


    // Udpate Rooms
    const [roomno, setRoomno] = useState(props.roomno);
    const [floorNo, setFloorNo] = useState(props.floorNo);
    const [bedcount, setBedcount] = useState(props.bedcount);
    const [suitetype, setSuitetype] = useState(props.roomtype);
    const [success, setSuccess] = useState();
    const [roomState, setRoomState] = useState();

    //Loader--Modal
    const [loading, setLoading] = useState(false);

    // When the room data is being updated.
    const updateRooms = async () => {
        setLoading(true);
        const data = {
            floorNo: floorNo,
            roomno: roomno,
            bedcount: bedcount,
            suitename: suitetype,
            roomStatusConstant: 'customState',
            roomStatus: roomState,
            roomId: props.roomid,
            lodgeId: props.lodgeId
        };
        
        const result = await editRoomModel(data);
        if (result.data.success) {
            setLoading(false);
            setShowerror(true)
            setSuccess(result.data.message);
            handleClose();
        } else {
            setLoading(false);
            setShowerror(true)
            setSuccess(result.data.message)
        };
        props.load(); // Reload the component everytime when the component data updated.
    };

    // Getting Options
    const getRoomTypes = () => {
        axios.post(`${Variables.hostId}/${splitedIds[0]}/allroomtype`)
            .then(data => {
                setOption(data.data.message);
            })
    };

    // Delete Room Data...
    const deleteRoom = async() => {
        setLoading(true);
        const data = {
            roomId: props.roomid
        };
        const result = await deleteRoomModel(data);
        if(result.data.success){
          setLoading(false);
          setShowerror(true);
          setSuccess(result.data.message);
          deleteModal();
        } else {
          setLoading(false);
          setShowerror(true);
          setSuccess(result.data.message)
          deleteModal();
        }
        props.load(); // Reload the component everytime when the component data updated.result
    };

    const handleClose = () => {
        setShow(!show);
    };

    const handleCloseModal = () => {
        setShowerror(!showerror)
    };

    const handleCloseAlert = () => {
        setCloseAlert(!closeAlert);
    };

    const deleteModal = () => {
        if (props.engaged === "false") {
            setDeletemodal(!deletemodal)
        } else {
            setOccupied(!occupied);
        }
    };

    const Occupied = () => {
        setOccupied(!occupied);
    };
    
    // Dropdown with room status!
    function showDropdownWithRoomStatus(){
      if(props.roomStatusConstant !== 'customState'){
        return(
          props.roomStates.map((item,key) => {
            return(
              <option>{item.statusName}</option>
            )
          })
        )
      } else {
        return(
          <option>Release</option>
        )
      }
    };

    useEffect(() => {
        getRoomTypes();
    }, [])

    return (

        <div class="col-4" style={{ paddingBottom: "10vh" }}>
            <div class="card text-center">
                <div class="card-header" style={{ color: "black" }}>
                    <strong>Room No : {props.roomno} </strong>
                </div>
                <div class="card-body">
                    <p style={{ color: "black" }}>Engaged : {props.engaged}</p>
                    <p style={{ color: "black" }}>Bed Count : {props.bedcount}</p>
                    <p style={{ color: "black" }}> Room Type : {props.roomtype}</p>
                    <p style = {{color  :"black"}}>Price Per Day : {props.price} </p>
                </div>
                {
                    props.engaged == "false" ? (
                        <div className='btn btn-success' onClick={handleClose}>
                            Update Room Data
                        </div>
                    ) : (
                        <div className='btn btn-dark' onClick={handleCloseAlert}>
                            Update Room Data
                        </div>
                    )
                }
                {props.canDelete && (
                  <div className = "btn btn-danger minute-space" onClick={deleteModal}>
                          Delete Room Data
                  </div>
                )}
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
                        Update Room Data - Featured
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Room No : {props.roomno}</h4>
                    <div className='modal-gap'>
                        <label style={{ color: "black" }}> Room No </label>
                        <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Room No" name={roomno} value={roomno} onChange={(e) => setRoomno(e.target.value)} />
                    </div>
                    <div className='modal-gap'>
                        <label style={{ color: "black" }}> Floor No </label>
                        <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Floor No" name={floorNo} value={floorNo} onChange={(e) => setFloorNo(e.target.value)} />
                    </div>
                    <div className='modal-gap'>
                        <label style={{ color: "black" }}> Bed Count </label>
                        <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='Bed Count' name={bedcount} value={bedcount} onChange={(e) => setBedcount(e.target.value)} />
                    </div>
                    <div className='modal-gap'>
                        <label style={{ color: "black" }}> Suite Type </label>
                        <select class="form-select" aria-label="Default select example" onChange={(e) => setSuitetype(e.target.value)}>
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
                        <label style={{ color: "black" }}> Room State </label>
                        <select class="form-select" aria-label="Default select example" onChange={(e) => setRoomState(e.target.value)}>
                            <option selected>Choose...</option>
                            {showDropdownWithRoomStatus()}
                        </select>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="btn btn-secondary" onClick={handleClose}>Close</Button>
                    <Button className='btn btn-info' onClick={updateRooms}> Save and Close </Button>
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
                {
                    closeAlert ? (
                        <Modal
                            show={closeAlert}
                            onHide={handleCloseAlert}
                            backdrop="static"
                            keyboard={false}
                        >
                            <Modal.Header closeButton>
                                <Modal.Body className="text-center">
                                    Room Already Occupied, Cannot edit occupied room data!
                                </Modal.Body>
                            </Modal.Header>
                        </Modal>
                    ) : (
                        <div>
                        </div>
                    )
                }
            </div>
            <div>
                {
                    deletemodal ? (
                        <Modal
                            show={deletemodal}
                            onHide={deleteModal}
                            backdrop="static"
                            keyboard={false}
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>Workflow Panel</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Do you really want to delete {props.roomno}'s data permanently?
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={deleteModal}>
                                    No
                                </Button>
                                <Button variant="primary" onClick={deleteRoom}>Yes</Button>
                            </Modal.Footer>
                        </Modal>
                    ) : (
                        <div>
                        </div>
                    )
                }
            </div>
            <div>
                {
                    occupied ? (
                        <Modal
                            show={occupied}
                            onHide={Occupied}
                            backdrop="static"
                            keyboard={false}
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>Workflow Panel</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Room no: {props.roomno} already occupied, Can't delete occupied room data!
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={Occupied}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    ) : (
                        <div>
                        </div>
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
                                Updating, please wait!
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

export default RoomsUpdate