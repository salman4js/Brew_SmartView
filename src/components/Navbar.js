import React, { useState, useLayoutEffect } from 'react';
import Variables from './Variables';
import axios from 'axios';
import LogoTop from '../Assets/logo512.png';
import { Link, useParams } from "react-router-dom";

const Navbar = (props) => {

    //Check the ID and token of the application!
    const { id } = useParams();
    const splitedIds = id.split(/[-]/);

    // config options handler!
    const [options, setOptions] = useState([]);


    // Check the config for the enabled chicklets!
    const checkConfig = () => {
        axios.get(`${Variables.hostId}/${splitedIds[0]}/config-checking`)
            .then(res => {
                if (res.data.success) {
                    setOptions(res.data.message);
                } else {
                    console.error(res.data.message);
                }
            })
        console.log(options);
    }

    // Getting the config data before the DOM renders!
    useLayoutEffect(() => {
        checkConfig();
    }, [])

    return (
        <nav className="navbar sticky-top navbar-expand-lg navbar-dark navbar-bg">
            <div className="container">
                <a className="navbar-brand" href="#">
                    <div className='row'>
                        <div className="col">
                            <img src={LogoTop} width="30" height="30" className="d-inline-block align-top" alt="" />
                        </div>
                        <div className="col stock">
                            {props.name}
                        </div>
                    </div>
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ml-auto"  >
                        <li className="nav-item active">
                            <Link className="nav-link" to={`/${props.id}/dashboard`} style={{ color: "white" }} > Home </Link>
                        </li>
                        <li class="nav-item dropdown">
                            <Link class="nav-link dropdown-toggle" to={`/${props.id}/rooms`} id="navbarDropdownMenuLink" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Rooms
                            </Link>
                            <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                <Link className="nav-link dropdown-item" to={`/${props.id}/landingpage`} style={{ color: "black" }}> Check-In Rooms </Link>
                                <Link className='nav-link dropdown-item' to={`/${props.id}/rooms`} style={{ color: "black" }}> Available Rooms</Link>
                                {
                                    options.map((item, key) => {
                                        if (item.config === 'PreBook') {
                                            return (
                                                <Link className='nav-link dropdown-item' to={`/${props.id}/prebookrooms`} style={{ color: "black" }}> Pre-Book Rooms</Link>
                                            )
                                        }
                                    })
                                }
                                <Link className='nav-link dropdown-item' to={`/${props.id}/addrooms`} style={{ color: "black" }}> Add Rooms </Link>
                                <Link className='nav-link dropdown-item' to={`/${props.id}/updaterooms`} style={{ color: "black" }}> Update Rooms </Link>
                            </div>
                        </li>
                        {
                            options.map((item, key) => {
                                if (item.config === 'Dish') {
                                    return (
                                        <li class="nav-item dropdown">
                                            <Link class="nav-link dropdown-toggle" to={`/${props.id}/rooms`} id="navbarDropdownMenuLink" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                Dishes
                                            </Link>
                                            <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                                <Link className='nav-link dropdown-item' to={`/${props.id}/dishes`} style={{ color: "black" }}> All Dishes </Link>
                                                <Link className='nav-link dropdown-item' to={`/${props.id}/adddishes`} style={{ color: "black" }}> Add Dishes </Link>
                                                <Link className='nav-link dropdown-item' to={`/${props.id}/updatedishes`} style={{ color: "black" }}> Update Dishes </Link>
                                            </div>
                                        </li>
                                    )
                                }
                            })
                        }
                        {
                            options.some(option => option.config === 'Dish') || options.some(option => option.config === 'Transport')
                                ?
                                <li className='nav-item active'>
                                    <Link className="nav-link" to={`/${props.id}/notifications`} style={{ color: "white" }} > Notifications </Link>
                                </li>
                                :
                                null
                        }
                        <li class="nav-item dropdown">
                            <Link class="nav-link dropdown-toggle" to={`/login`} id="navbarDropdownMenuLink" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {/* <img src={settings} width="30" height="30" alt="" /> */}
                                Settings
                            </Link>
                            <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                {/* <Link className='nav-link dropdown-item' to={`/${props.id}/configure`} style={{ color: "black" }}> Configure Bill </Link> */}
                                <li>
                                    <a class="dropdown-item" href="#"> Configure Settings &raquo; </a>
                                    <ul class="dropdown-menu dropdown-submenu dropdown-submenu-left">
                                        <Link className='nav-link dropdown-item' to={`/${props.id}/configure`} style={{ color: "black" }}> Add Room Type </Link>
                                        <Link className='nav-link dropdown-item' to={`/${props.id}/editconfig`} style={{ color: "black" }}> Edit Room Type Data</Link>
                                        {
                                            options.map((item, key) => {
                                                if (item.config === 'Dish') {
                                                    return (
                                                        <>
                                                            <Link className='nav-link dropdown-item' to={`/${props.id}/editdish`} style={{ color: "black" }}> Add Dish Type </Link>
                                                            <Link className='nav-link dropdown-item' to={`/${props.id}/generator`} style={{ color: "black" }}> Generate QR code  </Link>
                                                        </>
                                                    )
                                                }
                                            })
                                        }
                                        {
                                            options.map((item, key) => {
                                                if (item.config === 'Transport') {
                                                    return (
                                                        <>
                                                            <Link className='nav-link dropdown-item' to={`/${props.id}/addmode`} style={{ color: "black" }}> Add Transport Mode </Link>
                                                            <Link className='nav-link dropdown-item' to={`/${props.id}/addData`} style={{ color: "black" }}>   Configure Transport </Link>
                                                        </>
                                                    )
                                                }
                                            })
                                        }
                                        <Link className="nav-link dropdown-item" to={`/${props.id}/chart-dashboard`} style={{ color: "black" }}>Insights</Link>
                                        <Link className='nav-link dropdown-item' to={`/${props.id}/contentnative`} style={{ color: "black" }}> Generate Reports </Link>
                                    </ul>
                                </li>
                                <Link className='nav-link dropdown-item' to={`/${props.id}/userdb`} style={{ color: "black" }}>   Booking History </Link>
                                <Link className='nav-link dropdown-item' to={`/login`} style={{ color: "black" }}>   LogOut </Link>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar