import React, { useState, useEffect, useLayoutEffect } from 'react';
import Navbar from './Navbar';
import CustomError from './CustomError';
import changeScreen from './Action';
import { Link, useNavigate, useParams } from "react-router-dom";
import Variables from './Variables';
import Loading from './Loading';
import Invoice from './Invoice/invoice.view';
import axios from "axios";
import HomeRoom from './HomeRoom';

// Local Storage function!
import { getStorage } from '../Controller/Storage/Storage';


const LandingPage = () => {

    const { id } = useParams();

    let navigate = useNavigate();

    const splitedIds = id.split(/[-]/);

    const [room, setRoom] = useState([]);

    const [load, setLoad] = useState(false);

    //Loader
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const [nodeModel, setNodeModel] = useState({
        address: undefined,
        gstin: undefined,
        customerName: undefined,
        phoneNumber: undefined,
        stayedDays: undefined,
        roomRent: undefined,
        discount: undefined,
        advance: undefined,
        hotelName: undefined,
        gstPercent: undefined,
        igst: undefined,
        cgst: true,
        extraBeds: undefined,
        extraBedAmount: undefined,
        isGst: false,
        gst: undefined,
        dateofCheckIn: undefined,
        checkinTime: undefined,
        checkoutTime: undefined,
        dateofCheckout: undefined,
        invoice: false,
        tInvoice: false,
        amount: undefined,
        roomno: undefined,
        receiptId: undefined,
        lodgeName: splitedIds[1]
    })

    // Close invoice
    function onHideInvoice(){
        setNodeModel({
            ...nodeModel,
            invoice: false,
            tInvoice: false
        })
    }


    // Gst handler!
    const [isGstEnabled, setIsGstEnabled] = useState(false);

    // Channel Manager Handler!
    const [channel, setChannel] = useState(JSON.parse(getStorage("isChannel")));

    // Update Price Wizard!
    const [updatePriceWizard, setUpdatePriceWizard] = useState(JSON.parse(getStorage("updatePrice")));

    // Hourly basis handler / checker!
    const [isHourly, setIsHourly] = useState(false);

    // Counter for the dashboard!
    const [reservedcounter, setReservedcounter] = useState();
    const [freecounter, setFreecounter] = useState();

    // Search Configuration
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("Show All");

    // Channel Manager Dropdown State handler!
    const [options, setOptions] = useState();


    // Check Local Storage!
    function checkStorage() {

        setMessage("Validating config file...")
        // check for all the default set into the local storage!
        const isGstEnabled = getStorage("isGst");
        const isHourly = getStorage("isHourly");

        setIsGstEnabled(JSON.parse(isGstEnabled));
        setIsHourly(JSON.parse(isHourly));
    }

    // Config checking
    const [configOptions, setConfigOptions] = useState(false);
    const checkConfig = () => {
        setMessage("Checking application permissions...")
        axios.get(`${Variables.hostId}/${splitedIds[0]}/config-checking`)
            .then(res => {
                if (res.data.success) {
                    if (res.data.message.some(option => option.config === 'PreBook')) {
                        setConfigOptions(true);
                    }
                } else {
                    console.error(res.data.message);
                }
            })
    }

    const getData = () => {
        setLoading(true);
        setMessage("Gathering customers details...")
        const token = localStorage.getItem("token");
        if (!token) {
            setRoom(false)
        } else {
            axios.post(`${Variables.hostId}/${splitedIds[0]}/false/roomlodge`, {
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                }
            })
                .then(res => {
                    if (res.data.success) {
                        setLoading(false);
                        setRoom(res.data.message)
                        setFreecounter(res.data.countAvailability);
                        setReservedcounter(res.data.message.length - res.data.countAvailability);
                        setOptions(res.data.channels);
                    } else {
                        setLoading(false);
                        localStorage.clear();
                        changeScreen();
                    }
                })
        }
        setLoad(false);
    }

    // Changing search and sort value back to original state or selected state!
    const changeSearchConfig = (value) => {
        setSort(value);
        setSearch("");
    }

    useEffect(() => {
        getData();
    }, [load]);

    // Token expiration checking!
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

    // Check config before the DOM renders!
    useLayoutEffect(() => {
        checkConfig();
        checkStorage();
    }, [])

    return (
        <div>
            {
                room ? (
                    loading ? (
                        <Loading message={message} />
                    ) : (
                        nodeModel.invoice || nodeModel.tInvoice ? (
                            <Invoice node = {nodeModel} onHide = {() => onHideInvoice()} />
                        ) : (
                            <div>
                                <Navbar id={id} name={splitedIds[1]} className="sticky" />
                                <div className="text-center">
                                    <div>
                                        <h3 className='heading-top topic-off'>
                                            {splitedIds[1]} - Dashboard
                                        </h3>
                                        <div className="btn btn-primary">
                                            <span className="align-left">
                                                Booked Rooms:
                                                <span class="align-left-more badge text-bg-secondary">{reservedcounter}</span>
                                            </span>
                                            <span className="align-left">
                                                Free Rooms:
                                                <span class="align-left-more badge text-bg-secondary">{freecounter}</span>
                                            </span>
                                            <span className="align-left">
                                                Total Rooms:
                                                <span class="align-left-more badge text-bg-secondary">{room.length}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className='grid-system-search'>
                                    <div class="container">
                                        <div className="row">
                                            <div className="col-8">
                                                <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" name={search} value={search} onChange={(e) => setSearch(e.target.value)} />
                                            </div>
                                            <div className="col">
                                                <select class="form-select" arai-label="Sort by" placeholder="Sort By" onChange={(e) => changeSearchConfig(e.target.value)}>
                                                    <option>
                                                        Show All
                                                    </option>
                                                    <option>
                                                        Room No
                                                    </option>
                                                    <option>
                                                        Room Type
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="row top-gun">
                                            {
                                                room.filter((value) => {
                                                    console.log(sort)
                                                    if (sort == "Room No") {
                                                        return value.roomno.toLowerCase().includes(search.toLowerCase());
                                                    } else if (sort == "Room Type") {
                                                        return value.suiteName.toLowerCase().includes(search.toLowerCase());
                                                    } else if (sort == "Show All") {
                                                        return value.roomno.toLowerCase().includes(search.toLowerCase()) || value.suiteName.toLowerCase().includes(search.toLowerCase());
                                                    }
                                                }).map((item, key) => {
                                                    return (
                                                        <HomeRoom lodgeName = {splitedIds[1]} node = {setNodeModel} extraBedPrice={item.extraBedPrice} extraBeds={item.extraCount} roomno={item.roomno} engaged={item.isOccupied} roomtype={item.suiteName} bedcount={item.bedCount}
                                                            roomid={item._id} id={id} setLoad={setLoad} lodgeid={splitedIds[0]} price={item.price}
                                                            prebook={item.preBooked} prevalid={item.preValid} prebookconfig={configOptions} discount={item.discount} isGstEnabled={isGstEnabled}
                                                            isHourly={isHourly} channel={channel} options={options} updatePriceWizard={updatePriceWizard} />
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div >
                        )
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

export default LandingPage