import React, {useState, useEffect} from 'react';
import Navbar from './Navbar';
import Loading from './Loading';
import axios from 'axios';
import { Link, useParams } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import CustomError from './CustomError';
import changeScreen from './Action';
import Variables from './Variables';

const EditDish = () => {

  const { id } = useParams();

  const [dishtype, setDishtype] = useState();
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState(false);

  // Loader
  const[loading, setLoading] = useState(false);

  const splitedIds = id.split(/[-]/);

  const token = localStorage.getItem("token");

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

  const ShowSuccess = () => {
    setSuccess(!success);
  }

  // Adding data to the database
  const addData = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(dishtype);
    const credentials = {
      dishtype : dishtype
    }
    axios.post(`${Variables.hostId}/${splitedIds[0]}/createdishtype`, credentials)
      .then(res => {
        if(res.data.success){
          setLoading(false);
          setSuccess(true);
          setMessage(res.data.message);
          setDishtype("");
        } else {
          setLoading(false);
          setSuccess(true);
          setMessage(res.data.message);
          setDishtype("");
        }
      })
  }


  useEffect(() => {
    const interval = setInterval(() => {
      AuthVerify();
    }, 9000)
    return () => clearInterval(interval)
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
            <div className='align-down'>
              <div className='container text-center' style={{ display: "flex", justifyContent: "center" }}>
                <div class="card text-center" style={{ width: "50vh" }}>
                  <div class="card-header" style={{ color: "black" }}>
                    Edit Dish Data Type - Feautured
                  </div>
                  <div class="card-body">
                    <div className='modal-gap'>
                      <label style={{ color: "black" }}> Dish Type </label>
                      <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Dish Type" value = {dishtype} name = {dishtype} onChange = {((e) => setDishtype(e.target.value))}/>
                    </div>
                    <br />
                    <button className='btn btn-info' onClick={addData}> Add Data </button>
                  </div>
                </div>
              </div>
            </div>
            <div>
              {
                success == undefined ? (
                  <div>
                  </div>
                ) : (
                    <Modal
                      show={success}
                      onHide={ShowSuccess}
                      backdrop="static"
                      keyboard={false}
                    >
                      <Modal.Header closeButton>
                          <Modal.Body className="text-center">
                              {message}
                          </Modal.Body>
                      </Modal.Header>
                    </Modal>
                )
              }
            </div>
          </div>
          )
        ) : (
          <CustomError />
        )
      }
    </div>
  )
}

export default EditDish