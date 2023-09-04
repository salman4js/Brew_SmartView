import React from 'react';

const ButtonField = (props) => {

  // Render button field!
  function _renderButtonField(){
    return(
      <>
        <span type ='button' className = 'metadata-button-field brew-cursor' onClick = {() => props.data.onClick()}>
          {props.data.btnValue}
        </span>
      </>
    )
  };
  
  return _renderButtonField();
}

export default ButtonField;