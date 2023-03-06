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
        axios.all([average, upcomingCheckout])
            .then(axios.spread((...responses) => {
                const average1 = responses[0];
                const upcoming = responses[1];
                if (average1.data.success) {
                    setRoom(average1.data.message.length);
                    setFree(average1.data.countAvailability);
                    setBooked(average1.data.message.length - average1.data.countAvailability);
                } else {
                    sessionExpired();
                }

                // Upcoming call response
                if (upcoming.data.success) {
                    setData(upcoming.data.message);
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
    function helperPanel() {
        console.log("Function triggered")
    }

    const options = [1,2,3]

    // Constructor for calling the API!
    useEffect(() => {
        //setLoader(true); // Setting the loader here to prevent the clitches in the UI
        //averageCalculator();
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
                            {
                                options.map((options,key) => {
                                    return(
                                        <Cabinets data={data} helperPanel={() => helperPanel()} />
                                    )
                                })
                            }
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Dashboard;