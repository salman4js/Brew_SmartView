import React from 'react';

const ButtonField = (props) => {

  // Get className for the button field!
  function getClassName(){
    if(!props.data.disabled){
      return 'metadata-button-field brew-cursor';
    } else {
      return 'metadata-button-field-disabled brew-cursor'
    }
  };

  // Render button field!
  function _renderButtonField(){
    return(
      <>
        <span type ='button' className = {getClassName()} onClick = {() => !props.data.disabled && props.data.onClick()}>
          {props.data.btnValue}
        </span>
      </>
    )
  };
  
  return _renderButtonField();
}

export default ButtonField;