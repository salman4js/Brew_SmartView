import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import CustomError from './CustomError';
import changeScreen from './Action';
import { Link, useNavigate, useParams } from "react-router-dom";
import Variables from './Variables';
import Loading from './Loading';
import axios from "axios";
import HomeRoom from './HomeRoom';


const LandingPage = () => {

    const { id } = useParams();

    let navigate = useNavigate();

    const splitedIds = id.split(/[-]/);

    const [room, setRoom] = useState([]);

    const [load, setLoad] = useState("");
    
    //Loader
    const [loading, setLoading] = useState(false);

    // Search Configuration
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("Show All");

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
                    if(res.data.success){
                        setLoading(false);
                        setRoom(res.data.message)
                        console.log(res.data.message)
                    } else {
                        setLoading(false);
                        localStorage.clear();
                        changeScreen();
                    }
                })
        }
    }

    // Changing search and sort value back to original state or selected state!
    const changeSearchConfig = (value) => {
        setSort(value);
        setSearch("");
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
                                      {splitedIds[1]} - Dashboard
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
                                                <select class = "form-select" arai-label = "Sort by" placeholder = "Sort By" onChange = {(e) => changeSearchConfig(e.target.value)}>
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
                                        room.filter((value) => {
                                            console.log(sort)
                                            if(sort == "Room No"){
                                                return value.roomno.toLowerCase().includes(search.toLowerCase());
                                            } else if(sort == "Room Type"){
                                                return value.suiteName.toLowerCase().includes(search.toLowerCase());
                                            } else if (sort == "Show All"){
                                                return value.roomno.toLowerCase().includes(search.toLowerCase()) || value.suiteName.toLowerCase().includes(search.toLowerCase());
                                            }
                                        }).map((item, key) => {
                                              return (
                                                  <HomeRoom roomno={item.roomno} engaged={item.isOccupied} roomtype={item.suiteName} bedcount={item.bedCount} roomid={item._id} id={id} setLoad={setLoad} lodgeid = {splitedIds[0]} price = {item.price} />
                                              )
                                          })
                                      }
                                  </div>
                              </div>
                          </div>
                      </div >
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

export default LandingPage