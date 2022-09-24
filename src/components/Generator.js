import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Variables from './Variables';
import { Link, useParams } from "react-router-dom";
import axios from 'axios';
import changeScreen from './Action';
import CustomError from './CustomError';
import GenerateQR from './GenerateQR';

const Generator = () => {

  const { id } = useParams();

  const splitedIds = id.split(/[-]/);

  const [data, setData] = useState([]);

  const getData = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setData(false);
    } else {
      axios.post(`${Variables.hostId}/${splitedIds[0]}/roomlodge`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        }
      })
        .then(res => {
          if (res.data.success) {
            setData(res.data.message)
          } else {
            localStorage.clear();
            changeScreen();
          }
        })
    }
  }

  useEffect(() => {
    getData();
  }, [])

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
        data ? (
          <div>
            <Navbar id={id} name={splitedIds[1]} />
            <div>
              <div className='grid-system'>
                <div class="container">
                  <div class="row">
                    {
                      data.map((item, key) => {
                        return (
                          <GenerateQR roomno={item.roomno} engaged={item.isOccupied} roomtype={item.suiteName} bedcount={item.bedCount} roomid={item._id} id={id} lodgeid={splitedIds[0]} />
                        )
                      })
                    }
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

export default Generator