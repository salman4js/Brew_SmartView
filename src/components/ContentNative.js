import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'
import jsPDF from 'jspdf';
import brewDate from 'brew-date';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Navbar from './Navbar';
import Variables from './Variables';
import Loading from './Loading';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import changeScreen from './Action';
import CustomError from './CustomError';
import GeneratorCN from './GeneratorCN';
import TableFormatReport from './GenerateReportTableFormat/TableFormatReport';
import { Link, useParams } from "react-router-dom";
import Chicklets from './Chicklets/chicket.view';
import { chickletValues } from './Chicklets/chickletValues/chicklet.model';
import TableHead from './table.view/table.head.view';

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

    // Common custom model data object!
    var customChoice = {
        GST: false,
        customerName: false,
        phoneNumber: false,
        checkoutDate: false,
        checkinDate: false,
        checkoutTime: false,
        checkinTime: false,
        aadhar: false,
        days: false,
        discount: false,
        advance: false,
        roomRent: false,
        totalAmount: false,
        adults: false,
        childrens: false,
        roomno: false
    };

    // Chicklet choice state handler!
    const [chickletChoice, setChickletChoice] = useState({
        GST: true,
        customerName: true,
        phoneNumber: true,
        checkoutDate: true,
        checkinDate: true,
        checkoutTime: true,
        checkinTime: true,
        aadhar: true,
        days: true,
        discount: true,
        advance: true,
        roomRent: true,
        totalAmount: true,
        adults: true,
        childrens: true,
        roomno: true
    })

    // Populate the chicklet model state!
    function populateChickletModel(nodeModel) {
        setChickletChoice(prevState => ({
            ...prevState,
            GST: nodeModel.GST,
            customerName: nodeModel.customerName,
            phoneNumber: nodeModel.phoneNumber,
            checkoutDate: nodeModel.checkoutDate,
            checkinDate: nodeModel.checkinDate,
            checkoutTime: nodeModel.checkoutTime,
            checkinTime: nodeModel.checkinTime,
            aadhar: nodeModel.aadhar,
            days: nodeModel.days,
            discount: nodeModel.discount,
            advance: nodeModel.advance,
            roomRent: nodeModel.roomRent,
            totalAmount: nodeModel.totalAmount,
            adults: nodeModel.adults,
            childrens: nodeModel.childrens,
            roomno: nodeModel.roomno
        }));
    }

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

    // Helper function for table head render!
    function tableHead(value){
        const result = chickletChoice && chickletChoice[value];
        console.log(value, result);
        return result;
    }

    // Generation of inbetween dates
    const getDates = (sDate, eDate) => {

        const startDate = new Date(sDate);
        const endDate = new Date(eDate);
        var dates = []
        //to avoid modifying the original date
        const theDate = new Date(startDate);

        const date = `${theDate.getFullYear()}/${theDate.getMonth() + 1}/${theDate.getDate()}`;
        
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


    // Update chicklet value and on "apply event populate the model"
    function chickletSelect(nodeValue) {

        console.log(nodeValue);

        switch (nodeValue) {
            case "GST":
                customChoice = {
                    ...customChoice,
                    GST: true,
                };
                break;
            case "Customer Name":
                customChoice = {
                    ...customChoice,
                    customerName: true,
                };
                break;
            case "Phone Number":
                customChoice = {
                    ...customChoice,
                    phoneNumber: true
                }
                break;
            case "Date of Checkout":
                customChoice = {
                    ...customChoice,
                    checkoutDate: true
                }
                break;
            case "Date of Checkin":
                customChoice = {
                    ...customChoice,
                    checkinDate : true
                }
                break;
            case "Time of Checkin":
                customChoice = {
                    ...customChoice,
                    checkinTime: true
                }
                break;
            case "Time of Checkout":
                customChoice = {
                    ...customChoice,
                    checkoutTime: true
                }
                break;
            case "Discount":
                customChoice = {
                    ...customChoice,
                    discount: true
                }
                break;
            case "Advance":
                customChoice = {
                    ...customChoice,
                    advance: true
                }
                break;
            case "Room Rent":
                customChoice = {
                    ...customChoice,
                    roomRent: true
                }
                break;
            case "Stayed Days":
                customChoice = {
                    ...customChoice,
                    days: true
                }
                break;
            case "Total Amount":
                customChoice = {
                    ...customChoice,
                    totalAmount: true
                }
                break;
            case "Aadhar Card":
                customChoice = {
                    ...customChoice,
                    aadhar: true
                }
                break;
            case "Adults":
                customChoice = {
                    ...customChoice,
                    adults: true
                }
            case "Childrens": 
                customChoice = {
                    ...customChoice,
                    childrens: true
                }
            case "Room No":
                customChoice = {
                    ...customChoice,
                    roomno: true
                }
            default:
                break;
        }
    }

    function updateChickletState(){
        populateChickletModel(customChoice);
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
                                        <DatePicker style={{ color: "black" }} className="form-control" selected={sdate === "" ? Date.now() : sdate} dateFormat='y-MM-dd' onChange={(e) => setSdate(e)} isClearable />                                    
                                    </div>
                                    <div className="col-4">
                                        <DatePicker style={{ color: "black" }} className="form-control" selected={edate === "" ? Date.now() : edate} dateFormat='y-MM-dd' onChange = {(e) => setEdate(e)} isClearable />                                    
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
                                                {tableHead("checkinDate") && <TableHead text = "Check-In" />}
                                                {tableHead("checkoutDate") && <TableHead text = "Check-Out" />}
                                                {tableHead("checkinTime") && <TableHead text = "Check-In Time" />}
                                                {tableHead("checkoutTime") && <TableHead text = "Check-Out Time" />}
                                                {tableHead("customerName") && <TableHead text = "C.Name" />}
                                                {tableHead("discount") && <TableHead text = "Discount" />}
                                                {tableHead("advance") && <TableHead text = "Advance" />}
                                                {tableHead("roomno") && <TableHead text = "RoomNo" />}
                                                {tableHead("phoneNumber") && <TableHead text = "Phone Number" />}
                                                {tableHead("adults") && <TableHead text = "Adults" />}
                                                {tableHead("childrens") && <TableHead text = "Childrens" />}
                                                {tableHead("aadhar") && <TableHead text = "Aadhar" />}
                                                {tableHead("days") && <TableHead text = "Stay Days" />}
                                                {tableHead("roomRent") && <TableHead text = "Room Rent" />}
                                                {tableHead("GST") && <TableHead text = "GST" />}
                                                {tableHead("totalAmount") && <TableHead text = "T.Amount" />}
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

                                                        <TableFormatReport customModel = {chickletChoice} isGst = {item.isGst} gst = {item.stayGst} totalAmount = {item.totalAmount} bill = {item.bill} roomno={item.roomno} username={item.username}
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
                                        <div className="row">
                                            {
                                                chickletValues.map((item, key) => {
                                                    return (
                                                        <Chicklets node={item} chickletSelect = {(node) => chickletSelect(node)} />
                                                    )
                                                })
                                            }
                                        </div>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button className="btn btn-secondary" onClick={() => toastModal()}>Close</Button>
                                        <Button className = "btn btn-info" onClick = {() => updateChickletState()}> Apply </Button>
                                        <Button onClick={() => handleGeneratePdf()}> Generate </Button>
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