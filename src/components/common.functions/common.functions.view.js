import React from 'react';
import Modal from 'react-bootstrap/Modal';

// Form a style instance and return it!
function getStyle(options){
  return{
    marginTop: options.marginTop,
    marginBottom: options.marginBottom,
    color: options.color,
    textAlign: options.textCenter ? "center" : "none",
    marginLeft: options.marginLeft,
    paddingTop: options.paddingTop,
    fontBold: options.fontBold,
    fontWeight: options.fontWeight,
    fontSize: options.fontSize
  }
}

// Global Message
export function globalMessage(opts){
  return(
    <Modal
        show={opts.show}
        onHide = {() => opts.onHide()}
    >
        <Modal.Header closeButton = {opts.closeButton}>
            <Modal.Body className="text-center">
                {opts.message}
            </Modal.Body>
        </Modal.Header>
    </Modal>
  )
}

// coomon label message!
export function commonLabel(opts){
  return(
    <div className = "common-label-message" style = {getStyle(opts)}>
      {opts.message}
    </div>
  )
}

// Spinner!
export function activityLoader(opts){
  return(
    <div>
      <div class="text-center">
        <div class="spinner-border" role="status" style = {getStyle(opts)}>
        </div>
      </div>
    </div>
  )
}
