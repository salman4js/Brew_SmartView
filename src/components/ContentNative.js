import React, { useState, useEffect } from 'react';
import axios from 'axios'
import Navbar from './Navbar';
import Variables from './Variables';
import Loading from './Loading';
import changeScreen from './Action';
import CustomError from './CustomError';
import GeneratorCN from './GeneratorCN';
import { Link, useParams } from "react-router-dom";

const ContentNative = () => {

    // Retriving the URL to pass it into Navbar.
    const { id } = useParams();
    const splitedIds = id.split(/[-]/);

    // Date value
    const [sdate, setSdate] = useState("");
    const [edate, setEdate] = useState("");

    // Dates Inbetween
    const [datesbetween, setDatesbetween] = useState([]);

    // Data value
    const [data, setData] = useState([]);

    // Loader
    const [loading, setLoading] = useState(false);

    // Search config
    const [sort, setSort] = useState("Show All");

    // Token from the local storage
    const token = localStorage.getItem("token");

    // Getting data from the Server
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

    // Changing the data back to its original form
    const clearData = () => {
        setSdate("");
        setEdate("")   
    }

    // Generation of inbetween dates
    const getDates = (sDate, eDate) => {
        const startDate = new Date(sDate);
        const endDate = new Date(eDate);
        console.log("Dates function getting called...")
        var dates = []
        //to avoid modifying the original date
        const theDate = new Date(startDate);

        const date = `${theDate.getFullYear()}/${theDate.getMonth() + 1}/${theDate.getDate()}`

        console.log(theDate.getDate());
        while (theDate < endDate) {
            const date = `${theDate.getFullYear()}/${theDate.getMonth() + 1}/${theDate.getDate()}`
            //dates = [...dates, date]
            dates.push(date)
            theDate.setDate(theDate.getDate() + 1)
            //theDate.getDate() + 1;
            //new Date(date).getDate() + 1
        }
        console.log(dates);
        setDatesbetween(dates);
    }

    // Invoke function at the rendering of the page
    useEffect(() => {
        getData();
    }, [])

    // Token Expiration
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

    // Invoke function for checking the token value constantly
    useEffect(() => {
        const interval = setInterval(() => {
            AuthVerify();
        }, 9000)
        return () => clearInterval(interval)
    }, [])

    // JSX Content
    return (
        <div>
            {
                token ? (
                    loading ? (
                        <Loading />
                    ) : (
                        <div className="container">
                            <Navbar id={id} name={splitedIds[1]} />
                            <div className="text-center">
                                <div>
                                    <h3 className='heading-top topic-off'>
                                        Xplore Native
                                    </h3>
                                </div>
                            </div>
                            <div className="grid-system-search">
                                <div className="row">
                                    <div className="col-4">
                                        <input class="form-control mr-sm-2" type="search" placeholder="Start Date" aria-label="Start Date" name={sdate} value={sdate} onChange={(e) => setSdate(e.target.value)} />
                                    </div>
                                    <div className="col-4">
                                        <input class="form-control mr-sm-2" type="search" placeholder="End Date" aria-label="End Date" name={edate} value={edate} onChange={(e) => setEdate(e.target.value)} />
                                    </div>
                                    <div className="col btn btn-success" onClick={() => getDates(sdate, edate)}>
                                        Search
                                    </div>
                                    <div className="col">
                                        <select class="form-select" arai-label="Sort by" placeholder="Sort By" onChange={(e) => setSort(e.target.value)}>
                                            <option onClick = {() => clearData()}>
                                                Show All
                                            </option>
                                            <option onClick = {() => clearData()}>
                                                Date of check in
                                            </option>
                                            <option onClick = {() => clearData()}>
                                                Date of check out
                                            </option>
                                            <option>
                                                Filter by date
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="row top-gun">
                                {
                                    data.filter((value) => {
                                        if(sort == "Show All"){
                                            return value
                                        } else if(sort == "Date of check in"){
                                            return value.dateofcheckin.toLowerCase().includes(sdate.toLowerCase())
                                        } else if(sort == "Date of check out"){
                                            return value.dateofcheckout.toLowerCase().includes(edate.toLowerCase())
                                        } else if(sort == "Filter by date"){
                                            return datesbetween.includes(value.dateofcheckin)
                                        }
                                    }).map((item, key) => {
                                        return(
                                            <GeneratorCN roomno={item.roomno} username={item.username} phonenumber={item.phonenumber} secphone={item.secondphonenumber} adults={item.adults} childrens={item.childrens} checkin={item.dateofcheckin} aadharcard={item.aadharcard} checkout={item.dateofcheckout} stayeddays={item.stayedDays} />
                                        )
                                    })
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

export default ContentNative