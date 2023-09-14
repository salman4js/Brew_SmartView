import React from 'react';
import Navbar from '../Navbar';
import Modal from 'react-bootstrap/Modal';

// Navbar view for throughout the application!
export function _renderNavbar(id, splitedIds){
  return(
    <div>
      <Navbar id={id} name={splitedIds[1]} />
    </div>
  )
}

// Form a style instance and return it!
function getStyle(options){
  return{
    marginTop: options.marginTop,
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
