import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CustomError from '../CustomError';
import Loading from '../Loading';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../Navbar';
import Variables from '../Variables';
import Prebook_component from './src/Prebook_component';

const Prebook_rooms = () => {

  // Getting ID from the URL
  const { id } = useParams();
  const splitedIds = id.split(/[-]/);

  // Pre Booking room data
  const [data, setData] = useState([]);

  // Loader
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(false);

  // Getting the data from the Database
  const getData = () => {
      setLoading(true);
      // JWT token
      const token = localStorage.getItem("token");
      if(!token){
        setData(false);
      } else {
        axios.post(`${Variables.hostId}/${splitedIds[0]}/showallprebookedrooms`)
          .then(res => {
            if(res.data.success){
                setLoading(false);
                setData(res.data.message);
            } else {
              setLoading(false);
              // Modal for rest call failure!
            }
          })
      }
      setLoad(false);
  }

  // Loading the data from the server
  useEffect(() => {
    getData();
  }, [load])

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
                                    Pre-Book Dashboard
                                </h3>
                            </div>
                        </div>
                        <div className='grid-system'>
                            <div class="container">
                                <div class="row">
                                    {
                                        data.map((item, key) => {
                                            return (
                                                <Prebook_component setLoad = {setLoad} roomno={item.roomno} customername = {item.prebookUsername} phonenumber = {item.prebookPhoneNumber} secphonenumber = {item.prebookSecondNumber} adults = {item.prebookAdults} childrens = {item.prebookChildren} aadhar = {item.prebookAadharCard} dateofcheckin = {item.prebookDateofCheckin} dateofcheckout = {item.prebookDateofCheckout} advance = {item.prebookAdvance} roomid = {item.room} lodgeid = {item.lodge} prebookuser = {item._id} prebookprice = {item.prebookprice}/>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    )
                ) : (
                    <CustomError />
                )
            }
        </div>

  )
}

export default Prebook_rooms;