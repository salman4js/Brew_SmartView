import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import CustomError from './CustomError';
import Variables from './Variables';
import UserDbComp from './UserDbComp';
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const UserDb = () => {

    const { id } = useParams();
    const splitedIds = id.split(/[-]/);

    const [data, setData] = useState([]);

    const getData = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setData(false)
        } else {
            axios.post(`${Variables.hostId}/${id}/userdb`, {
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                }
            })
                .then(res => {
                    if (res.data.success) {
                        setData(res.data.message)
                    } else {
                        console.log("Some internal error occured..")
                    }
                })
        }
    }

    useEffect(() => {
        getData();
    }, [])

    return (
        <div>
            {
                data ? (
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
