import React from 'react';
import InlineToast from '../../InlineToast/Inline.toast.view'

const TextField = (props) => {

  // Check input limit!
  function checkLimit(event){ 
    const limit = props.data.limitValue !== undefined ? props.data.limitValue : 0; // By default limit value would be zero!
    var isGreater = event.target.value > limit;
    
    if(props.data.limitValue !== undefined){
      handleLimit(isGreater, event);
    } else {
      props.handleInputChange(props.index, event, props.data.attribute)
    }
  };
  
  // Handle input event separately!
  function handleEvents(event){
    props.data.eventKeyRequired && props.handleInputChange(props.index, event, props.data.attribute);
  };
  
  // Handle limit value from the field data!
  function handleLimit(isGreater, event){
    if(!isGreater){
      props.handleInputChange(props.index, event, props.data.attribute)
    } else {
      props.toggleButtonValue()
    }
  };
  
  // Text Field inline toast message!
  function _showInlineToast(){
    return(
      props.data.inlineToast.isShow && (
        <InlineToast message = {props.data.inlineToast.inlineMessage} />
      )
    )
  };
  
  // Get value for the input field!
  function getValue(){
    if(props.data.value !== undefined){
      return props.data.value;
    } else if(props.data.defaultValue !== undefined){
      return  props.data.defaultValue;
    } else {
      return ''; // Showing here as empty string, which will not be considered in nodeConvertor function, so its safe.
    }
  };
  
  // Get value for the placeholder!
  function getValueForPlaceholder(){
    return props.data.placeholder;
  };
  
  // Get type of the input fields based on the data!
  function getType(){
    return props.data.type !== undefined ? props.data.type : "text"; // Setting the default type as 'text'
  };
  

  return(
    <div className="modal-gap" style = {{width: props.data.width, padding: props.data.padding}}>
        {props.data.label && (
          <label style={{ color: "black" }}> {props.data.label} </label>
        )}
        <input type={getType()} className="form-control" aria-describedby="input-field" value = {getValue()}
        placeholder={getValueForPlaceholder()} onKeyDown = {(event) => handleEvents(event)} onChange = {(event) => checkLimit(event)} />
        {props.data?.inlineToast !== undefined && (
          _showInlineToast()
        )}
    </div>
  )  
}

export default TextField;