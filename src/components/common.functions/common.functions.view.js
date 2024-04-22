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

// common label message!
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
      <div className = "text-center">
        <div className = "spinner-border" role="status" style = {getStyle(opts)}>
        </div>
      </div>
    </div>
  )
}
