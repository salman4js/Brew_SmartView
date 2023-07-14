import React from 'react';
import PanelView from '../../SidePanelView/panel.view';

const RefundTrackerContent = (props) => {
  return(
    <div className = "sidepanel-wrapper">
      <div className = "flex-1">
        <PanelView data = {props.data} childView = {() => props.childView()} height = {(value) => props.updateSidepanelHeight(value)} />
      </div>
      <div className = "flex-2">
      </div>
    </div>
  )
}

export default RefundTrackerContent;