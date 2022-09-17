import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Variables from './Variables';
import changeScreen from './Action';
import HomeDishes from './HomeDishes';
import { Link, useParams } from "react-router-dom";
import axios from 'axios';
import CustomError from './CustomError';

const Dishes = () => {

    const { id } = useParams();

    const splitedIds = id.split(/[-]/);

    const [load, setLoad] = useState(false);

    const [data, setData] = useState([]);

    const getData = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setData(false)
        } else {
            axios.post(`${Variables.hostId}/${splitedIds[0]}/dishlodge`, {
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                }
            })
                .then(res => {
                    console.log(res.data.success);
                    console.log(res.data.message);
                    if(res.data.success){
                        setData(res.data.message);
                    } else {
                        localStorage.clear();
                        changeScreen();
                    }
                })
        }
    }

    useEffect(() => {
        getData();
    }, [])

    return (
        <div>
            {
                data ? (
                    <div className='container'>
                        <Navbar id={id} />
                        <div className="text-center">
                            <div>
                                <h3 className='heading-top topic-off'>
                                    Dishes!
                                </h3>
                            </div>
                        </div>
                        <div className='grid-system'>
                            <div class="container">
                                <div class="row">
                                    {
                                        data.map((item, key) => {
                                            return (
                                                <HomeDishes key={key} dishname={item.dishName} dishrate={item.dishRate} dishtype={item.dishType} available={item.available} load={setLoad} id={id} lodgeid={splitedIds[0]} />
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <CustomError /> 
                    </div>
                )
            }
        </div>
    )
}

export default Dishes