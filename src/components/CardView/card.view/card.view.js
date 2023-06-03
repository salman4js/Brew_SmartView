import React from 'react';
import CustomModal from '../../CustomModal/custom.modal.view';
import CustomModalBodyitem from '../../CustomModal/custom.modal.body/custom.modal.body.item/custom.modal.body.item'
import { getClassName } from '../../common.functions/common.functions';


const CardView = (props) => {
  
  // Show Card Body Data!
  function _showCardBodyView(){
    const bodyData = Object.entries(props.data.inBodyData);
    return bodyData.map(([key, value]) => {
      if(key !== "OBJECT_ID"){
        return(
          <p className = "card-view-body">
            {key}: {value}
          </p>
        )
      }
    });
  }
  
  // Get className for the footer buttons!
  function getClass(variant){
    return getClassName(variant)
  }
  
  // Show Footer Buttons!
  function _showFooterButtons(){
    return(
      props.data?.footerButtons?.show && (
        props.data?.footerButtons.btns.map((options, key) => {
          return(
            <div className  = {getClass(options.variant)} onClick = {() => options.onClick(props.data?.inBodyData.OBJECT_ID)}>
              {options.id}
            </div>
          )
        })
      )
    )
  }
  
  // Function to get the view for the custom model body item view!
  function customModalBodyItem(){
    return Object.keys(props.modalData.data).map((key) => (
      <CustomModalBodyitem keys = {key} value = {props.modalData.data[key]} />
    ));
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
        <CustomModal modalData = {modelAndInvoiceData} showBodyItemView = {() => customModalBodyItem()}  />
      )
    )
  }
  
  return(
    <div className="col-4" style={{ paddingBottom: "10vh" }}>
        <div className="card card-container" style = {{height: '350px'}}>
            <div className="card-header text-handler text-center" style={{ fontWeight: "bold", fontSize: '18px' }}>
              {props.data.header}
            </div>
            <div className = "card-body text-center">
              {_showCardBodyView()}
            </div>
            {_showFooterButtons()}
            {props.data?.isModalEnabled && (
              _showCustomModal()
            )}
        </div>
    </div>
  )
}

export default CardView;