import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'
import jsPDF from 'jspdf';
import brewDate from 'brew-date';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Navbar from './Navbar';
import Variables from './Variables';
import Loading from './Loading';
import changeScreen from './Action';
import CustomError from './CustomError';
import GeneratorCN from './GeneratorCN';
import TableFormatReport from './GenerateReportTableFormat/TableFormatReport';
import { Link, useParams } from "react-router-dom";

const ContentNative = () => {

    // Retriving the URL to pass it into Navbar.
    const { id } = useParams();
    const splitedIds = id.split(/[-]/);

    // Reference for Generator
    const reportTableTemp = useRef(null);
    const reportLayoutTemp = useRef(null);

    // Report Template Function
    const reportTemp = (value) => {
        setModel(value);
    }

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
        //setSort("Show All");
    }

    // Handle Generate PDF
    const [templateAlert, setTemplateAlert] = useState(false);

    const handleTemplateAlert = () => {
        setTemplateAlert(!templateAlert)
    }
    const handleGeneratePdf = () => {
        if (model == "0") {
            setTemplateAlert(true);
        } else {
            const doc = new jsPDF("landscape", "pt", "A3");
            // Adding the fonts.
            doc.setFont('Inter-Regular', 'normal');
            if (model == "1") {
                doc.html(reportTableTemp.current, {
                    async callback(doc) {
                        if (sdate == undefined && edate == undefined) {
                            await doc.save('document');
                        } else if (sdate == "" && edate == "") {
                            await doc.save('document');
                        } else {
                            await doc.save(`${sdate} to ${edate} -- ${sort}`);
                        }
                    },
                });
            } else {
                doc.html(reportLayoutTemp.current, {
                    async callback(doc) {
                        if (sdate == undefined && edate == undefined) {
                            await doc.save('document');
                        } else if (sdate == "" && edate == "") {
                            await doc.save('document');
                        } else {
                            await doc.save(`${sdate} to ${edate} -- ${sort}`);
                        }
                    },
                });
            }
        }

    };

    // Toast Message for selection of report model
    const [model, setModel] = useState("2");
    const [alert, setAlert] = useState(false);
    const toastModal = () => {
        setAlert(!alert);
        setModel("2");
    }


    // Search Function for all the configs
    const SearchConfig = () => {
        setLoading(true);
        getDates(sdate, edate)
    }

    // Generation of inbetween dates
    const getDates = (sDate, eDate) => {
        const startDate = new Date(sDate);
        const endDate = new Date(eDate);
        console.log("Dates function getting called...")
        var dates = []
        //to avoid modifying the original date
        const theDate = new Date(startDate);

        const date = `${theDate.getFullYear()}/${theDate.getMonth() + 1}/${theDate.getDate()}`;
        
        console.log(theDate.getDate());
        while (theDate < endDate) {
            var currentDate = theDate.getDate().toString().length > 1;
            var currentMonth = theDate.getMonth().toString().length > 1;
            const month = currentMonth ? (theDate.getMonth() + 1) : "0"+ (theDate.getMonth()+1);
            const dat = currentDate ? theDate.getDate() : "0"+ theDate.getDate();
            const date = `${theDate.getFullYear()}/${month}/${dat}`
            //dates = [...dates, date]
            dates.push(date)
            theDate.setDate(theDate.getDate() + 1)
            //theDate.getDate() + 1;
            //new Date(date).getDate() + 1
        }
        console.log(dates);
        setDatesbetween(dates);
        setLoading(false);
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
            <Navbar id={id} name={splitedIds[1]} />
            {
                token ? (
                    loading ? (
                        <Loading />
                    ) : (
                        <div className = "container">
                            
                            <div className="container text-center">
                                <div>
                                    <h3 className='heading-top topic-off'>
                                        Content Native - Dashboard
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
                                    <div className="col btn btn-success" onClick={() => SearchConfig()}>
                                        Search
                                    </div>
                                    <div className="col">
                                        <select class="form-select" arai-label="Sort by" placeholder="Sort By" onChange={(e) => setSort(e.target.value)}>
                                            <option onClick={clearData}>
                                                Show All
                                            </option>
                                            <option onClick={clearData}>
                                                Date of check in - Filter by date
                                            </option>
                                            <option onClick={clearData}>
                                                Date of check out - Filter by date
                                            </option>

                                        </select>
                                    </div>
                                    <div className="col btn btn-primary" onClick={toastModal}>
                                        Download
                                    </div>
                                </div>
                            </div>
                            {
                                <Modal
                                show={templateAlert}
                                onHide={handleTemplateAlert}
                                backdrop="static"
                                keyboard={false}
                                className="my-modal"
                            >
                                <Modal.Header closeButton>
                                    <Modal.Body className="text-center">
                                        Please choose a valid template!
                                    </Modal.Body>
                                </Modal.Header>
                            </Modal>
                            }
                            <div className="row top-gun" ref={reportLayoutTemp} style={{ color: '#33959a' }}>
                                <div className="sort text-center">
                                    {
                                        sort === "Show All" ? (
                                            <div>
                                            </div>
                                        ) : (
                                            <div>
                                                {sort}
                                            </div>
                                        )
                                    }
                                </div>
                                {
                                    data.filter((value) => {
                                        if (sort == "Show All") {
                                            return value
                                        } else if (sort == "Date of check in - Filter by date") {
                                            if (sdate == undefined) {
                                                return value;
                                            } else if (edate == undefined) {
                                                return value;
                                            } else if (sdate == "") {
                                                return value;
                                            } else if (edate == "") {
                                                return value;
                                            } else {
                                                return datesbetween.includes(value.dateofcheckin);
                                            }
                                        } else if (sort == "Date of check out - Filter by date") {
                                            if (sdate == undefined) {
                                                return value;
                                            } else if (edate == undefined) {
                                                return value;
                                            } else if (sdate == "") {
                                                return value;
                                            } else if (edate == "") {
                                                return value;
                                            } else {
                                                return datesbetween.includes(value.dateofcheckout);
                                            }
                                        }
                                    }).map((item, key) => {
                                        return (
                                            <GeneratorCN bill = {item.bill} roomno={item.roomno} username={item.username}
                                                phonenumber={item.phonenumber}
                                                secphone={item.secondphonenumber} adults={item.adults}
                                                childrens={item.childrens} checkin={item.dateofcheckin}
                                                aadharcard={item.aadharcard} checkout={item.dateofcheckout} stayeddays={item.stayedDays} discount = {item.discount} advance = {item.advance} />
                                        )
                                    })
                                }

                            </div>
                            <div className={`${model == "2" ? 'hide_tableFormat' : 'hide'}`} ref={reportTableTemp}>
                                <div className="tableFormatReport">
                                    {
                                        sort === "Show All" ? (
                                            <div>
                                            </div>
                                        ) : (
                                            <div className = "container text-center" style = {{fontWeight : "bold", marginBottom : "10px"}}>
                                                {sort}
                                            </div>
                                        )
                                    }
                                    <table className="table" style={{ width: "100%" }}>
                                        <thead>
                                            <tr>
                                                <th>
                                                    Date Of Check In
                                                </th>
                                                <th>
                                                    Date Of Check Out
                                                </th>
                                                <th>
                                                    Time of Check In
                                                </th>
                                                <th>
                                                    Time of Check Out
                                                </th>
                                                <th>
                                                    Amount Paid
                                                </th>
                                                <th>
                                                    Customer Name
                                                </th>
                                                <th>
                                                    Discount
                                                </th>
                                                <th>
                                                    Advance
                                                </th>
                                                <th>
                                                    Room No
                                                </th>
                                                <th>
                                                    Phone Number
                                                </th>
                                                <th>
                                                    Adults
                                                </th>
                                                <th>
                                                    Childrens
                                                </th>
                                                <th>
                                                    Aadhar Number
                                                </th>
                                                <th>
                                                    Stayed Days
                                                </th>
                                            </tr>
                                            {
                                                data.filter((value) => {
                                                    if (sort == "Show All") {
                                                        return value
                                                    } else if (sort == "Date of check in - Filter by date") {
                                                        if (sdate == undefined) {
                                                            return value;
                                                        } else if (edate == undefined) {
                                                            return value;
                                                        } else if (sdate == "") {
                                                            return value;
                                                        } else if (edate == "") {
                                                            return value;
                                                        } else {
                                                            return datesbetween.includes(value.dateofcheckin);
                                                        }
                                                    } else if (sort == "Date of check out - Filter by date") {
                                                        if (sdate == undefined) {
                                                            return value;
                                                        } else if (edate == undefined) {
                                                            return value;
                                                        } else if (sdate == "") {
                                                            return value;
                                                        } else if (edate == "") {
                                                            return value;
                                                        } else {
                                                            return datesbetween.includes(value.dateofcheckout);
                                                        }
                                                    }
                                                }).map((item, key) => {
                                                    return (

                                                        <TableFormatReport bill = {item.bill} roomno={item.roomno} username={item.username}
                                                            phonenumber={item.phonenumber}
                                                            secphone={item.secondphonenumber} adults={item.adults}
                                                            childrens={item.childrens} checkin={item.dateofcheckin}
                                                            aadharcard={item.aadharcard} checkout={item.dateofcheckout} stayeddays={item.stayedDays}
                                                            discount = {item.discount} advance = {item.advance} checkInTime = {item.checkinTime} checkOutTime = {item.checkoutTime} />

                                                    )
                                                })
                                            }
                                        </thead>
                                    </table>

                                </div>
                            </div>
                            <div>
                                <Modal
                                    show={alert}
                                    size="medium"
                                    aria-labelledby="contained-modal-title-vcenter"
                                    centered
                                >
                                    <Modal.Header>
                                        <Modal.Title id="contained-modal-title-vcenter">
                                            Choose Template
                                        </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <h4 className="text-center">Template</h4>
                                        <div class="input-group mb-3">
                                            <div class="input-group-prepend">
                                                <label class="input-group-text" for="inputGroupSelect01">Options</label>
                                            </div>
                                            <select class="custom-select" id="inputGroupSelect01" value={model} onChange={((e) => reportTemp(e.target.value))}>
                                                <option selected value="0">Choose...</option>
                                                <option value="1">Table View Format</option>
                                                <option value="2">Layout View Format</option>
                                            </select>
                                        </div>

                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button className="btn btn-secondary" onClick={toastModal}>Close</Button>
                                        <Button onClick={handleGeneratePdf}> Generate </Button>
                                    </Modal.Footer>
                                </Modal>
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

export default ContentNative;