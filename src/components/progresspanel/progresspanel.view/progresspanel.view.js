import React from 'react';
import progressPanelConstants from './progresspanel.view.constants';
import Tippy from '@tippy.js/react';
import 'tippy.js/dist/tippy.css';

const ProgressPanel = (props) => {

  // Render progresspanel body view!
  function _renderProgressPanelBody(){
    if(Array.isArray(props.data)){
      return(
        <span className = "progresspanel-message brew-cursor">
          {progressPanelConstants.MULTIPLE_MESSAGES({count: props.data.length})}
        </span>
      )
    } else {
      return(
        <span className = "progresspanel-message brew-cursor">
          {props.data}
        </span>
      );
    }
  };
  
  // Render tool tip item!
  function _renderToolTipItem(){
    return(
      <span className = "progresspanel-message close-progresspanel-message" onClick = {() => props.onClose()}>
        <Tippy content = {props.toolTip}>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="20" fill="currentColor" class="bi bi-check2-all" viewBox="0 0 16 16">
            <path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0l7-7zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0z"/>
            <path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708z"/>
          </svg>
        </Tippy>
      </span>
    );
  };
  
  // Render progresspanel right side view controller!
  function _renderRightSideController(){
    return _renderToolTipItem();
  };
  
  function _renderProgressPanel(){
    return(
      <div className = "progresspanel-view">
        <span className = "progresspanel-icon">
          {props.renderIcon()}
        </span>
        {_renderProgressPanelBody()}
        {_renderRightSideController()}
      </div>
    );
  };
  
  return _renderProgressPanel();
};

export default ProgressPanel;