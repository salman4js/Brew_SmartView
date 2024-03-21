import React from 'react';

const CustomModalBodyitem = (props) => {
  return(
    <p className="font-big">
        {props.keys}: {props.value}
      </p>
  )
}

export default CustomModalBodyitem;