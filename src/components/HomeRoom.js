import React, { useState } from 'react';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Variables from './Variables';
import Loading from './Loading';
import Table from './Table';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ModalCheckOut from './ModalCheckOut';



const HomeRoom = (props) => {

    const current = new Date();
    const date = `${current.getFullYear()}/${current.getMonth()+1}/${current.getDate()}`;

    const [show, setShow] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showerror, setShowerror] = useState(false);
    const [userdata, setUserdata] = useState([]);
    const [showGeneratedBill, setShowGeneratedBill] = useState(false);
    const [amount, setAmount] = useState();
    
    //Loader--Modal
    const [loading, setLoading] = useState(false);

    // Customer Data
    const [customername, setCustomername] = useState();
    const [customerphonenumber, setCustomerphonenumber] = useState();
    const [secondphonenumber, setSecondphonenumber] = useState();
    const [adults, setAdults] = useState();
    const [childrens, setChildrens] = useState();
    const [day, setDay] = useState(null);
    const [stayeddays, setStayeddays] = useState();
    const [checkoutdate, setCheckoutdate] = useState();
    const [aadhar, setAadhar] = useState();
    const [showmodal, setShowmodal] = useState();
    const [userid, setUserid] = useState();
    const [dishrate, setDishrate] = useState([]);
    const [totaldishrate, setTotaldishrate] = useState([]);

    const handleClose = () => {
        setShow(!show)
    }

    const handleModal = () => {
        setShowmodal(!showmodal)
    }


    const handleCloseModal = () => {
        setShowerror(!showerror)
    }

    const handleCloseGeneratedBill = () => {
        setShowGeneratedBill(!showGeneratedBill);
    }


    // Add Data to the model
    const processData = () => {
        setLoading(true);
        const isnum = /^\d+$/;
        if(!isnum.test(customerphonenumber)){
            setLoading(false);
            setShowerror(true);
            setSuccess("Phone Number is not valid...")
        } else if(!isnum.test(secondphonenumber)){
            setLoading(false);
            setShowerror(true);
            setSuccess("Phone Number is not valid...")
        } else if(!isnum.test(adults)){
            setLoading(false);
            setShowerror(true);
            setSuccess("Adults count should be in Numbers format...")
        } else if(!isnum.test(childrens)){
            setLoading(false);
            setShowerror(true);
            setSuccess("Childrens count should be in Numbers format...")
        } else if(!isnum.test(aadhar)){
            setLoading(false);
            setShowerror(true);
            setSuccess("Aadhar Number should be in Number format...")
        } else {
            const credentials = {
                customername: customername,
                phonenumber: customerphonenumber,
                secondphonenumber: secondphonenumber,
                adults: adults,
                childrens: childrens,
                aadhar: aadhar,     
                checkin: date,
                roomid: props.roomid,
                roomno: props.roomno
            }
            axios.post(`${Variables.hostId}/${props.lodgeid}/adduserrooms`, credentials)
                .then(res => {
                    if (res.data.success) {
                        setLoading(false);
                        handleClose();
                        setShowerror(true);
                        setSuccess(res.data.message)
                        props.setLoad(!props.setLoad);
                    } else {
                        setLoading(false);
                        setShowerror(true);
                        setSuccess(res.data.message)
                    }
                })
        }
    }

    // Retrieve User Room data from the API
    const getUserData = () => {
        console.log(props.roomid);
        const credentials = {
            roomid: props.roomid
        }
        axios.post(`${Variables.hostId}/${props.id}/userroom`, credentials)
            .then(res => {
                if (res.data.success) {
                    setUserdata(res.data.message);
                    handleModal();
                } else {
                    setShowerror(true);
                    setSuccess(res.data.message)
                }
            })
    }

    // Check Out Customer Data
    const clearData = async () => {

        var totalDishrate = 0;

        console.log(stayeddays);
        console.log(stayeddays.slice(0,1));
        console.log(checkoutdate);
        const credentials = {
            userid: userid,
            roomid: props.roomid,
            stayeddays: stayeddays,
            checkoutdate: checkoutdate,
            roomtype: props.roomtype
        }

        const generation = {
            roomtype: props.roomtype,
            stayeddays: stayeddays.slice(0, 1),
            roomid: props.roomid,
            lodgeid : props.lodgeid
        }

        const generateDishRate = {
            roomid: props.roomid
        }

        await axios.post(`${Variables.hostId}/${props.lodgeid}/dishuserrate`, generateDishRate)
            .then(res => {
                console.log("Accessing Dish Rate Generator!")
                if (res.data.success) {
                    setDishrate(res.data.message)
                    console.log(res.data.message);
                } else {
                    setDishrate("User Dish Prices can't be retrived at this moment!")
                }
            })

        console.log(credentials);
        // axios.post(`${Variables.hostId}/${props.id}/deleteuser`, credentials)
        // .then(res => {
        //     if(res.data.success){
        //         handleModal();
        //         setShowerror(true);
        //         setSuccess(res.data.message)
        //         props.setLoad(!props.setLoad);
        //     } else {
        //         setShowerror(true);
        //         setSuccess(res.data.message)
        //     }
        // })
        await axios.post(`${Variables.hostId}/${props.lodgeid}/generatebill`, generation)
            .then(res => {
                if (res.data.success) {
                    handleCloseGeneratedBill();
                    setAmount(res.data.message);
                } else {
                    setShowerror(true);
                    setSuccess(res.data.message)
                }
            })

        await axios.post(`${Variables.hostId}/${props.lodgeid}/dishuserrate`, generateDishRate)
        .then(res => {
            if(res.data.success){
                res.data.message.map((item,key) => {
                    for(var i = 0; i < (res.data.message).length; i++){
                        totalDishrate += Number(item.dishRate) * Number(item.quantity)
                    }
                })
            }
            setTotaldishrate(Number(totalDishrate) + Number(amount));
            console.log(Number(totalDishrate));
        })
    }

    const checkedOut = () => {
        handleCloseGeneratedBill();
        const credentials = {
            userid: userid,
            roomid: props.roomid,
            stayeddays: stayeddays,
            checkoutdate: checkoutdate,
            roomtype: props.roomtype
        }
        axios.post(`${Variables.hostId}/${props.id}/deleteuser`, credentials)
            .then(res => {
                if (res.data.success) {
                    handleModal();
                    setShowerror(true);
                    setSuccess(res.data.message)
                    props.setLoad(!props.setLoad);
                    window.location.reload(false);
                } else {
                    setShowerror(true);
                    setSuccess(res.data.message)
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
                          <p style ={{color: "black"}}> Price Per Day : {props.price}</p>
                      </div>

                      {/* // Check In Modal */}
                      <Modal
                          show={show}
                          aria-labelledby="contained-modal-title-vcenter"
                          centered
                          background="static"
                          className="text-center"
                      >
                          <Modal.Header>
                              <Modal.Title id="contained-modal-title-vcenter">
                                  Check In - Feautured
                              </Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                              <h4 className='strong'>{props.roomno}</h4>

                              <div className="modal-gap">
                                  <label style={{ color: "black" }}> Customer Name </label>
                                  <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Customer Name" name={customername} value={customername} onChange={(e) => setCustomername(e.target.value)} />
                              </div>
                              <div className='modal-gap'>
                                  <label style={{ color: "black" }}> Customer Phone Number </label>
                                  <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='Customer Phone Number' name={customerphonenumber} value={customerphonenumber} onChange={(e) => setCustomerphonenumber(e.target.value)} />
                              </div>
                              <div className='modal-gap'>
                                  <label style={{ color: "black" }}> Customer Second Phone Number </label>
                                  <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='Customer Second Phone Number' name={secondphonenumber} value={secondphonenumber} onChange={(e) => setSecondphonenumber(e.target.value)} />
                              </div>
                              <div className='modal-gap'>
                                  <label style={{ color: "black" }}> Adults </label>
                                  <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='No.of.adults' name={adults} value={adults} onChange={(e) => setAdults(e.target.value)} />
                              </div>
                              <div className='modal-gap'>
                                  <label style={{ color: "black" }}> Childrens If Any! </label>
                                  <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='No.of.childrens' name={childrens} value={childrens} onChange={(e) => setChildrens(e.target.value)} />
                              </div>
                              <div className='modal-gap'>
                                  <label style={{ color: "black" }}> Aadhar Number of anyone adult </label>
                                  <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='Aadhar Card Number' name={aadhar} value={aadhar} onChange={(e) => setAadhar(e.target.value)} />
                              </div>
                              <div className='modal-gap'>
                                  <label style={{ color: "black" }}> Date Of Check In - (Default Date is Today's Date!) </label>
                                  <DatePicker style={{ color: "black" }} className="form-control" selected={Date.now()} dateFormat='y-MM-dd' minDate={new Date()} isClearable />
                              </div>

                          </Modal.Body>
                          <Modal.Footer>
                              <Button className="btn btn-secondary" onClick={handleClose}>Close</Button>
                              <Button className='btn btn-info' onClick={processData}> Save and Close </Button>
                          </Modal.Footer>
                      </Modal>

                      {/* // Check Out Modal */}
                      <Modal
                          aria-labelledby="contained-modal-title-vcenter"
                          centered
                          background="static"
                          show={showmodal}
                      >
                          <Modal.Header>
                              <Modal.Title id="contained-modal-title-vcenter">
                                  Check Out - Feautured
                              </Modal.Title>
                          </Modal.Header>
                          {
                              userdata.map((item, key) => {
                                  return (
                                      <ModalCheckOut roomno={props.roomno} username={item.username} phone={item.phonenumber} adults={item.adults} childrens={item.childrens} user={item._id} userid={setUserid} checkin={item.dateofcheckin} stayeddays={setStayeddays} checkoutdate={setCheckoutdate} />
                                  )
                              })
                          }
                          <Modal.Footer>
                              <Button className="btn btn-secondary" onClick={handleModal}>Close</Button>
                              <Button className="btn btn-info" onClick={clearData}> Check-Out & Generate Bill </Button>
                          </Modal.Footer>
                      </Modal>

                      {/* Generated Bill */}
                      <Modal
                          show={showGeneratedBill}
                          onHide={handleCloseGeneratedBill}
                          backdrop="static"
                          keyboard={false}
                      >
                          <Modal.Header closeButton>
                              <Modal.Title>Generated Bill - Feautured</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                              <h5>Amount to be paid for the suite - {amount}</h5>
                              <table className="table">
                                  <thead>
                                      <tr>
                                          <th>
                                              Dish Name
                                          </th>
                                          <th>
                                              Quantity
                                          </th>
                                          <th>
                                              Dish Rate
                                          </th>
                                      </tr>
                                      {
                                          dishrate.map((item, key) => {
                                              return (
                                                  <Table dishName = {item.dishName} quantity = {item.quantity} dishRate = {item.dishRate} setTotaldishrate = {setTotaldishrate} roomid = {props.roomid}/>
                                              )
                                          })
                                      }
                                  </thead>
                              </table>
                              <h5 style = {{fontWeight : "bold"}}>Total amount to be paid - {totaldishrate} Rs</h5>
                          </Modal.Body>
                          <Modal.Footer>
                              <Button variant="secondary" onClick={handleCloseGeneratedBill}>
                                  Not Paid
                              </Button>
                              <Button variant="primary" onClick={checkedOut}>Paid</Button>
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
                          (props.engaged == "true" ? (
                              <div className="btn btn-dark" onClick={getUserData}>
                                  Check-Out
                              </div>
                          ) : (
                              <div className="btn btn-info" onClick={handleClose}>
                                  Check-In
                              </div>

                          )
                          )
                      }
                      {
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
                      }
                  </div>
              </div>
    )
}

export default HomeRoom
