import React, { useState, useEffect } from 'react';
import Variables from './Variables';
import {useDispatch} from 'react-redux';
import {useGlobalMessage} from './global.state/global.state.manager';
import {createGlobalMessage, killGlobalMessage} from '../global.state/actions/index';
import ProgressPanel from './progresspanel/progresspanel.view/progresspanel.view';
import axios from 'axios';
import LogoTop from '../Assets/logo512.png';
import { Link, useParams } from "react-router-dom";
import { getStorage } from '../Controller/Storage/Storage';


const Navbar = (props) => {

    //Check the ID and token of the application!
    const { id } = useParams();
    const splitedIds = id.split(/[-]/);
    
    
    // Global Message handler!
    var globalMessage = useGlobalMessage();
    var dispatch = useDispatch();
    
    // Check if logged in as manager or not!
    function isLoggedInAsManager(){
      return !(JSON.parse(getStorage("loggedInAsRecep")))
    }
    
    // Check if refund tracker is enabled or not!
    function isRefundTrackerEnabled(){
      return JSON.parse(getStorage("isRefundTrackerEnabled"));
    }
    
    // Check if livixius has been linked with vouchers!
    function isLinkedWithVouchers(){
      return JSON.parse(getStorage('is-linked-with-vouchers'));
    }

    // config options handler!
    const [options, setOptions] = useState([]);

    // Config Insights check
    var isInsights = JSON.parse(getStorage("isInsights"));
    
    // Permission levels!
    var loggedInAsRecep = JSON.parse(getStorage("loggedInAsRecep"));
    
    // Render progress panel icon1
    function renderProgressPanelIcon(){
      return(
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="blue" class="bi bi-chat-left-text-fill" viewBox="0 0 16 16">
          <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793V2zm3.5 1a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z"/>
        </svg>
      )
    }
    
    // Check global state for universal message, If message found return the message, If not fetch from the server!
    function checkGlobalStateForMessage(){
      const state = {
        success: globalMessage ? false : true,
        message: {show: true, message: globalMessage.value},
        status: globalMessage.status
      }
      
      return state;
    }
    
    // Trigger the global message!
    function _triggerGlobalMessage(value){
      dispatch(createGlobalMessage(value));
    }
    
    // Never trigger the universal message untill the next session!
    function _neverTriggerUniversalMessage(value){
      dispatch(killGlobalMessage(value));
    }
    
    // Should render universal message!
    function shouldRenderUniversalMessage(){
      return globalMessage.status === 'SHOW' ? true : false
    }
    
    // Fetch and show universal message!
    async function fetchUniversalMessage(){
      var fetch = checkGlobalStateForMessage();
      if(fetch.status === "FETCH"){
        const result = await axios.get(`${Variables.hostId}/${splitedIds[0]}/getuniversalmessage`);
        if(result.data.state){
          _triggerGlobalMessage(result.data.message)
        } else { // Which means universal message has been died!
          _neverTriggerUniversalMessage(result.data.message)
        }
      } else if(fetch.status === "SHOW") {
        _triggerGlobalMessage(fetch.message)
      }
    }
    
    // Kill the universal message and never show it again untill the admin triggers!
    async function killGlobalMessageInServer(){
      axios.post(`${Variables.hostId}/${splitedIds[0]}/killuniversalmessage`)
        .then(result => {
          _neverTriggerUniversalMessage(result.data.message)
        }).catch(err => {
          // Problem while killing the universal message!
        })
    }

    useEffect(() => {
        setOptions(JSON.parse(getStorage("config-value")));
        fetchUniversalMessage();
    }, [])


    return (
        <nav className="navbar sticky-top navbar-expand-lg navbar-dark navbar-bg">
            <div className="container metadata-navbar-container">
                <a className="navbar-brand metadata-navbar-leftside" href="#">
                    <div className='row'>
                        <div className="col">
                            <img src={LogoTop} width="30" height="30" className="d-inline-block align-top" alt="" />
                        </div>
                        <div className="col stock">
                            {props.name}
                        </div>
                    </div>
                </a>
                {shouldRenderUniversalMessage() && (
                  <ProgressPanel message = {globalMessage.value} toolTip = {"Mark as read"} onClose = {() => killGlobalMessageInServer()} renderIcon = {() => renderProgressPanelIcon()} />
                )}
                <div className = "metadata-navbar-rightside">
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
                                                <li>
                                                  <a class="dropdown-item" href="#"> Prebook rooms &raquo; </a>
                                                  <ul class="dropdown-menu dropdown-submenu dropdown-submenu-left">
                                                      <Link className='nav-link dropdown-item' to={`/${props.id}/prebookcheckin`} style={{ color: "black" }}> Pre Book Rooms </Link>
                                                      <Link className='nav-link dropdown-item' to={`/${props.id}/prebookrooms`} style={{ color: "black" }}> All Prebooked Rooms</Link>
                                                  </ul>
                                                </li>
                                              )
                                          }
                                      })
                                  }
                                  {!loggedInAsRecep && <Link className='nav-link dropdown-item' to={`/${props.id}/addrooms`} style={{ color: "black" }}> Add Rooms </Link>}
                                  {!loggedInAsRecep && <Link className='nav-link dropdown-item' to={`/${props.id}/updaterooms`} style={{ color: "black" }}> Update Rooms </Link>}
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
                                      {!loggedInAsRecep && <a class="dropdown-item" href="#"> Configure Settings &raquo; </a>}
                                      <ul class="dropdown-menu dropdown-submenu dropdown-submenu-left">
                                          <Link className='nav-link dropdown-item' to={`/${props.id}/configure`} style={{ color: "black" }}> Add Room Type </Link>
                                          <Link className='nav-link dropdown-item' to={`/${props.id}/editconfig`} style={{ color: "black" }}> Edit Room Type Data</Link>
                                          {isLoggedInAsManager() && (
                                            <Link className='nav-link dropdown-item' to={`/${props.id}/managerecep`} style={{ color: "black" }}> Add Multiple Account </Link>
                                          )}
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
                                          {isInsights && <Link className="nav-link dropdown-item" to={`/${props.id}/chart-dashboard`} style={{ color: "black" }}>Insights</Link>}
                                          <Link className='nav-link dropdown-item' to={`/${props.id}/contentnative`} style={{ color: "black" }}> Generate Reports </Link>
                                      </ul>
                                  </li>
                                  <Link className='nav-link dropdown-item' to={`/${props.id}/editroom`} style={{ color: "black" }}> Edit Customer Details </Link>
                                  {isLinkedWithVouchers() && (
                                    <Link className='nav-link dropdown-item' to={`/${props.id}/vouchers`} style={{ color: "black" }}> Vouchers Tracker </Link>
                                  )}
                                  <Link className='nav-link dropdown-item' to={`/${props.id}/paymenttracker`} style={{ color: "black" }}> Payment Tracker </Link>
                                  {isRefundTrackerEnabled() && (
                                    <Link className='nav-link dropdown-item' to={`/${props.id}/refundtracker`} style={{ color: "black" }}> Refund Tracker </Link>
                                  )}
                                  {!loggedInAsRecep && <Link className='nav-link dropdown-item' to={`/${props.id}/userdb`} style={{ color: "black" }}>   Booking History </Link>}
                                  <Link className='nav-link dropdown-item' to={`/login`} style={{ color: "black" }}>   LogOut </Link>
                              </div>
                          </li>
                      </ul>
                  </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
