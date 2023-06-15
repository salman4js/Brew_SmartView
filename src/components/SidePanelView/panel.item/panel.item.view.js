import React from 'react';

const PanelItemView = (props) => {
  return(
    <div className = "file-items" onClick = {() => props.onClick(props._id)}>
     <span className = "brew-title-workspace side-align">
        {props.data}
     </span>
    </div>
  )
}

export default PanelItemView;