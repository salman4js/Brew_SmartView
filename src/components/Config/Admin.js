import React, { useState } from 'react';
import axios from 'axios';
import Success from '../ToastHandler/Success';
import Error from '../ToastHandler/Error';
import Variables from '../Variables';

const Admin = () => {

  // Input handler!
  const [lodge, setLodge] = useState();
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();
  const [branch, setBranch] = useState();
  const [area, setArea] = useState();

  // Toast message handler!
  const [success, setSuccess] = useState(false)
  const [successText, setSuccessText] = useState();

  const successHandler = () => {
    setSuccess(!success);
  }

  // Sending data to the server!
  const processData = () => {
    const data = {
      username: lodge,
      password: password,
      emailId: email,
      area: area,
      branch: branch,
    }
    axios.post(`${Variables.hostId}/addlodge`, data)
      .then(res => {
        if (res.data.success) {
          setSuccess(!success);
          setSuccessText(res.data.message);
        } else {
          setSuccess(!success);
          setSuccessText(res.data.message);
        }
      })
  }

  return (
    <div className="container text-center align-down" style={{ display: "flex", justifyContent: "center" }}>
      <div className="row text-center">
        <div className="col">
          <div className="card text-center" style={{ width: "50vh" }}>
            <div className="card-header" style={{ color: 'black' }}>
              Admin-Config
            </div>
            <div className="card-body">
              <div className="modal-gap">
                <label style={{ color: "black" }}> Lodge Name </label>
                <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Lodge Name" onChange={(e) => setLodge(e.target.value)} />
              </div>
              <div className="modal-gap">
                <label style={{ color: "black" }}> Password </label>
                <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="modal-gap">
                <label style={{ color: "black" }}> Email </label>
                <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Email Id" onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="modal-gap">
                <label style={{ color: "black" }}> Branch </label>
                <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Branch" onChange={(e) => setBranch(e.target.value)} />
              </div>
              <div className="modal-gap">
                <label style={{ color: "black" }}> Area </label>
                <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Area" onChange={(e) => setArea(e.target.value)} />
              </div>
              <button className="btn btn-success" onClick={() => processData()}> Save </button>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card text-center" style={{ width: "50vh" }}>
            <div className="card-header" style={{ color: 'black' }}>
              Admin-Config
            </div>
            <div className="card-body">

            </div>
          </div>
        </div>
      </div>
      {/* Success Handler */}
      {
        success ? (
          <Success show={success} text={successText} handleClose={successHandler} />
        ) : (
          <div>

          </div>
        )
      }
    </div>
  )
}

export default Admin;