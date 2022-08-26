import React, {useState, useEffect} from 'react';
import Navbar from './Navbar';
import Variables from './Variables';
import DishUpdate from './DishUpdate';
import { Link, useParams } from "react-router-dom";
import axios from 'axios';

const UpdateDishes = () => {

    const [data,setData] = useState([]);
    const [load, setLoad] = useState();

    const { id } = useParams();
    const splitedIds = id.split(/[-]/);

    const getData = () => {
        axios.post(`${Variables.hostId}/${splitedIds[0]}/dishlodge`)
        .then(res => {
            setData(res.data);
        })
    }


    useEffect(() => {
        getData()
    },[load])

    return (
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
                            data.map((item,key) => {
                                return(
                                    <DishUpdate dishname = {item.dishName} dishrate = {item.dishRate} dishtype = {item.dishType} engaged = {item.available} id = {id} dishid = {item._id} setLoad = {setLoad} />
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpdateDishes