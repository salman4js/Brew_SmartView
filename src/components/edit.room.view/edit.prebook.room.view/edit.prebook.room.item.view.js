import React, { useState } from 'react';
import axios from 'axios';
import Variables from '../../Variables';
import CustomModal from '../../CustomModal/custom.modal.view';
import MetadataFields from '../../fields/metadata.fields.view';
import {formatCustomIntoDateFormat, convertFormat, convertServerFormat} from '../../common.functions/common.functions';
import {nodeConvertor} from '../../common.functions/node.convertor';

const EditPrebookRoomItem = (props) => {
  
  // Loader state handler!
  const [loading, setLoading] = useState({
    isLoading: false,
    onStart: _triggerLoading
  })
  
  // Start and stop loader!
  function _triggerLoading(value){
    setLoading(prevState => ({...prevState, isLoading: value}))
  }
    
  // Custom Modal state handler!
  const [customModal, setCustomModal] = useState({
    show: props.show,
    onHide: props.onHide,
    header: "Edit Prebook Customer Details",
    centered: true,
    modalSize: 'medium',
    footerEnabled: true,
    footerButtons: [
      {
        btnId: "Save",
        disabled: false,
        variant: "success",
        onClick: saveData
      },
      {
        btnId: "Cancel",
        variant: "secondary",
        onClick: props.onHide
      }
    ],
    toggleButtonProp: toggleButtonProp
  })
  
  // Make button disabled!
  function toggleButtonProp(btnIndex, value) {
    setCustomModal(prevState => ({
      ...prevState,
      footerButtons: prevState.footerButtons.map((button, index) => {
        if (button.variant === btnIndex) {
          return {
            ...button,
            disabled: value
          };
        }
        return button;
      })
    }));
  }
  
  // Send the formed data into the server!
  function saveData(){
    // Start the loader!
    _triggerLoading(true);
    
    const fieldData = getFieldData(); // Get the form data!
    
    fieldData.prebookDateofCheckin = convertServerFormat(formatCustomIntoDateFormat(fieldData.prebookDateofCheckin)); // Convert the date into dd/mm/yyy format!
    
    fieldData['prebookId'] = props.data.prebookId
    
    axios.post(`${Variables.hostId}/${props.data.lodgeId}/editprebookedrooms`, fieldData)
      .then(res => {
        if(res.data.success){
          props.onHide();
          updateItemView(); // Update the prebook details component forcefully!
          _triggerLoading(false);
        } else {
          // Failure error handler!
        }
      })
  }
  
  // Get field data!
  function getFieldData(){
    return nodeConvertor(prebookEdit);
  }
  
  // Prebook edit customer details!
  const [prebookEdit, setPrebookEdit] = useState([
    {
      value: props.data.dateofcheckin,
      minDate: props.data.dateofcheckin,
      maxDate: props.data.dateofcheckout,   
      placeholder: "Date of checkin",
      label: "Date of checkin",
      name: 'prebookDateofCheckin',
      attribute: 'dateField',
      showTimeSelect: false,
      dateFormat: 'MMMM d, yyyy'
    },
    {
      value: props.data.aadharcard,
      placeholder: "ID Number",
      label: "ID Number",
      name: 'prebookAadhar',
      attribute: 'textField'
    },
    {
      value: props.data.adults,
      placeholder: "Adults count",
      label: "Adults count",
      name: 'prebookAdults',
      attribute: 'textField'
    },
    {
      value: props.data.childrens,
      placeholder: "Childrens count",
      label: "Childrens count",
      name: 'prebookChildrens',
      attribute: 'textField'
    },
    {
      value: props.data.discount,
      placeholder: "Discount amount",
      label: "Discount amount",
      name: "prebookDiscount",
      attribute: 'textField'
    },
    {
      value: props.data.advance,
      placeholder: "Advance Amount",
      label: "Advance Amount",
      name: "prebookAdvance",
      attribute: 'textField',
      inlineToast: {
        isShow: true,
        inlineMessage: `Remaining amount has to be paid ${props.data.advancePending} Rs`
      },
      limitValue: props.data.advancePending
    }
  ])
  
  // Custom modal body item view!
  function customModalBodyItem(){
    return(
      <div className = "text-center">
        <MetadataFields data = {prebookEdit} updateData = {setPrebookEdit} toggleButtonProp = {(btnIndex, value) => toggleButtonProp(btnIndex, value)} />
      </div>
    )
  }
  
  // Update the item view from the parent component!
  function updateItemView(){
    props.onReload(!props.load)
  }


  return(
    <div className = "container text-center heading-top" style = {{marginTop: '20px'}}>
      <CustomModal modalData = {customModal}  showBodyItemView = {() => customModalBodyItem()} />
    </div>
  )
}

export default EditPrebookRoomItem;