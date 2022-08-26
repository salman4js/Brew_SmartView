import React, {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import Variables from './Variables';
import axios from 'axios';
import Modals from "./Modals"



const Login = () => {

  let navigate = useNavigate();

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();
  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow(false);
    setError(undefined);
  }

  const processData = async (e) => {
    e.preventDefault();

    if(username.length <= 0 & password.length <= 0){
      alert("Please input a valid username");
    } else {
      const credentials = {
        username : username,
        password : password
      }
      axios.post(`${Variables.hostId}/loginlodge`, credentials)
      .then(res => {if(res.data.success){
        setError("");
        navigate(`/${res.data.hostId}-${res.data.lodgename}/landingpage`, {replace : true})
      } else {
        setError(res.data)
        setShow(true);
      }})
    }
    setTimeout(handleShow(), 3000)
  }

  return (
    <div>
      <div className='container text-center'>
        <div className='heading-div2'>
            <h1 className = "heading-top">
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
                  <input type="text" className="form-control-inline form-control-lg" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="User Name" name = {username} value = {username} onChange = {(e) => setUsername(e.target.value) }/>
                  <br />
                  <small id="emailHelp" class="form-text text-muted">We'll never share your user name with anyone else.</small>
                  <br />
                  
                  <input type="password" className="form-control-inline form-control-lg" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Password" name = {password} value = {password} onChange = {(e) => setPassword(e.target.value) }/>
                </div>
                <br />
                <br />
                <div className="submitButton text-center">
                  <button className = "btn btn-outline-success" onClick = {processData}> Get Me In! </button>
                  <br />
                  <br />
                  {
                   error == undefined ? (
                    <div>
                    </div>
                   ) : (
                    <Modals show = {show} message = {error.message} />
                   )
                  }
                </div>
              </form>
            </div>
          </div>
        </div>
    </div>

  )
}

export default Login