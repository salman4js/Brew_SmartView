import React from 'react';
import CustomModal from '../../CustomModal/custom.modal.view';
import CustomModalBodyitem from '../../CustomModal/custom.modal.body/custom.modal.body.item/custom.modal.body.item'
import { getClassName } from '../../common.functions/common.functions';
import Button from 'react-bootstrap/Button'


const CardView = (props) => {
    
  // Get className for the footer buttons!
  function getClass(variant){
    return getClassName(variant)
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
  }
  
  return(
    <div className="card" style = {{height: props.data.height}}>
        <div className="card-header text-handler text-center">
          {props.data?.header}
        </div>
        <div className = "card-body text-center">
          {props.data._showBodyChildView()}
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