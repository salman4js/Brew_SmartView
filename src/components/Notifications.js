import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Notify from './Notify';
import NoMessage from './NoMessage';
import Variables from './Variables';
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import CustomError from './CustomError';
import changeScreen from './Action';


const Notifications = () => {

    const { id } = useParams();
    const token = localStorage.getItem("token");
    const splitedIds = id.split(/[-]/);

    const [data, setData] = useState([]);

    const [load, setLoad] = useState(false);

    const [reboot, setReboot] = useState();


    const [check, setCheck] = useState([]);

    const getData = () => {
        axios.post(`${Variables.hostId}/${splitedIds[0]}/notifications`)
            .then(res => {
                console.log(res.data.message)
                if(res.data.success){
                    setData(res.data.message)
                    setLoad(!load)
                } else {
                    localStorage.clear();
                    changeScreen();
                }
            })
    }

    const checkDelivered = () => {
        console.log("Delivered", load);
        axios.post(`${Variables.hostId}/${splitedIds[0]}/checkdelivered`)
            .then(res => {
                console.log(res.data.message)
                if(res.data.success){
                    setCheck(res.data.message)
                    setLoad(!load)
                } else {
                    localStorage.clear();
                    changeScreen();
                }
            })
        console.log(typeof (check))
    }

    useEffect(() => {
        getData();
        checkDelivered();
    }, [reboot]);

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
                        <Navbar id={id} />
                        <div className="notifications-service">
                            <div className='container'>
                                <div class="container">
                                    <div class="row">
                                        <div class="col-sm">
                                            <div className="container text-center strong" style={{ fontSize: "22px" }}>In-Progress State</div>
                                            <div class="card">
                                                <div class="card-body">
                                                    {

                                                        check.length <= 0 ? (
                                                            <NoMessage />
                                                        ) : (
                                                            check.map((item, key) => {
                                                                return (
                                                                    <Notify dishname={item.dishName} roomno={item.roomno} delivered={item.delivered} comments={item.comments} setReboot={setReboot} quantity={item.quantity} id={id} userdishid={item._id} />
                                                                )
                                                            })
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-sm">
                                            <div className="container text-center strong" style={{ fontSize: "22px" }}>Delivered State</div>
                                            <div class="card">
                                                <div class="card-body">
                                                    {
                                                        data.length <= 0 ? (
                                                            <NoMessage />
                                                        ) : (
                                                            data.map((item, key) => {
                                                                return (
                                                                    <Notify dishname={item.dishName} roomno={item.roomno} delivered={item.delivered} reboot={setReboot} comments={item.comments} quantity={item.quantity} id={id} userdishid={item._id} />
                                                                )
                                                            })
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <CustomError />
                    </div>
                )
            }
        </div>
    )
}

export default Notifications;