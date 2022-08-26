import React, {useState, useEffect} from 'react';
import Navbar from './Navbar';
import Variables from './Variables';
import HomeDishes from './HomeDishes';
import { Link, useParams } from "react-router-dom";
import axios from 'axios';

const Dishes = () => {

    const { id } = useParams();

    const splitedIds = id.split(/[-]/);

    const [load, setLoad] = useState(false);

    const [data, setData] = useState([]);

    const getData = () => {
        axios.post(`${Variables.hostId}/${splitedIds[0]}/dishlodge`)
        .then(res => {
            setData(res.data);
        })
    }

    useEffect(() => {
        getData();
    },[])

    return (
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
                            data.map((item,key) => {
                                return(
                                    <HomeDishes key = {key} dishname = {item.dishName} dishrate = {item.dishRate} dishtype = {item.dishType} available = {item.available} load = {setLoad} id = {id} lodgeid = {splitedIds[0]}  />
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dishes