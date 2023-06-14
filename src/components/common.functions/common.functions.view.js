import React from 'react';
import Modal from 'react-bootstrap/Modal';

function getStyle(options){
  return{
    marginTop: options.marginTop,
    color: options.color,
    textAlign: options.textCenter ? "center" : "none"
  }
}

// Global Message
export function globalMessage(opts){
  return(
    <Modal
        show={opts.show}
    >
        <Modal.Header closeButton>
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
