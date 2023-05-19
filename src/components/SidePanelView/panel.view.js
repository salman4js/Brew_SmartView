import React, {useRef, useEffect} from 'react';
import PanelItemView from './panel.item/panel.item.view';
import './panel.view.css';

const PanelView = (props) => {
  
  // Reference to required panel view component to calculate the height!
  const sidePanelRef = useRef(null);
  const workSpaceRef = useRef(null);
  
  // Send the height back to the parent container!
  useEffect(() => {
    props.height(sidePanelRef.current.offsetHeight);
  }, [])
  
  return(
    <div className = "sidepanel-container">
        <div className = "sidepanel sidePanelSticky" ref = {sidePanelRef}>
          <div className = "workspace-title text-center" ref = {workSpaceRef}>
            <span className = "explorer">
              Filter By
            </span>
          </div>
          <div className = "files">
            <PanelItemView />
          </div>
        </div>
    </div>
  )
}

export default PanelView;