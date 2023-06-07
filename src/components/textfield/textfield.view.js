import React from 'react';

const TextField = (props) => {

  return(
    props.data.map((options, key) => {
      return(
        <div className="modal-gap">
            <label style={{ color: "black" }}> {options.placeholder} </label>
            <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" 
            placeholder={options.value} onChange = {(event) => props.handleInputChange(key, event)}/>
        </div>
      )
    })
  )
  
}

export default TextField;