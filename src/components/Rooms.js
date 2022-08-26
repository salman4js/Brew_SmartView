import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Variables from './Variables';
import HomeRoom from './HomeRoom';
import Footer from './Footer';
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const Rooms = () => {

    const { id } = useParams();

    const splitedIds = id.split(/[-]/);


    const [room, setRoom] = useState([]);

    const [load, setLoad] = useState("");

    const getData = () => {
        axios.post(`${Variables.hostId}/${splitedIds[0]}/availability`)
            .then(data => {
                console.log(data.data)
                setRoom(data.data);
            })
    }

    useEffect(() => {
        getData()
    }, [load])

    return (
        <div className='container'>
            <Navbar id={id} name = {splitedIds[1]} />
            <div className="text-center">
                <div>
                    <h3 className='heading-top topic-off'>
                        Available Rooms!
                    </h3>
                </div>
            </div>
            <div className='grid-system'>
                <div class="container">
                    <div class="row">
                        {
                            room.map((item,key) => {
                                return(
                                    <HomeRoom roomno = {item.roomno} engaged = {item.isOccupied} roomtype = {item.suiteName} bedcount = {item.bedCount} roomid = {item._id} id = {id} setLoad = {setLoad}/>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Rooms