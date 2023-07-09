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
          <span className = "sidepanel-header-control" onClick = {() => props.data.headerControlEvent()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="22" fill="currentColor" class="bi bi-file-plus" viewBox="0 0 16 16">
              <path d="M8.5 6a.5.5 0 0 0-1 0v1.5H6a.5.5 0 0 0 0 1h1.5V10a.5.5 0 0 0 1 0V8.5H10a.5.5 0 0 0 0-1H8.5V6z"/>
              <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"/>
            </svg>
          </span>
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