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
  }

  return(
    <Modal
        show={props.modalData.show}
        onHide={() => props.modalData.onHide(false)}
        backdrop="static"
        keyboard={false}
        centered= {props.modalData.centered}
        size = {props.modalData.modalSize}
    >
        <Modal.Header closeButton>
          {props.modalData?.header}
        </Modal.Header>
        <CustomModalBody data = {() => props.showBodyItemView()} modalData = {props.modalData} />
        {props.modalData?.footerEnabled && (
            <Modal.Footer>
              {showCustomModalFooter()}
            </Modal.Footer>
        )}
    </Modal>
  )
}

export default CustomModal;