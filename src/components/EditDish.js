import React, {useState, useEffect} from 'react';
import Navbar from './Navbar';
import { Link, useParams } from "react-router-dom";
import CustomError from './CustomError';
import changeScreen from './Action';

const EditDish = () => {

  const { id } = useParams();

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
                      <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Dish Type" />
                    </div>
                    <br />
                    <button className='btn btn-info'> Add Data </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <CustomError />
        )
      }
    </div>
  )
}

export default EditDish