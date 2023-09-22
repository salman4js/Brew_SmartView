import React from 'react';

const ButtonField = (props) => {

  // Get className for the button field!
  function getClassName(){
    var className = 'metadata-button-field text-center brew-cursor'
    className = props.data.disabled ? className + ' disabled' : className;
    className = props.data.occupyFullSpace ? className + ' occupyFullSpace' : className;
    className = props.data.isDark ? className + ' btn btn-dark' : className;
    return className;
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