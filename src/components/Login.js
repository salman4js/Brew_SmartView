import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Variables from './Variables';
import {useDispatch} from 'react-redux';
import {initializeGlobalMessage} from '../global.state/actions/index';
import Loading from "./Loading";
import axios from 'axios';
import Modals from "./Modals";
import { defaultStorage, setStorage } from '../Controller/Storage/Storage';
import CollectionInstance from '../global.collection/widgettile.collection/widgettile.collection';
import {_checkForSecureConnections} from "./common.functions/common.functions";

const Login = () => {

  let navigate = useNavigate();
  
  var dispatch = useDispatch();

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();
  const [show, setShow] = useState(false);

  // Loader
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Error handler!
  const [errorHandler, setErrorHandler] = useState({
    show: false,
    message: false,
    header: false,
    headerText: undefined,
  })

  const handleShow = () => {
    setErrorHandler({
      ...errorHandler,
      show: false,
      message: undefined,
      header: false,
      headerText: undefined
    })
  }

  async function checkConfig(id, lodgeName){
    // Check for is gst enabled and hourly basis enabled!
    await axios.get(`${Variables.hostId}/${id}/check-matrix`)
      .then(res => {
        if(res.data.success){
          // Update the globalMessage status to FETCH since we have to fetch it for the first time when user logins!
          _updateGlobalMessageStatus();
          // Set isGst and isHourly basis in localstorage!
          const data = {
            "isGst" : res.data.object.isGst,
            "isHourly" : res.data.object.isHourly,
            "isChannel": res.data.object.isChannel,
            "updatePrice" : res.data.object.updatePrice,
            "isExtra": res.data.object.isExtra,
            "isExclusive": res.data.object.isExclusive,
            "area" : res.data.object.address,
            "emailId": res.data.object.emailId,
            "isInsights": res.data.object.isInsights,
            "isSpecific": res.data.object.isSpecific,
            "canDelete": res.data.object.canDelete,
            "extraCalc": res.data.object.extraCalc,
            "isGrcPreview": res.data.object.grcPreview,
            "removePan": res.data.object.removePan,
            "printManager": res.data.object.printManager,
            "validateInvoiceDetails": res.data.object.validateInvoiceDetails,
            "refundPercentage": res.data.object.refundPercentage,
            "isRefundTrackerEnabled": res.data.object.refundTracker !== undefined ? res.data.object.refundTracker : false,
            'isAdvanceRestricted': res.data.object.restrictAdvance,
            'isCheckinDateEditable': res.data.object.checkinDateEditable,
            'is-linked-with-vouchers': res.data.object.linkVouchersWithLivixius,
            'showFullDetails': res.data.object.showFullDetails,
            'customHtmlForBillPreview': res.data.object?.customHtmlContent?.billPreview?.isEnabled,
            'customHtmlForHistoryPreview': res.data.object?.customHtmlContent?.historyPreview?.isEnabled,
            'customHtmlForPropertyRead': res.data.object?.customHtmlContent?.propertyReadRoom?.isEnabled
          };
          
          defaultStorage(data);
          setMessage("Validating User Preference");
        } else {
          setLoading(false);
          setError(res.data.message)
          setShow(!show);
        }
      })
  }
  
  // Update the global message status to 'FETCH';
  function _updateGlobalMessageStatus(){
    dispatch(initializeGlobalMessage())
  }

  // Check the config for the enabled chicklets!
  const checkOptions = async (lodgeId, lodgeName) => {
    setLoading(true);
    setMessage("Validating...")
    await axios.get(`${Variables.hostId}/${lodgeId}/config-checking`)
      .then(res => {
        if (res.data.success) {
          setStorage("config-value", JSON.stringify(res.data.message));
          setLoading(false)
        } else {
          setLoading(false);
          setError(res.data.message)
          setShow(!show);
        }
      })
  }

  // Navigate user to the dashboard!
  function navigateUser(id, lodgeName, redirect, hasMultipleLogins, isMultipleLogins, userPreferences){
    // If account is not locked, allow the user to the base!
    var dashboardRoutes = ['dashboard', 'dashboardcontainer'],
      dashboardRoute = userPreferences.dashboardVersion ? dashboardRoutes[1] : dashboardRoutes[0];
    const chooseRoute = (hasMultipleLogins && isMultipleLogins) ? "chooselogin" : dashboardRoute; // Navigate to chooselogin if multiple login is enabled!
    if(redirect === "livixius"){
      navigate(`/${id}-${lodgeName}/${chooseRoute}`, { replace: true })
    } else {
      navigate(`/${id}-${lodgeName}/vouchers`, { replace: true })
    }
  }

  // Register the service worker for push notifications!
  function _registerPushNotifications(){
    const options = {
      messageTitle: 'Notification From Livixius',
      messageBody: '1 Customer has to checkout within an hour',
      timings: [] // Populate this timing key with the actual checkout time for the current date. (Present Day)
    };
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.warn('Notification granted for Livixius!');
      }
    });

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage(options);
    }
  }

  const processData = async (e) => {
    e.preventDefault();
    
    // Enable loading and message!
    setLoading(!loading);
    setMessage("Authenticating...");

    if (username.length <= 0 & password.length <= 0) {
      alert("Please input a valid username");
    } else {
      const credentials = {
        username: username,
        password: password
      }
      axios.post(`${Variables.hostId}/loginlodge`, credentials)
        .then(async res => {
          setMessage("Validating your credentials...")
          if (res.data.success) {
            setLoading(!loading);
            setError("");
            localStorage.setItem("token", res.data.token);
            // Before Navigating to the landing page, check the accont lockout!
            setMessage("Checking for a account lockout...");
            if(res.data.isLocked){
              // Show Account Lockout Dialog!
              setLoading(false);
              const data = {
                show: true,
                message: res.data.isLockedMessage,
                header: true,
                headerText: "Warning!",
              }

              populateModal(data);
            } else {
              setMessage("Validating your config file...");
              
              const defaultData = {
                "gstin" : res.data.gstin,
                "pan" : res.data.pan,
                "owner-name" : res.data.name,
                "owner-number" : res.data.number,
                "lodge-name": res.data.lodgename,
                "redirectTo": res.data.redirect,
                "loggedInID": res.data.loginId,
                "multipleLogin" : res.data.multipleLogins
              }
              
              defaultStorage(defaultData);
              // Set the preferences in global collection, Incase of any refresh happens, the widgettile collection will be fetched from roomslist or from navbar!
              CollectionInstance.setCollections('widgetTileCollections', res.data.preferences);
              await checkConfig(res.data.hostId, res.data.lodgename); // Check for config matrix
              await checkOptions(res.data.hostId, res.data.lodgename); // Check for the config cabinets!
              // Before navigating the user to the corresponding dashboards, Register the service worker for push notifications.
              _registerPushNotifications();
              navigateUser(res.data.hostId, res.data.lodgename, res.data.redirect, res.data.hasMultipleLogins, res.data.multipleLogins, res.data.preferences); // Navigate to the dashboard
            }
          } else {
            setLoading(false);
            const data = {
              show: true,
              message: res.data.message,
              header: true,
              headerText: "Warning!",
            }

            populateModal(data);

          }
        })
    }
    setTimeout(handleShow(), 3000)
  }

  function populateModal(data){
    setErrorHandler({
      ...errorHandler,
      show: data.show,
      header: data.header,
      headerText: data.headerText,
      message: data.message
    })
  };
  
  // When the route changes to login in any circumstances,
  // delete the entire collection to keep the data in sync.
  function _updateGlobalCollections(){
    return CollectionInstance.deleteAllCollections();
  };
  
  useEffect(() => {
    // Check for local host instance, If its local host, block the request.
    if(_checkForSecureConnections()){
      setLoading(true);
    }
    localStorage.clear();
    _updateGlobalCollections();
  }, [])

  return (
    <div>
      {
        loading ? (
          <Loading message = {message} />
        ) : (
          <div>
            <div>
              <div className='container text-center'>
                <div className='heading-div2'>
                  <h1 className="heading-top">
                    YourLaza
                  </h1>
                  <p>
                    | Powered by Clusters
                  </p>
                </div>
              </div>
              <div className='container'>
                <div className='text-center'>
                  <div className="loginSection text-center">
                    <form>
                      <div className="form-group">
                        <br />
                        <br />
                        <input type="text" className="form-control-inline form-control-lg" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="User Name" name={username} value={username} onChange={(e) => setUsername(e.target.value)} />
                        <br />
                        <small id="emailHelp" class="form-text text-muted">We'll never share your user name with anyone else.</small>
                        <br />

                        <input type="password" className="form-control-inline form-control-lg" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Password" name={password} value={password} onChange={(e) => setPassword(e.target.value)} />
                      </div>
                      <br />
                      <br />
                      <div className="submitButton text-center">
                        <button className="btn btn-outline-success" onClick={processData}> Get Me In! </button>
                        <br />
                        <br />
                        {
                          errorHandler.show === false ? (
                            <div>
                            </div>
                          ) : (
                            <Modals options = {errorHandler} setShow = {(data) => handleShow(data)} />
                          )
                        }
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div>

  )
}

export default Login