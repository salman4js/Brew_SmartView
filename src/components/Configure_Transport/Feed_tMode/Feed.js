import React, { useState, useEffect, useRef } from 'react';
import Variables from '../../Variables';
import axios from 'axios';

const Feed = (props) => {

  // Delete t_mode functionality
  const onDelete = (id) => {
    props.loader(true);
    const data = {
      tMode_id : id
    }
    axios.post(`${Variables.hostId}/${props.lodgeId}/delete_tMode`, data)
      .then(res => {
        if (res.data.success) {
          props.loader(false);
          props.parentFunction();
        } else {
          props.loader(false);
          props.error(true);
          props.errormessage(res.data.message);
        }
      })
  }

  return (
    <div>
      <div className="t_mode">
        <div className="reminder" style={{ color: "black" }}>
          <div className="col">
            <div className="row">
              <div className="col-10" align="left">
                {props.t_mode}
              </div>
              <div className="col">
                <i className="bi bi-bag-x-fill" onClick={() => onDelete(props.t_mode_id)}>

                </i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Feed