import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Variables from './Variables';
import Loading from './Loading';
import DishUpdate from './DishUpdate';
import changeScreen from "./Action";
import { Link, useParams } from "react-router-dom";
import axios from 'axios';
import CustomError from './CustomError';

const UpdateDishes = () => {

    const [data, setData] = useState([]);
    const [load, setLoad] = useState(false);

    // Options
    const [options, setOptions] = useState([]);

    const { id } = useParams();
    const splitedIds = id.split(/[-]/);
    
    //Loader
    const [loading, setLoading] = useState(false);

    const getData = () => {
        console.log(load);
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
                    if(res.data.success){
                        setLoading(false);
                        setData(res.data.message)
                    } else {
                        setLoading(false);
                        localStorage.clear();
                        changeScreen();
                    }
                })
        }
        setLoad(false);
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


    const getOptions = () => {
        setLoading(true);
        axios.post(`${Variables.hostId}/${splitedIds[0]}/alldishtype`)
            .then(res => {
                if (res.data.success) {
                    setLoading(false);
                    setOptions(res.data.message);
                } else {         
                    setLoading(false);
                    return;
                }
            })
    }

    useEffect(() => {
        getOptions();
    }, [])


    return (
        <div>
            {
                data ? (
                    loading ? (
                      <Loading />
                    ) : (
                      <div>
                          <Navbar id={id} name={splitedIds[1]} />
                          <div className="text-center">
                              <div>
                                  <h3 className='heading-top topic-off'>
                                      Update Dish Data!
                                  </h3>
                              </div>
                          </div>
                          <div className="grid-system">
                              <div className="container">
                                  <div className='row'>
                                      {
                                          data.map((item, key) => {
                                              return (
                                                  <DishUpdate dishname={item.dishName} dishrate={item.dishRate} dishtype={item.dishType} engaged={item.available} id={id} dishid={item._id} setLoad={setLoad} lodgeId = {splitedIds[1]} options = {options} />
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

export default UpdateDishes