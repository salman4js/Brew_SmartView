import React, {useState, useEffect} from 'react';
import Navbar from './Navbar';
import {Link, useNavigate, useParams} from "react-router-dom";
import Variables from './Variables';
import axios from "axios";
import HomeRoom from './HomeRoom';


const LandingPage = () => {

    const {id} = useParams();

    const splitedIds = id.split(/[-]/);

    const [room, setRooms] = useState([]);

    const [load, setLoad] = useState("");


    const getData = () => {
        axios.post(`${Variables.hostId}/${splitedIds[0]}/roomlodge`)
        .then(res => {
            setRooms(res.data)
        })
    }

    useEffect(() => {
        getData()
    },[load])

    return (
        <div>
            <Navbar id = {id} name = {splitedIds[1]} />
            <div className="text-center">
                <div>
                    <h3 className='heading-top topic-off'>
                        {splitedIds[1]}
                    </h3>
                </div>
            </div>
            <div className='grid-system'>
                <div class="container">
                    <div class="row">
                        {
                            room.map((item,key) => {
                                return(
                                    <HomeRoom roomno = {item.roomno} engaged = {item.isOccupied} roomtype = {item.suiteName} bedcount = {item.bedCount} roomid = {item._id} id = {id} load = {setLoad} />
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LandingPage