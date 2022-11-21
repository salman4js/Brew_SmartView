import React, { useState, useEffect } from 'react';
import CustomError from './CustomError';
import axios from "axios";
import Navbar from './Navbar';
import Variables from './Variables';
import Loading from './Loading';
import { Link, useParams } from "react-router-dom";
import RoomsUpdate from './RoomsUpdate';
import changeScreen from './Action';

const UpdateRooms = () => {

    const { id } = useParams();

    const splitedIds = id.split(/[-]/);

    const [room, setRoom] = useState([]);

    const [load, setLoad] = useState();

    //Loader
    const [loading, setLoading] = useState(false);


    const getData = () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
            setRoom(false)
        } else {
            axios.post(`${Variables.hostId}/${splitedIds[0]}/roomlodge`, {
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                }
            })
                .then(res => {
                    setLoading(false);
                    if(res.data.success){
                        setRoom(res.data.message);
                    } else {
                        setLoading(false);
                        localStorage.clear();
                        changeScreen();
                    }
                })
        }
    }

    useEffect(() => {
        getData()
    }, [load])


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

    return (
        <div>
            {
                room ? (
                    loading ? (
                        <Loading />
                    ) : (
                        <div>
                        <Navbar id={id} name={splitedIds[1]} />
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
                                                <RoomsUpdate roomno={item.roomno} engaged={item.isOccupied} roomtype={item.suiteName} bedcount={item.bedCount} roomid={item._id} id={id} setLoad={setLoad} price = {item.price} />
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
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

export default UpdateRooms