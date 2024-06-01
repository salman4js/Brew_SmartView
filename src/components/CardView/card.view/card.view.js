import React from 'react';
import CustomModal from "../../fields/customModalField/custom.modal.view";
import CommandHelper from '../../fields/commandField/command.helper.field'
import {activityLoader} from '../../common.functions/common.functions.view'
import Button from 'react-bootstrap/Button'


const CardView = (props) => {
  
  // Get card child view style!
  function getChildViewStyle(){
    return props.data.childViewClass !== undefined ? props.data.childViewClass : 'card-body text-center'
  }
  
  // Show commandHelper for performing activity!
  function _showCommands(){
    return <CommandHelper data = {props.data.commands} />
  }
  
  // Show activity loader!
  function _showActivityLoader(){
    // Options!
    var opts = {
      color: "black",
      marginTop: (props.data.height / 4) + "px",
      textCenter: true
    }
    
    return activityLoader(opts)
  }
  
  // Render footer buttons!
  function _showFooterButtons(){
    return(
      props.data?.footerEnabled && props.data?.footerButtons.map((options, key) => {
        return(
          <Button variant = {options.variant} disabled = {options.disabled} onClick = {() => options.onClick()}>
            {options.btnId}
          </Button>
        )
      })
    )
  }
  
  // Show Custom Modal!
  function _showCustomModal(){
    // Form modal data and invoice details data!
    const modelAndInvoiceData = {
      show: props.modalData.show,
      onHide: props.modalData.onHide,
      header: props.modalData.header,
      centered: props.modalData.centered,
      modalSize: props.modalData.modalSize
    }
    
    return(
      props.modalData?.show && (
        <CustomModal modalData = {modelAndInvoiceData} showBodyItemView = {() => props.customModalBodyItem()}  />
      )
    )
  };
  
  // On card body view click!
  function onCardBodyViewClick(){
    if(!props.data?.enableLoader && props.data?.onClick){
      // Get the pass value declared in the caller component state!
      var passer = props.data.passer !== undefined ? props.data.passer : props.data.header;
      props.data.onClick(passer);
    }
  };
  
  return(
      <div className="card" style = {{height: props.data?.height, width: props.data?.width}}>
        {!props.data.headerLessWidget && props.data.header !== undefined && (
            <div className="card-header text-handler text-center brew-cursor" onClick = {() => props.data.allowHeaderClick && onCardBodyViewClick()}>
            {props.data?.header}
          </div>
        )}
        {props.data?.commandHelper && (
          _showCommands()
        )}
        <div className = {getChildViewStyle()} onClick = {() => onCardBodyViewClick()}>
          {props.data?.enableLoader ? _showActivityLoader() : props.data?._showBodyChildView()}
        </div>
        {props.data?.footerEnabled && (
          _showFooterButtons()
        )}
        {props.data?.isModalEnabled && (
          _showCustomModal()
        )}
    </div>
  )
}

export default CardView;