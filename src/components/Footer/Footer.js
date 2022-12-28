import React from 'react';
import upArrow from '../../Assets/upArrow.png'

const Footer = () => {
  return (
    <div className = "container">
        <div className = "sticky">
            <button className = "btn btn-success">
                <img src={upArrow} width="30" height="30" className="d-inline-block align-top" alt="" />
            </button>
        </div>
    </div>
  )
}

export default Footer;