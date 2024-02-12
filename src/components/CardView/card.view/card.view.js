import React from 'react';
import CustomModal from '../../CustomModal/custom.modal.view';
import CommandHelper from '../../fields/commandField/command.helper.field'
import {activityLoader} from '../../common.functions/common.functions.view'
import CustomModalBodyitem from '../../CustomModal/custom.modal.body/custom.modal.body.item/custom.modal.body.item'
import { getClassName } from '../../common.functions/common.functions';
import Button from 'react-bootstrap/Button'


const CardView = (props) => {

  // Get className for the footer buttons!
  function getClass(variant){
    return getClassName(variant)
  }
  
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
    // Get the pass value declared in the caller component state!
    var passer = props.data.passer !== undefined ? props.data.passer : props.data.header;
    props.data.onClick(passer);
  };
  
  return(
      <div className="card" style = {{height: props.data?.height + "px", width: props.data?.width + "px"}}>
        {props.data.header !== undefined && (
            <div className="card-header text-handler text-center">
            {props.data?.header}
          </div>
        )}
        {props.data?.commandHelper && (
          _showCommands()
        )}
        <div className = {getChildViewStyle()} onClick = {() => !props.data?.enableLoader && props.data?.onClick && onCardBodyViewClick()}>
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