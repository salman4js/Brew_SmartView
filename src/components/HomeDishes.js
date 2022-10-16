import React, { useEffect, useState } from 'react';
import Variables from './Variables';
import Loading from './Loading';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";

const HomeDishes = (props) => {

    const [show, setShow] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showerror, setShowerror] = useState(false);
    const [showmodal, setShowmodal] = useState();


    const [quantity, setQuantity] = useState();
    const [roomno, setRoomno] = useState();
    const [comments, setComments] = useState();
    const [roomid, setRoomid] = useState();

    // Occupied
    const [occupied, setOccupied] = useState([]);

    //Loader
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        setShow(!show);
    }

    const handleModal = () => {
        setShowmodal(!showmodal)
    }


    const handleCloseModal = () => {
        setShowerror(!showerror)
    }

    // Get occupied rooms only.

    const Occupied = () => {
        axios.post(`${Variables.hostId}/${props.lodgeid}/occupied`)
            .then(res => {
                if (res.data.success) {
                    setOccupied(res.data.message)
                } else {
                    setOccupied("Some internal error occured, please try again later!");
                }
            })
    }

    const processData = async () => {
        setLoading(true);
        const validation = {
            roomno: roomno,
            lodgeid: props.lodgeid
        }
        axios.post(`${Variables.hostId}/${props.lodgeid}/getroomid`, validation)
            .then(res => {
                if (res.data.success) {
                    res.data.message.map((item, key) => {
                        processReq(item._id)
                    })
                }
            })
    }

    const processReq = async (roomid) => {
        const credentials = {
            dishname: props.dishname,
            quantity: quantity,
            comments: comments,
            roomno: roomno,
            roomid: roomid,
            lodgeid: props.lodgeid,
            dishrate: props.dishrate
        }
        await axios.post(`${Variables.hostId}/${props.id}/adddishroom`, credentials)
            .then(res => {
                if (res.data.success) {
                    handleClose();
                    if (res.data.message == "false") {
                        setShowerror(true);
                        setSuccess(`The room no: ${roomno} is not engaged`)
                    } else {
                        setLoading(false);
                        setShowerror(true);
                        setSuccess(res.data.message)
                        props.setLoad(!props.setLoad);
                    }
                } else {
                    setLoading(false);
                    setShowerror(true);
                    setSuccess(res.data.message)
                }
            })
    }

    useEffect(() => {
        Occupied();
    }, [])

    return (
         
            loading ? (
              <Loading />
            ) : (
              <div class="col-4" style={{ paddingBottom: "10vh" }}>

                  <div class="card text-center">
                      <div class="card-header" style={{ color: "black" }}>
                          <strong>Dish Type : {props.dishtype}</strong>
                      </div>
                      <div class="card-body">
                          <p style={{ color: "black" }}>Dish Name : {props.dishname}</p>
                          <p style={{ color: "black" }}>Dish Rate : {props.dishrate}</p>
                          <p style={{ color: "black" }}> Available : {props.available}</p>
                      </div>
                      <Modal
                          show={show}
                          aria-labelledby="contained-modal-title-vcenter"
                          centered
                      >
                          <Modal.Header>
                              <Modal.Title id="contained-modal-title-vcenter">
                                  {props.dishname} - {props.dishrate}rs
                              </Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                              <div className="modal-top text-center">
                                  <div className="modal-gap">
                                      <label style={{ color: "black" }}> Quantity </label>
                                      <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Quantity" name={quantity} value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                                  </div>
                                  <div className='modal-gap'>
                                      <label style={{ color: "black" }}> Room No </label>
                                      <select class="form-select" aria-label="Default select example" onChange={(e) => setRoomno(e.target.value)}>
                                          <option selected>Choose...</option>
                                          {
                                              occupied.map((item, key) => {
                                                  return (
                                                      <option>{item.roomno}</option>
                                                  )
                                              })
                                          }
                                      </select>

                                  </div>
                                  <div className='modal-gap'>
                                      <label style={{ color: "black" }}> Comments </label>
                                      <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='Comments' name={comments} value={comments} onChange={(e) => setComments(e.target.value)} />
                                  </div>
                              </div>
                          </Modal.Body>
                          <Modal.Footer>
                              <Button className='btn btn-secondary' onClick={handleClose}>Close</Button>
                              <Button className="btn btn-info" onClick={processData}>Save & Close</Button>
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
                      {
                          props.available == "Out Of Stock" ? (
                              <div className="btn btn-dark">
                                  Order
                              </div>
                          ) : (
                              <div className="btn btn-success" onClick={handleClose}>
                                  Order
                              </div>
                          )
                      }
                  </div>
              </div>
            )
    )
}

export default HomeDishes