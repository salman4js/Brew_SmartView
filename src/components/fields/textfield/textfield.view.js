import React from 'react';
import InlineToast from '../../InlineToast/Inline.toast.view'

const TextField = (props) => {
  
  // Check input limit!
  function checkLimit(event){ 
    const limit = props.data.limitValue !== undefined ? props.data.limitValue : 0; // By default limit value would be zero!
    var isGreater = event.target.value > limit;
    if(!isGreater){
      props.handleInputChange(props.index, event, props.data.attribute)
    } else {
      props.toggleButtonValue()
    }
  }
  
  // Text Field inline toast message!
  function _showInlineToast(){
    return(
      props.data.inlineToast.isShow && (
        <InlineToast message = {props.data.inlineToast.inlineMessage} />
      )
    )
  }
  

  return(
    <div className="modal-gap">
        <label style={{ color: "black" }}> {props.data.label} </label>
        <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" 
        placeholder={props.data.value} onChange = {(event) => checkLimit(event)} />
        {props.data?.inlineToast !== undefined && (
          _showInlineToast()
        )}
    </div>
  )
  
}

export default TextField;