import React, {useRef, useEffect} from 'react';
import './panel.view.css';

const PanelView = (props) => {
  
  // Reference to required panel view component to calculate the height!
  const sidePanelRef = useRef(null);
  const workSpaceRef = useRef(null);
  
  // Show header view for the side panel!
  function _showHeaderView(){
    return(
      <div>
        <span className = "explorer">
          {props.data.header}
        </span>
        {props.data.headerControl && (
          props.data.controlCenter()
        )}
      </div>
    )
  }
  
  // Send the height back to the parent container!
  useEffect(() => {
    props.height && props.height(sidePanelRef.current.offsetHeight);
  }, [])
  
  return(
    <div className = "sidepanel-container">
        <div className = "workspace-title text-center" ref = {workSpaceRef}>
          {_showHeaderView()}
        </div>
        <div className = "sidepanel" ref = {sidePanelRef} style = {{height: props.data.height + "px"}}>
            <div className = "files">
                {props.childView && props.childView()}
            </div>
        </div>
    </div>
  )
}

export default PanelView;