import React, { useState, useEffect } from "react";
import axios from "axios";
import HomeRoom from "../HomeRoom";
import Navbar from "../Navbar";
import Loading from "../Loading";
import Variables from "../Variables";
import { Link, useParams } from "react-router-dom";
import changeScreen from "../Action";


const EditRoom = () => {

    // Getting ID!
    const { id } = useParams();
    const splitedIds = id.split(/[-]/);

    // Edit Room State Handler!
    const [edit, setEdit] = useState({
        loader: false,
        room: [],
        message: undefined
    })

    // Search Configuration
    const [searchConfig, setSearchConfig] = useState({
        sort: "Show All",
        search: ""
    })

    const getData = async () => {
        setEdit(prevState => ({ ...prevState, loader: true }));
        setEdit(prevState => ({ ...prevState, message: "Gathering Customer Details" }))
        const token = localStorage.getItem("token");
        if (!token) {
            navigateToLogin();
        } else {
            await axios.post(`${Variables.hostId}/${splitedIds[0]}/occupied`)
                .then(res => {
                    if (res.data.success) {
                        setEdit(prevState => ({ ...prevState, loader: false }));
                        setEdit(prevState => ({ ...prevState, room: res.data.message }))
                    } else {
                        setEdit(prevState => ({ ...prevState, loader: false }));
                        navigateToLogin();
                    }
                })
        }
    }

    // Navigate back to login screen incase of session expires!
    function navigateToLogin() {
        localStorage.clear();
        changeScreen();
    }

    // Change search congifuration interms of dropdown selection!
    function changeSearchConfig(value){
        setSearchConfig({sort: value, search: ""}); // Setting the search back to the initial state ""!
    }

    // Get the occupied rooms data!
    useEffect(() => {
        getData();
    }, [])

    return (
        <div>
            {
                edit.loader ? (
                    <Loading message={edit.message} />
                ) : (
                    <div>
                        <Navbar id={id} name={splitedIds[1]} className="sticky" />
                        <div className = "text-center">
                            <div>
                                <h3 className = "heading-top topic-off">
                                    Customer Editable Details
                                </h3>
                            </div>
                        </div>
                        <div className='grid-system-search'>
                            <div class="container">
                                <div className="row">
                                    <div className="col-8">
                                        <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" name = {searchConfig.search} value = {searchConfig.search} onChange = {(e) => setSearchConfig(prevState => ({...prevState, search: e.target.value}))} />
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
                                        edit.room.filter((value) => {
                                            if (searchConfig.sort == "Room No") {
                                                return value.roomno.toLowerCase().includes(searchConfig.search.toLowerCase());
                                            } else if (searchConfig.sort == "Room Type") {
                                                return value.suiteName.toLowerCase().includes(searchConfig.search.toLowerCase());
                                            } else if (searchConfig.sort == "Show All") {
                                                return value.roomno.toLowerCase().includes(searchConfig.search.toLowerCase()) || value.suiteName.toLowerCase().includes(searchConfig.search.toLowerCase());
                                            }
                                        }).map((item, key) => {
                                            return (
                                                <HomeRoom edit={true} lodgeName={splitedIds[1]} extraBedPrice={item.extraBedPrice} extraBeds={item.extraCount} roomno={item.roomno} engaged={item.isOccupied} roomtype={item.suiteName} bedcount={item.bedCount}
                                                    roomid={item._id} id={id} lodgeid={splitedIds[0]} price={item.price} isPrebook = {false}
                                                    prebook={item.preBooked} prevalid={item.preValid} discount={item.discount} 
                                                 />
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default EditRoom;