import React from 'react';
import PanelView from '../SidePanelView/panel.view'

const VoucherContent = (props) => {
  return(
    <div className = "sidepanel-wrapper">
      <div className = "flex-1">
        <PanelView data = {props.data} childView = {() => props.childView()} />
      </div>
      <div className = "flex-2">
        Hey there!
      </div>
    </div>
  )
}

export default VoucherContent;