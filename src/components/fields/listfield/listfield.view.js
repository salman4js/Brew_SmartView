import React from 'react';
import { getStyle } from '../../common.functions/common.functions'

const ListField = (props) => {
  
  // Handle input change for the metadata fields!
  function inputChange(event){
    // Pass the selected value to the parent base class(Metadata)!
    props.handleInputChange(props.index, event, props.data.attribute)
  }
  
  // Get selected value for the options!
  function getSelected(){
    return props.data.value !== undefined ? props.data.value : props.data.placeholder;
  }
  
  return(
    <div className = "modal-gap text-center">
      <label className = "metadata-label" style = {getStyle(props.data.style)}> {props.data.label} </label>
      <select className = "form-control" onChange = {(event) => inputChange(event)}>
        <option value="" disabled selected>{getSelected()}</option>
        {props.data?.options?.map((opts, key) => {
          return(
            <option>{opts.value}</option>
          )
        })}
      </select>
    </div>
  )
}

export default ListField;