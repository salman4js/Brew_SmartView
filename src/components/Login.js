import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Variables from './Variables';
import Loading from "./Loading";
import axios from 'axios';
import Modals from "./Modals";
import { defaultStorage } from '../Controller/Storage/Storage';

const Login = () => {

  let navigate = useNavigate();

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();
  const [show, setShow] = useState(false);

  // Loader
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleShow = () => {
    setShow(false);
    setError(undefined);
  }

  async function checkConfig(id, lodgeName){
    // Check for is gst enabled and hourly basis enabled!
    await axios.get(`${Variables.hostId}/${id}/check-matrix`)
      .then(res => {
        if(res.data.success){
          // Set isGst and isHourly basis in localstorage!
          const data = {
            "isGst" : res.data.isGstEnabled,
            "isHourly" : res.data.isHourly,
            "isChannel": res.data.isChannel,
            "updatePrice" : res.data.updatePrice,
            "isExtra": res.data.isExtra,
            "area" : res.data.address,
            "emailId": res.data.emailId
          }

          // Populate the modal into localstorage!
          defaultStorage(data);
          setMessage("Navigating to dashboard...");
          // If account is not locked, allow the user to the base!
          navigate(`/${id}-${lodgeName}/dashboard`, { replace: true })

        } else {
          setLoading(false);
          setError(res.data.message)
          setShow(!show);
        }
      })
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
              setError(res.data.isLockedMessage);
              setLoading(false); // Close off the loader!
              setShow(res.data.isLocked);
            } else {
              setMessage("Validating your config file...");
              
              const defaultData = {
                "gstin" : res.data.gstin,
                "pan" : res.data.pan,
                "owner-name" : res.data.name,
                "owner-number" : res.data.number
              }
              
              defaultStorage(defaultData);
              
              await checkConfig(res.data.hostId, res.data.lodgename);
            }
          } else {
            setLoading(false);
            setError(res.data.message)
            setShow(!show);
          }
        })
    }
    setTimeout(handleShow(), 3000)
  }

  useEffect(() => {
    localStorage.clear();
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
                          error == undefined ? (
                            <div>
                            </div>
                          ) : (
                            <Modals show={show} message={error} setShow = {(data) => setShow(data)} />
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