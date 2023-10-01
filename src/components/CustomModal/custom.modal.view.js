import React from 'react';
import CustomModalBody from './custom.modal.body/custom.modal.body.view'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'

const CustomModal = (props) => {

  // Custom modal footer buttons!
  function showCustomModalFooter(){
    return(
      props.modalData?.footerEnabled && props.modalData?.footerButtons.map((options, key) => {
        return(
          <div>
              <Button variant = {options.variant} disabled = {options.disabled} onClick = {() => options.onClick()}>
                {options.btnId}
              </Button>
          </div>
        )
      })
    )
  };
  
  // Render body item view!
  function renderBodyItemView(){
    if(props.showBodyItemView){
      return props.showBodyItemView();
    } else {
      return props.modalData.showBodyItemView();
    }
  };
  
  // On hide triggered!
  function onHideTriggered(){
    // Check for if any customData is passed, If yes, pass that as the arguments in the onHide function or pass false!
    var value = props.modalData.customData !== undefined ? props.modalData.customData : false;
    props.modalData.onHide(value);
  };

  return(
    <Modal
        show={props.modalData.show}
        onHide={() => onHideTriggered()}
        backdrop="static"
        keyboard={false}
        centered= {props.modalData.centered}
        size = {props.modalData.modalSize}
    >
        <Modal.Header closeButton>
          {props.modalData?.header}
        </Modal.Header>
        {!props.modalData.restrictBody && (
          <CustomModalBody data = {() => renderBodyItemView()} modalData = {props.modalData} />
        )}
        {props.modalData?.footerEnabled && (
            <Modal.Footer>
              {showCustomModalFooter()}
            </Modal.Footer>
        )}
    </Modal>
  )
}

export default CustomModal;