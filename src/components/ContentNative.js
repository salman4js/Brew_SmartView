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
import { chickletValues, customValue, specificLang } from './Chicklets/chickletValues/chicklet.model';
import TableHead from './table.view/table.head.view';
import { getStorage } from '../Controller/Storage/Storage';

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

    // Specific report enable / disable handler!
    const [specific, setSpecific] = useState({
        isSpecific: false,
        isSpecificCheckbox: true,
        specificSelected : []
    })

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

    var customChoice = customValue; // Defining the custom value from the chicklet model...

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

    // trigger specific report generation!
    function triggerSpecific(){
        setSpecific(prevState => ({...prevState, isSpecific: !specific.isSpecific}))
    }

    // Trigger checkbox!
    function triggerSpecificCheckbox(){
        setSpecific(prevState => ({...prevState, isSpecificCheckbox: !specific.isSpecificCheckbox}))
    }

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

        updateSelected(nodeModel);
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
    const [templateMessage, setTemplateMessage] = useState("");

    const handleTemplateAlert = () => {
        setTemplateAlert(!templateAlert)
    }
    const handleGeneratePdf = () => {
        if (model == "0") {
            setTemplateAlert(true);
            setTemplateMessage("Please choose a valid template!")
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
                            await doc.save(`${brewDate.format(sdate, 'dd/mm/yyyy')} to ${brewDate.format(edate, 'dd/mm/yyyy')} -- ${sort}`);
                        }
                        toastModal();
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
                            await doc.save(`${brewDate.format(sdate, 'dd/mm/yyyy')} to ${brewDate.format(edate, 'dd/mm/yyyy')} -- ${sort}`);
                        }
                        toastModal(); // Close the model and set the template back to its initial state!
                    },
                });
            }
        }
    };

    // Toast Message for selection of report model
    const [model, setModel] = useState("0");
    const [alert, setAlert] = useState(false);
    const toastModal = () => {
        setAlert(!alert);
        setModel("0");
    }


    // Search Function for all the configs
    const SearchConfig = () => {
        setLoading(true);
        getDates(sdate, edate)
    }

    // Helper function for table head render!
    function customTable(value){
        const result = chickletChoice && chickletChoice[value];
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
        if(model !== "0"){
            switch (nodeValue) {
                case "GST":
                    customChoice = {
                        ...customChoice,
                        GST: customChoice.GST ? false : true
                    };
                    break;
                case "Customer Name":
                    customChoice = {
                        ...customChoice,
                        customerName: customChoice.customerName ? false : true
                    };
                    break;
                case "Phone Number":
                    customChoice = {
                        ...customChoice,
                        phoneNumber: customChoice.phoneNumber ? false : true
                    }
                    break;
                case "Date of Checkout":
                    customChoice = {
                        ...customChoice,
                        checkoutDate: customChoice.checkoutDate ? false : true
                    }
                    break;
                case "Date of Checkin":
                    customChoice = {
                        ...customChoice,
                        checkinDate : customChoice.checkinDate ? false : true
                    }
                    break;
                case "Time of Checkin":
                    customChoice = {
                        ...customChoice,
                        checkinTime: customChoice.checkinTime ? false : true
                    }
                    break;
                case "Time of Checkout":
                    customChoice = {
                        ...customChoice,
                        checkoutTime: customChoice.checkoutTime ? false : true
                    }
                    break;
                case "Discount":
                    customChoice = {
                        ...customChoice,
                        discount: customChoice.discount ? false : true
                    }
                    break;
                case "Advance":
                    customChoice = {
                        ...customChoice,
                        advance: customChoice.advance ? false : true
                    }
                    break;
                case "Room Rent":
                    customChoice = {
                        ...customChoice,
                        roomRent: customChoice.roomRent ? false : true
                    }
                    break;
                case "Stayed Days":
                    customChoice = {
                        ...customChoice,
                        days: customChoice.days ? false : true
                    }
                    break;
                case "Total Amount":
                    customChoice = {
                        ...customChoice,
                        totalAmount: customChoice.totalAmount ? false : true
                    }
                    break;
                case "Aadhar Card":
                    customChoice = {
                        ...customChoice,
                        aadhar: customChoice.aadhar ? false : true
                    }
                    break;
                case "Adults":
                    customChoice = {
                        ...customChoice,
                        adults: customChoice.adults ? false : true
                    }
                    break;
                case "Childrens": 
                    customChoice = {
                        ...customChoice,
                        childrens: customChoice.childrens ? false : true
                    }
                    break;
                case "Room No":
                    customChoice = {
                        ...customChoice,
                        roomno: customChoice.roomno ? false : true
                    }
                    break;
                default:
                    break;
            }
            return true;
        } else {
            setTemplateAlert(true);
            setTemplateMessage("Customize report only supports on table view!");
            return false;
        }
    }
    
    // Update chicklet model on button click!
    function updateChickletState(){
        populateChickletModel(customChoice);
        triggerSpecific(); /// Close the chicklet panel
        triggerSpecificCheckbox(); // Hide the checkbox!
    }

    function updateSelected(customChoice){
        for (const choice in customChoice){
            if(customChoice.hasOwnProperty(choice)){
                if(customChoice[choice] === true){
                    setSpecific(prevState => ({...prevState, specificSelected: [...prevState.specificSelected, choice]}))
                }
            }
        }
    }

    // Check if update bill price enabled for this user!
    function isUpdateEnabled(){
        let result = JSON.parse(getStorage("updatePrice"));
        return result;
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
                                        {templateMessage}
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
                           
                            <div className={`${(model === "2" || model === "0") ? 'hide_tableFormat' : 'hide'}`} ref={reportTableTemp}>
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
                                                {customTable("checkinDate") && <TableHead text = "Check-In" />}
                                                {customTable("checkoutDate") && <TableHead text = "Check-Out" />}
                                                {customTable("checkinTime") && <TableHead text = "Check-In Time" />}
                                                {customTable("checkoutTime") && <TableHead text = "Check-Out Time" />}
                                                {customTable("customerName") && <TableHead text = "C.Name" />}
                                                {customTable("discount") && <TableHead text = "Discount" />}
                                                {customTable("advance") && <TableHead text = "Advance" />}
                                                {customTable("roomno") && <TableHead text = "RoomNo" />}
                                                {customTable("phoneNumber") && <TableHead text = "Phone Number" />}
                                                {customTable("adults") && <TableHead text = "Adults" />}
                                                {customTable("childrens") && <TableHead text = "Childrens" />}
                                                {customTable("aadhar") && <TableHead text = "Aadhar" />}
                                                {customTable("days") && <TableHead text = "Stay Days" />}
                                                {customTable("roomRent") && <TableHead text = {isUpdateEnabled() ? "Room + Extra" : "Room Rent"} />}
                                                {customTable("GST") && <TableHead text = "GST" />}
                                                {customTable("totalAmount") && <TableHead text = "T.Amount" />}
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

                                                        <TableFormatReport customTable = {(value) => customTable(value)} customModel = {chickletChoice} isGst = {item.isGst} gst = {item.stayGst} totalAmount = {item.totalAmount} bill = {item.bill} roomno={item.roomno} username={item.username}
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
                                                <option value="0">Choose...</option>
                                                <option value="1">Table View Format</option>
                                                <option value="2">Layout View Format</option>
                                            </select>
                                        </div>
                                        {specific.isSpecificCheckbox && (
                                            <div className = "specific-reports-checkbox">
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked = {specific.isSpecific} onChange = {() => triggerSpecific()} />
                                                    <label class="form-check-label" for="flexCheckChecked">
                                                        Expand Specific Reports Action
                                                    </label>
                                                </div>
                                            </div>
                                        )}
                                        {!specific.isSpecificCheckbox && (
                                                <div>
                                                    <div className = "text-center" style = {{fontWeight: "bold"}}>
                                                        Selected Choices!
                                                    </div>
                                                    <div className="row chicklet-specific-reports">

                                                        {
                                                            specific.specificSelected.map((item, key) => {
                                                                return (
                                                                    <Chicklets node={specificLang[item]} chickletSelect = {() => null} />
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                        )}
                                        {specific.isSpecific && (
                                            <div className="row chicklet-specific-reports">
                                                {
                                                    chickletValues.map((item, key) => {
                                                        return (
                                                            <Chicklets node={item} chickletSelect = {(node) => chickletSelect(node)} />
                                                        )
                                                    })
                                                }
                                            </div>
                                        )}
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button className="btn btn-secondary" onClick={() => toastModal()}>Close</Button>
                                        {specific.isSpecific && <Button className = "btn btn-info" onClick = {() => updateChickletState()}> Apply </Button>}
                                        {!specific.isSpecific && <Button onClick={() => handleGeneratePdf()}> Generate </Button>}
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