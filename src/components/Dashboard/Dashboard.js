import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import Average from './Average/Average';
import Variables from '../Variables';
import Navbar from '../Navbar';
import Loading from '../Loading';
import Cabinets from './Cabinets/Cabinets';
import ModalValue from './ValueToast/ModalValue';
import CheckinModal from '../CheckinModal/checkin.modal';
import Card from './Cabinets/Cards/Card';
import bwt from 'brew-date';
import formatDate from '../PreBook/Date_Format/DateFormatter';

// Importing Link react module
import { Link, useNavigate, useParams } from 'react-router-dom';
import changeScreen from '../Action';


const Dashboard = () => {

    // Getting models attributes
    const { id } = useParams();
    let navigate = useNavigate();
    const splitedIds = id.split(/[-]/);

    // Average state handler
    const [room, setRoom] = useState();
    const [booked, setBooked] = useState();
    const [free, setFree] = useState();

    // Upcoming checkout state handler!
    const [data, setData] = useState([]);

    // Recentlt checkout data handler!
    const [check, setCheck] = useState([]);

    // State handler for prebook data
    const [prebook, setPrebook] = useState([]);

    // State handler for favourites data!
    const [favcustomer, setFavcustomer] = useState([]);

    // Modal state handler!
    const [modal, setModal] = useState(false);
    const [modaldata, setModaldata] = useState();
    const [methodid, setMethodid] = useState("");

    // Checkin modal state handler
    const [checkinModal, setCheckinModal] = useState(false);
    const [adults, setAdults] = useState();
    const [childrens, setChildrens] = useState();
    const [roomnumber, setRoomnumber] = useState();
    const [dateofcheckout, setDateofcheckout] = useState();
    const [dateofcheckin, setDateofcheckin] = useState();
    const [checkin, setCheckin] = useState();
    const [checkout, setCheckout] = useState();
    const [discount, setDiscount] = useState();
    const [advance, setAdvance] = useState();
    const [roomno, setRoomno] = useState();
    const [roomid, setRoomid] = useState();

    // Extra state handler needed for prebook checkin collection
    const [prebookprice, setPrebookprice] = useState();

    // Available Handler
    const [roomdata, setRoomdata] = useState([]);

    // Favourite customer check in data handler!
    const [favData, setFavData] = useState();

    // State handler for loader
    const [loader, setLoader] = useState(false);

    // Toast state handler
    const [toast, setToast] = useState(false);
    const [tMessage, setTMessage] = useState("");

    // Model Id Node handler!
    const [node, setNode] = useState();


    // Batches API call
    async function batchesApi() {
        // Calculate the dates between using brew-date package, Later initializa the number of days in config for the users!
        const date = bwt.getFullDate('yyyy/mm/dd');
        const datesBetween = bwt.getBetween(date, bwt.addDates(date, 3));
        const data = {
            days: 3,
            datesBetween: datesBetween
        }
        setLoader(true);
        const average = await axios.post(`${Variables.hostId}/${splitedIds[0]}/false/roomlodge-duplicate`);
        const upcomingCheckout = await axios.post(`${Variables.hostId}/${splitedIds[0]}/upcomingcheckout`, data);
        const upcomingPrebook = await axios.post(`${Variables.hostId}/${splitedIds[0]}/prebookupcoming`, data);
        const favCustomers = await axios.post(`${Variables.hostId}/${splitedIds[0]}/favcustomer`);
        const availability = await axios.post(`${Variables.hostId}/${splitedIds[0]}/availability`);
        const checkoutData = await axios.post(`${Variables.hostId}/${splitedIds[0]}/userdb1`);
        axios.all([average, upcomingCheckout, upcomingPrebook, favCustomers, availability, checkoutData])
            .then(axios.spread((...responses) => {
                const average1 = responses[0];
                const upcoming = responses[1];
                const prebook = responses[2];
                const favourites = responses[3];
                const available = responses[4];
                const checkoutData = responses[5];

                if (average1.data.success) {
                    setRoom(average1.data.message.length);
                    setFree(average1.data.countAvailability);
                    setBooked(average1.data.message.length - average1.data.countAvailability);
                } else {
                    sessionExpired();
                }

                // Upcoming-Checkout call response
                if (upcoming.data.success) {
                    setData(upcoming.data.message);
                } else {
                    sessionExpired();
                }

                // Upcoming Prebook call response!
                if (prebook.data.success) {
                    setPrebook(prebook.data.message);
                } else {
                    sessionExpired();
                }

                // Favourites call response!
                if (favourites.data.success) {
                    setFavcustomer(favourites.data.message);
                } else {
                    sessionExpired();
                }

                // Available checking call response!
                if (available.data.success) {
                    setRoomdata(available.data.message);
                } else {
                    sessionExpired();
                }

                // Recently Checkout Data
                if(checkoutData.data.success){
                    setCheck(checkoutData.data.message.reverse()); // Reversing the data, last in, first out...
                } else {
                    sessionExpired();
                }


            }))
        setLoader(false);
    }

    // Session expired function
    function sessionExpired() {
        localStorage.clear();
        changeScreen();
    }

    // Helper Panel for the cabinets
    function helperPanel(data, id) {
        handleModal();
        setMethodid(id)
        setModaldata(data);
    }

    // Handle the modal state
    function handleModal() {
        // Handle Modal Here!
        setModal(!modal);
        resetToast();
    }

    // Handle checkin modal state
    function handleCheckInModal(data, node) {
        resetDatePicker(); // Assign back to the initial state
        setNode(node);
        setFavData(data);
        setModal(false);
        setCheckinModal(!checkinModal);
    }

    // Resetting the date picker value!
    function resetDatePicker() {
        // Setting the required data back to the initial state!
        setExcludeDates([]);
        setError(true);
    }

    // Navigator
    function navigateDash() {
        navigate(`/${splitedIds[0]}-${splitedIds[1]}/landingpage`, { replace: true })
    }

    // Get the exclude dates
    const [excludeDates, setExcludeDates] = useState([]);
    // Dots loader error text handler
    const [error, setError] = useState(true);
    const getExcludeDates = async (data) => {
        setRoomid(data);
        await axios.get(`${Variables.hostId}/${data}/excludedates`)
            .then(res => {
                if (res.data.success) {
                    setError(false);
                    res.data.message.map((item) => {
                        item.forEach(element => {
                            setExcludeDates(oldValue => [...oldValue, new Date(element)]);
                        })
                    })
                } else {
                    // TODO: Error handling!
                }
            })
    }

    // Get the roomid by room number
    const handleDates = async (data) => {
        resetDatePicker();
        // Split the roomno as the data comes with the room type too...
        const roomno = data.split(/[-]/);
        const room = roomno[0].trim();
        const price = roomno[2].trim();
        setPrebookprice(price);
        // Setting the roomid to the state!
        setRoomno(room);
        const validation = {
            roomno: room,
            lodgeid: splitedIds[0]
        }
        axios.post(`${Variables.hostId}/${validation.lodgeid}/getroomid`, validation)
            .then(res => {
                if (res.data.success) {
                    res.data.message.map((item, key) => {
                        getExcludeDates(item._id);
                    })
                } else {
                    // TODO: Error handling!
                }
            })
    }

    // Handle Modal Back Router
    function handleRouter(){
        setCheckinModal(!checkinModal);
        setModal(!modal);
    }

    // Handle success checkin!
    function handleResponse(message) {
        setModal(!modal);
        setToast(true);
        setTMessage(message);
        setLoader(false);
        setCheckinModal(false);
        // When the data collection has been sent to the backend, re-call the batches API to update to the latest data!
        batchesApi();
    }

    // Reset Toast response!
    function resetToast(){
        setToast(false);
        setTMessage("");
    }

    // Helper functions!
    function updateCheckout(data){
        setCheckout(data);
        setDateofcheckout(data);
    }

    function updateCheckin(data){
        setCheckin(data);
        setDateofcheckin(data)
    }
    
    // Check-In fav customer!
    function checkIn(data, _node){
        // Initialize loader
        setLoader(true);
        if(_node === "Check-In"){
            const collection = {
                customername: data.username,
                phonenumber: data.phonenumber,
                secondphonenumber: data.secondphonenumber,
                adults: adults,
                chidrens: childrens,
                aadhar: data.aadharcard,
                checkin: bwt.getFullDate("yyyy/mm/dd"), 
                checkout: formatDate(checkout),
                discount: discount,
                advance: advance,
                roomno: roomno,
                roomid: roomid // Room id retrieving from the getExcludeDates function!
            }
            // Add check-in collection to the database!
            axios.post(`${Variables.hostId}/${splitedIds[0]}/adduserrooms`, collection)
                .then(option => {
                    if(option.data.success){
                        handleResponse(option.data.message);
                    } else {
                        handleResponse(option.data.message);
                    }
                })
        } else if(_node === "Prebook"){
            const prebookModel = {
                prebookusername: data.username,
                prebookphonenumber: data.phonenumber,
                prebooksecondnumber: data.secondphonenumber,
                prebookadults: adults,
                prebookchildren: childrens,
                prebookaadhar: data.aadharcard,
                prebookdateofcheckin: formatDate(checkin),
                prebookdateofcheckout: formatDate(checkout),
                prebookdiscount: discount,
                prebookadvance: advance,
                prebookprice: prebookprice,
                roomno: roomno,
                roomid: roomid // Room id retrieving from the getExcludeDates function!
            }

            // Add Prebook model to the collection database!
            axios.post(`${Variables.hostId}/${splitedIds[0]}/addprebookuserrooms`, prebookModel)
            .then(option => {
                if(option.data.success){
                    handleResponse(option.data.message);
                } else {
                    handleResponse(option.data.message);
                }
            })
        }
        
    }

    // Modal Config
    const modalConfig = {
        title: {
            isRequired: true,
            id: "Details"
        },
        content: {
            id: {
                id: methodid,
                isRequired: true,
                components: true,
                attributes: modaldata
            },
            favourites: {
                content: {
                    btn: {
                        btn1: {
                            variant: "primary",
                            id: "Check-In",
                            data: roomdata
                        },
                        btn2: {
                            variant: "success",
                            id: "Prebook",
                            data: roomdata
                        }
                    }
                }
            }
        },
        btn: {
            isRequired: true,
            btn: {
                id: "OK"
            }
        }
    }

    // Constructor for calling the API!
    useEffect(() => {
        setLoader(true); // Setting the loader here to prevent the clitches in the UI
        batchesApi();
    }, [])

    return (
        <div>
            <Navbar id={id} name={splitedIds[1]} className="sticky" />
            {
                loader ? (
                    <Loading />
                ) : (
                    modal ? (
                        <ModalValue toast = {toast} toastMessage = {tMessage} config={modalConfig} show={modal} handleClose={() => handleModal()} handleOpenModal={(data, modelId) => handleCheckInModal(data, modelId)} roomno={(data) => setRoomnumber(data)} />
                    ) : (
                        checkinModal === true ? (
                            <Modal
                                show={checkinModal}
                                onHide={handleCheckInModal}
                                backdrop="static"
                                keyboard={false}
                                className="text-center"
                                centered
                            >
                                <Modal.Header closeButton>
                                    <div className = "side-right" onClick = {() => handleRouter()}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                                        </svg>
                                    </div>
                                    <div className="text-center">
                                        Check-In Favourite Customer
                                    </div>
                                </Modal.Header>
                                <CheckinModal node = {node} handleCheckIn = {(data, _node) => checkIn(data, _node)} error={error} excludeDates={excludeDates} adults={setAdults} childrens={setChildrens} discount={setDiscount} advance={setAdvance} 
                                roomno={(data) => handleDates(data)} checkin = {dateofcheckin} dateofcheckin = {(data) => updateCheckin(data)} checkout={dateofcheckout} dateofcheckout={(data) => updateCheckout(data)} data={favData} show={checkinModal} roomdata={roomdata} handleClose={(data, node) => handleCheckInModal(data, node)}  />
                            </Modal>
                        ) : (
                            <div className="container">
                                <Average average={Number(booked) / Number(room) * 100} />
                                <div className="row">
                                    <Card navigate={() => navigateDash()} />
                                    <Cabinets data={data} helperPanel={(data, id) => helperPanel(data, id)} cabinetHeader={"UPCOMING CHECK OUT"} methodCall={"checkout"} lodgeid={splitedIds[0]} />
                                    <Cabinets data={prebook} helperPanel={(data, id) => helperPanel(data, id)} cabinetHeader={"UPCOMING PREBOOK"} methodCall={"prebook"} lodgeid={splitedIds[0]} />
                                    <Cabinets data={favcustomer} helperPanel={(data, id) => helperPanel(data, id)} cabinetHeader={"FAV CUSTOMERS"} methodCall={"favourites"} lodgeid={splitedIds[0]} />
                                    <Cabinets data={check} helperPanel = {(data,id) => helperPanel(data,id)} cabinetHeader={"RECENTLY CHECKEDOUT"} methodCall = {"recent"} lodgeid={splitedIds[0]} />
                                </div>
                            </div>
                        )
                    )
                )
            }
        </div>
    )
}

export default Dashboard;