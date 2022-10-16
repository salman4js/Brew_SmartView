import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import CustomError from './CustomError';
import Variables from './Variables';
import Loading from './Loading';
import UserDbComp from './UserDbComp';
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import changeScreen from './Action';

const UserDb = () => {

    const { id } = useParams();
    const splitedIds = id.split(/[-]/);

    const [data, setData] = useState([]);

    //Loader
    const [loading, setLoading] = useState(false);

    const getData = () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
            setData(false)
        } else {
            axios.post(`${Variables.hostId}/${splitedIds[0]}/userdb`, {
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                }
            })
                .then(res => {
                    if (res.data.success) {
                        setLoading(false);
                        setData(res.data.message);
                    } else {
                        setLoading(false);
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
                    loading ? (
                        <Loading />
                    ) : (
                        <div>
                        <Navbar id={id} name={splitedIds[1]} />
                        <div className="text-center">
                            <div>
                                <h3 className='heading-top topic-off'>
                                    Customer Data Collections
                                </h3>
                            </div>
                        </div>
                        <div className="grid-system">
                            <div className='container'>
                                <div className='row'>
                                    {
                                        data.map((item, key) => {
                                            return (
                                                <UserDbComp roomno={item.roomno} username={item.username} phonenumber={item.phonenumber} secphone={item.secondphonenumber} adults={item.adults} childrens={item.childrens} checkin={item.dateofcheckin} aadharcard={item.aadharcard} checkout = {item.dateofcheckout} stayeddays = {item.stayedDays} />
                                            )
                                        })
                                    }
                                </div>
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

export default UserDb;
