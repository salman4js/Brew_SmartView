import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Variables from './Variables';
import Loading from "./Loading";
import changeScreen from './Action';
import HomeDishes from './HomeDishes';
import { Link, useParams } from "react-router-dom";
import axios from 'axios';
import CustomError from './CustomError';

const Dishes = () => {

    const { id } = useParams();

    const splitedIds = id.split(/[-]/);

    const [load, setLoad] = useState(false);

    // Search
    const [search, setSearch] = useState("");

    // Sort
    const [sort, setSort] = useState("Show All");

    const [data, setData] = useState([]);

    // Loader
    const [loading, setLoading] = useState(false);

    const getData = () => {
        setLoading(true);
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

    useEffect(() => {
        getData();
    }, [])


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
                data ? (
                    loading ? (
                        <Loading />
                    ) : (
                        <div>
                            <div className='container'>
                                <Navbar id={id} name={splitedIds[1]} />
                                <div className="text-center">
                                    <div>
                                        <h3 className='heading-top topic-off'>
                                            Dishes!
                                        </h3>
                                    </div>
                                </div>
                                <div className='grid-system-search'>
                                    <div class="container">
                                        <div className = "row">
                                            <div className = "col-8">
                                                <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" name={search} value={search} onChange={(e) => setSearch(e.target.value)} />
                                            </div>
                                            <div className = "col">
                                                <select class = "form-select" arai-label = "Sort by" placeholder = "Sort By" onChange = {(e) => setSort(e.target.value)}>
                                                    <option>
                                                        Show All
                                                    </option>
                                                    <option>
                                                        dishName
                                                    </option>
                                                    <option>
                                                        dishType
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                       
                                    <div class="row top-gun">
                                        {/* <HomeDishes key={key} dishname={item.dishName} dishrate={item.dishRate} dishtype={item.dishType} available={item.available} load={setLoad} id={id} lodgeid={splitedIds[0]} /> */}
                                        {
                                            data.filter((value) => {
                                                console.log(sort);
                                                if(sort == "dishName"){
                                                    return value.dishName.toLowerCase().includes(search.toLowerCase());
                                                } else if(sort == "dishType") {
                                                    return value.dishType.toLowerCase().includes(search.toLowerCase());
                                                } else if(sort == "Show All"){
                                                    return value.dishName.toLowerCase().includes(search.toLowerCase()) || value.dishType.toLowerCase().includes(search.toLowerCase());
                                                } 
                                            }).map((item, key) => {
                                                return (
                                                    <HomeDishes key={key} dishname={item.dishName} dishrate={item.dishRate} dishtype={item.dishType} available={item.available} setLoad={setLoad} id={id} lodgeid={splitedIds[0]} />
                                                )
                                            })
                                        }
                                    </div>
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
        </div >
    )
}

export default Dishes