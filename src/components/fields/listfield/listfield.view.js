import React from 'react';
import { getStyle } from '../../common.functions/common.functions'

const ListField = (props) => {

  // Handle input change for the metadata fields!
  function inputChange(event){
    // Pass the selected value to the parent base class(Metadata)!
    props.handleInputChange(props.index, event, props.data.attribute)
  };
  
  // Get selected value for the options!
  function getSelected(){
    return props.data.value !== undefined ? props.data.value : props.data.placeholder;
  };
  
  // Get value for the selected data!
  function getValue(opts){
    return opts.actualValue !== undefined ? opts.actualValue : opts.value;
  };

  return (
    <div className = "modal-gap" style = {{width: props.data.width, padding: props.data.padding}}>
      {props.data.label && (
        <label className = "metadata-label" style = {getStyle(props.data.style)}> {props.data.label} </label>
      )}
      <select className = "form-control" onChange = {(event) => inputChange(event)}>
        <option value="" disabled selected>{getSelected()}</option>
        {props.data?.options?.map((opts, key) => {
          if(!opts.value && Array.isArray(props.data.options)){
            var convertedOpts = convertIntoListFieldOptions(opts);
            return(
                <option value = {getValue(convertedOpts)}>{convertedOpts.value}</option>
            )
          } else {
            return(
                <option value = {getValue(opts)}>{opts.value}</option>
            )
          }
        })}
      </select>
    </div>
  )
}

// Convert normal array into listField options!
export function convertIntoListFieldOptions(option){
  return {
    value: option,
    actualValue: option
  }
};

export default ListField;