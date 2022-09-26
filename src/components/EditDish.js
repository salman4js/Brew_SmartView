import React from 'react';
import Navbar from './Navbar';
import {Link, useParams} from "react-router-dom";

const EditDish = () => {
  
  const {id} = useParams();
  
  const splitedIds = id.split(/[-]/);
  
  return (
    <div>
        <Navbar id = {id} name = {splitedIds[1]} />
        <div className = 'align-down'>
            <div className='container text-center' style={{ display: "flex", justifyContent: "center" }}>
              <div class="card text-center" style={{ width: "50vh" }}>
                  <div class="card-header" style={{ color: "black" }}>
                      Edit Dish Data Type - Feautured
                  </div>
                  <div class="card-body">
                      <div className='modal-gap'>
                          <label style={{ color: "black" }}> Dish Type </label>
                          <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Dish Type" />
                      </div>
                      <br />
                      <button className='btn btn-info'> Add Data </button>
                  </div>
              </div>
          </div>
        </div>
    </div>
  )
}

export default EditDish