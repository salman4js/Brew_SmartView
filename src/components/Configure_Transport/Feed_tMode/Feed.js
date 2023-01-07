import React, { useState, useEffect, useRef } from 'react';
import Variables from '../../Variables';
import axios from 'axios';

const Feed = (props) => {

  return (
    <div>
      <div className="t_mode">
        <div className="reminder" style={{ color: "black" }}>
          <div className="col">
            <div className="row">
              <div className="col-10" align="left">
                {props.name}
              </div>
              <div className="col">
                <i className="bi bi-bag-x-fill" onClick={() => props.onDelete(props.id)}>

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