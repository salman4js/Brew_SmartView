import React from 'react';

const Footer = (props) => {
  return (
    <div className = "container">
        <div className = "sticky">
            {props.elementView}
        </div>
    </div>
  )
}

export default Footer;