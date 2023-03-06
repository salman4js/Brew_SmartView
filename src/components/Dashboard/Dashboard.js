import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Average from './Average/Average';
import Variables from '../Variables';
import Navbar from '../Navbar';
import Loading from '../Loading';
import Cabinets from './Cabinets/Cabinets';

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
    // State handler for loader
    const [loader, setLoader] = useState(false);


    // Batches API call
    async function batchesApi() {
        const data = {
            days: 3
        }
        setLoader(true);
        const average = await axios.post(`${Variables.hostId}/${splitedIds[0]}/false/roomlodge-duplicate`);
        const upcomingCheckout = await axios.post(`${Variables.hostId}/${splitedIds[0]}/upcomingcheckout`, data);
        const upcomingPrebook = await axios.post(`${Variables.hostId}/${splitedIds[0]}/prebookupcoming`, data);
        axios.all([average, upcomingCheckout])
            .then(axios.spread((...responses) => {
                const average1 = responses[0];
                const upcoming = responses[1];
                const prebook = responses[2];
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
                if(prebook.data.success){

                } else {
                    
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
    function helperPanel() {
        console.log("Function triggered")
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
                    <div className = "container">
                        <Average average={Number(booked) / Number(room) * 100} />
                        <div className = "row">
                            <Cabinets data={data} helperPanel={() => helperPanel()} cabinetHeader = {"UPCOMING CHECK OUT"} />
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Dashboard;