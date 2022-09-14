import React from 'react'
import LogoTop from '../Assets/logo512.png';
import { Link } from "react-router-dom";

const Navbar = (props) => {
    console.log(props.id)
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark shadow-5-strong">
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
                                <Link className="nav-link" to={`/${props.id}/landingpage`} style={{ color: "white" }} > Home </Link>
                            </li>
                            <li class="nav-item dropdown">
                                <Link class="nav-link dropdown-toggle" to={`/${props.id}/rooms`} id="navbarDropdownMenuLink" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Rooms
                                </Link>
                                <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                    <Link className='nav-link dropdown-item' to={`/${props.id}/rooms`} style={{ color: "black" }}> Available Rooms</Link>
                                    <Link className='nav-link dropdown-item' to={`/${props.id}/addrooms`} style={{ color: "black" }}> Add Rooms </Link>
                                    <Link className='nav-link dropdown-item' to={`/${props.id}/updaterooms`} style={{ color: "black" }}> Update Rooms </Link>
                                </div>
                            </li>
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
                            <li className='nav-item active'>
                                <Link className="nav-link" to={`/${props.id}/notifications`} style={{ color: "white" }} > Notifications </Link>
                            </li>
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
                                            <Link className='nav-link dropdown-item' to = {`/${props.id}/editconfig`} style = {{color : "black"}}> Edit Room Type Data</Link>
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
        </div>
    )
}

export default Navbar