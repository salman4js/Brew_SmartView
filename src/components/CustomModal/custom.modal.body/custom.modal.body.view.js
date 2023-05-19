import React from 'react';
import Modal from 'react-bootstrap/Modal';

const CustomModalBody = (props) => {  

  // Show Custom Modal Body Data!
  function _showCustomModalBody(){
    const elements = [];
    for (let key in props.data){
      if(props.data.hasOwnProperty(key)){
        var value = props.data[key];
        elements.push(
          <p className="font-big" key={key}>
            {key}: {value}
          </p>
        );
      }
    }
    return elements;
  }
  
  return(
    <Modal.Body>
      {_showCustomModalBody()}
    </Modal.Body>
  )
}

export default CustomModalBody;
