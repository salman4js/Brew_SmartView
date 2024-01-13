import React, { useState } from 'react';
import { editPrebookDetails } from '../../NewDashboard/property.container/checkin.view/checkin.form.utils';
import brewDate from 'brew-date';
import CustomModal from '../../CustomModal/custom.modal.view';
import MetadataFields from '../../fields/metadata.fields.view';
import {formatCustomIntoDateFormat, convertServerFormat} from '../../common.functions/common.functions';
import {nodeConvertor} from '../../common.functions/node.convertor';
import {universalLang} from '../../universalLang/universalLang';


const EditPrebookRoomItem = (props) => {
  
  // Loader state handler!
  const [loading, setLoading] = useState({
    isLoading: false,
    onStart: _triggerLoading
  })
  
  // Payment tracker state handler!
  const [paymentTracker, setPaymentTracker] = useState({
    prevAmount: props.data.advance,
    amountFor: universalLang.prebookInbetweenAdvance
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
        disabled: true,
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
  
  // Make button enabled when the field is changed!!
  function toggleButtonProp(variant, isEnable) {
    setCustomModal(prevState => ({
      ...prevState,
      footerButtons: prevState.footerButtons.map((button, index) => {
        if (button.variant === variant) {
          return {
            ...button,
            disabled: isEnable
          };
        }
        return button;
      })
    }));
  }
  
  // Check if the advance property value is changed!
  function isAdvPropChanged(){
    var result;
    prebookEdit.map((options, index) => {
      if(options.name === "prebookAdvance"){
        result =  options.isChanged;
      }
    })
    
    return result;
  }
  
  // Add prev value with user entered data!
  function addPrevValue(prebookAdvance){
    // Check if the advance property value is changed!
    const isValueChanged = isAdvPropChanged();
    if(isValueChanged){
      return Number(prebookAdvance) + Number(paymentTracker.prevAmount)
    } else {
      return Number(prebookAdvance);
    }
  }
  
  // Send the formed data into the server!
  async function saveData(){
    // Start the loader!
    _triggerLoading(true);

    const fieldData = getFieldData(); // Get the form data!

    // Add with previous advance value!
    const updatedAdvanceValue = addPrevValue(fieldData.prebookAdvance); // Add user entered advance amount with previous value!
    
    // Update the fieldData with updated advance value!
    fieldData.prebookAdvance = updatedAdvanceValue;
    
    fieldData.prebookDateofCheckin = convertServerFormat(formatCustomIntoDateFormat(fieldData.prebookDateofCheckin)); // Convert the date into dd/mm/yyy format!
    
    fieldData['prebookId'] = props.data.prebookId;
    
    // Add neccessary params for paymentTracker!
    const enteredAmount = getFieldData();
    fieldData['paymentTracker'] = {};
    fieldData.paymentTracker['roomno'] = props.data.roomno;
    fieldData.paymentTracker['room'] = props.data.roomid;
    fieldData.paymentTracker['amount'] = enteredAmount.prebookAdvance; // Amount paid now! 
    fieldData.paymentTracker['isPrebook'] = true;
    fieldData.paymentTracker['lodgeId'] = props.data.lodgeId;
    fieldData.paymentTracker['amountFor'] = paymentTracker.amountFor;
    fieldData.paymentTracker['dateTime'] = brewDate.getFullDate("dd/mmm") + " " + brewDate.timeFormat(brewDate.getTime());
    fieldData.paymentTracker['callPaymentTracker'] = isAdvPropChanged(); // If its true, then the advance field has been changed
    // Hence calling the paymentTracker!
    const result = await editPrebookDetails(fieldData);
    if(result.data.success){
      props.onHide();
      updateItemView(); // Update the prebook details component forcefully!
      _triggerLoading(false);
    } else {
      // Failure error handler!
    };
  };
  
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
      dateFormat: 'MMMM d, yyyy',
      isChanged: false
    },
    {
      value: props.data.aadharcard,
      placeholder: "ID Number",
      label: "ID Number",
      name: 'prebookAadhar',
      attribute: 'textField',
      isChanged: false
    },
    {
      value: props.data.adults,
      placeholder: "Adults count",
      label: "Adults count",
      name: 'prebookAdults',
      attribute: 'textField',
      isChanged: false
    },
    {
      value: props.data.childrens,
      placeholder: "Childrens count",
      label: "Childrens count",
      name: 'prebookChildrens',
      attribute: 'textField',
      isChanged: false
    },
    {
      value: props.data.discount,
      placeholder: "Discount amount",
      label: "Discount amount",
      name: "prebookDiscount",
      attribute: 'textField',
      isChanged: false
    },
    {
      value: props.data.advance,
      placeholder: "Advance Amount",
      label: "Advance Amount",
      name: "prebookAdvance",
      attribute: 'textField',
      isChanged: false,
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
        <MetadataFields data = {prebookEdit} updateData = {setPrebookEdit} toggleButtonProp = {(variant, isEnable) => toggleButtonProp(variant, isEnable)} />
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