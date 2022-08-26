import React, { useState, useEffect } from 'react';
import axios from "axios";
import Navbar from './Navbar';
import Variables from './Variables';
import { Link, useParams } from "react-router-dom";
import RoomsUpdate from './RoomsUpdate';

const UpdateRooms = () => {

    const { id } = useParams();

    const splitedIds = id.split(/[-]/);

    const [room, setRooms] = useState([]);

    const [load, setLoad] = useState();


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
            <Navbar id={id} name = {splitedIds[1]} />
            <div className="text-center">
                <div>
                    <h3 className='heading-top topic-off'>
                        Update Room Data
                    </h3>
                </div>
            </div>
            <div className="grid-system">
                <div className="container">
                    <div className='row'>
                        {
                            room.map((item, key) => {
                                return (
                                    <RoomsUpdate roomno={item.roomno} engaged={item.isOccupied} roomtype={item.suiteName} bedcount={item.bedCount} roomid={item._id} id = {id} setLoad = {setLoad} />
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpdateRooms