import React from 'react';
import {Link, Navigate, useNavigate} from 'react-router-dom'; 


const CustomError = () => {
    let navigate = useNavigate()
    const changeScreen = () => {
        navigate("/login", {replace : true})
    }
    return (
        <div className='container text-center' style={{ display: "flex", justifyContent: "center" }}>
            <div class="card text-center" style={{ width: "50vh", marginTop : "200px" }}>
                <div class="card-header" style={{ color: "black" }}>
                    Session Expired
                </div>
                <div class="card-body">
                    <div style = {{color : "black"}}>
                        This session has been expired, You will have to Login again!
                    </div>
                    <br />
                    <button className='btn btn-info' onClick = {changeScreen}> Log-In </button>
                </div>
            </div>
        </div>
    )
}

export default CustomError