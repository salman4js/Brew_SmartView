import React, {useRef, useEffect} from 'react';

const ModalAssist = (props) => {
  
  // Modal assist references!
  const modalAssist = useRef(null);
  const modalAssistHeader = useRef(null);
  
  // Get custom style for modal assist!
  function getStyle(){
    return{
      fontWeight: props.data.style?.fontWeight
    }
  }
  
  // Modal assist header child view from the parent!
  function _showHeaderChildView(){
    return props.data._showHeaderChildView();
  }
  
  // Render modal assist header!
  function _showHeader(){
    return(
      <div className = "text-center" style = {getStyle()}>
        <span>
          {props.data.header}
        </span>
        <span className = "modal-assist-header-rightside-view">
          {_showHeaderChildView()}
        </span>
        <div className = "modal-assist-view-header-line"></div>
      </div>
    )
  }
  
  // Modal assist content view!
  function _showContentAssist(){
    return props.childView()
  }
  
  // Get modal assist style!
  function getModalAssistStyle(){ 
    return{
      marginLeft: props.data.marginLeft,
      marginRight: props.data.marginRight,
      marginTop: props.data.marginTop,
      marginBottom: props.data.marginBottom
    }
  }
  

  // On Render!
  useEffect(() => {
    const assistChildHeight = modalAssist.current.offsetHeight;
    const assistHeaderHeight = modalAssistHeader.current.offsetHeight;
    props.height(assistChildHeight - assistHeaderHeight); // Sending the height to the parent component!
  }, [])
  
  return(
    <div className = "modal-assist" ref = {modalAssist} style = {getModalAssistStyle()}>
      <div className = "modal-assist-header" ref = {modalAssistHeader}>
        {_showHeader()}
      </div>
      <div className = "modal-assist-childrens">
        {_showContentAssist()}
      </div>
    </div>
  )
}

export default ModalAssist;