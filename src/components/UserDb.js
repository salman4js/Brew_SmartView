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

    //Search Configuration
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("Show All");

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
                                    <div className="row">
                                        <div className = "col-8">
                                            <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" name={search} value={search} onChange={(e) => setSearch(e.target.value)} />
                                        </div>
                                        <div className="col">
                                            <select class="form-select" arai-label="Sort by" placeholder="Sort By" onChange={(e) => setSort(e.target.value)}>
                                                <option>
                                                    Show All
                                                </option>
                                                <option>
                                                    Room No
                                                </option>
                                                <option>
                                                    Customer Name
                                                </option>
                                                <option>
                                                    Contact Number
                                                </option>
                                                <option>
                                                    Aadhar Number
                                                </option>
                                                <option>
                                                    Checked In Days
                                                </option>
                                                <option>
                                                    Checked In Date 
                                                </option>
                                                <option>
                                                    Checked Out Date 
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className='row top-gun'>
                                        {
                                            data.filter((value) => {
                                                console.log(sort);
                                                if(sort == "Room No"){
                                                    return value.roomno.toLowerCase().includes(search.toLowerCase());
                                                } else if(sort == "Customer Name"){
                                                    return value.username.toLowerCase().includes(search.toLowerCase());
                                                } else if(sort == "Contact Number"){
                                                    return value.phonenumber.toLowerCase().includes(search.toLowerCase());
                                                } else if(sort == "Aadhar Number"){
                                                    return value.aadharcard.toLowerCase().includes(search.toLowerCase());
                                                } else if(sort == "Checked In Days"){
                                                    return value.stayedDays.toLowerCase().includes(search.toLowerCase());
                                                } else if(sort == "Checked In Date"){
                                                    return value.dateofcheckin.toLowerCase().includes(search.toLowerCase());
                                                } else if(sort == "Checked Out Date"){
                                                    return value.dateofcheckout.toLowerCase().includes(search.toLowerCase());
                                                } else if(sort == "Show All"){
                                                    return value.roomno.toLowerCase().includes(search.toLowerCase()) || value.username.toLowerCase().includes(search.toLowerCase());
                                                }
                                            }).map((item,key) => {
                                                console.log("Pre Booked User db", item.prebooked)
                                                return(
                                                    <UserDbComp roomno={item.roomno} username={item.username} phonenumber={item.phonenumber} 
                                                    secphone={item.secondphonenumber} adults={item.adults} childrens={item.childrens} 
                                                    checkin={item.dateofcheckin} aadharcard={item.aadharcard} checkout={item.dateofcheckout} 
                                                    stayeddays={item.stayedDays} prebooked = {item.prebooked} discount = {item.discount} 
                                                    advance = {item.advance} bill = {item.bill} dishBill = {item.dishbill} foodGst = {item.foodGst} stayGst= {item.stayGst} 
                                                    totalAmount = {Number(item.totalAmount) + Number(item.advance)} isGst = {item.isGst}
                                                    channel = {item.channel} checkinTime = {item.checkinTime} checkoutTime = {item.checkoutTime}
                                                    receiptId = {item.receiptId} />
                                                )
                                            })
                                        }
                                        {/* {
                                            data.map((item, key) => {
                                                return (
                                                    <UserDbComp roomno={item.roomno} username={item.username} phonenumber={item.phonenumber} secphone={item.secondphonenumber} adults={item.adults} childrens={item.childrens} checkin={item.dateofcheckin} aadharcard={item.aadharcard} checkout={item.dateofcheckout} stayeddays={item.stayedDays} />
                                                )
                                            })
                                        } */}
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
