import React from 'react';

const TextField = (props) => {

  return(
    <div className="modal-gap">
        <label style={{ color: "black" }}> {props.data.placeholder} </label>
        <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" 
        placeholder={props.data.value} onChange = {(event) => props.handleInputChange(props.index, event)} />
    </div>
  )
  
}

export default TextField;