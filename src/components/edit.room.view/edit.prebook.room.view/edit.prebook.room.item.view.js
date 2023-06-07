import React, { useState } from 'react';
import CustomModal from '../../CustomModal/custom.modal.view';
import MetadataFields from '../../fields/metadata.fields.view';

const EditPrebookRoomItem = (props) => {
  
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
        variant: "success",
        onClick: saveData
      },
      {
        btnId: "Cancel",
        variant: "secondary",
        onClick: _dummyFunction
      }
    ]
  })
  
  // Send the formed data into the server!
  function saveData(){
    const fieldData = getFieldData();
    
  }
  
  // Get field data!
  function getFieldData(){
    return prebookEdit;
  }
  
  function _dummyFunction(){
    console.log("Dummy Cancel prebook edit command")
  }
  
  // Prebook edit customer details!
  const [prebookEdit, setPrebookEdit] = useState([
    {
      value: props.data.dateofcheckin,
      placeholder: "Date of checkin",
      name: 'prebookDateofCheckin',
      attribute: 'textField'
    },
    {
      value: props.data.checkinTime,                               
      placeholder: "Time of checkin",
      name: "prebookCheckinTime",
      attribute: 'textField'
    },
    {
      value: props.data.adults,
      placeholder: "Adults count",
      name: 'prebookAdults',
      attribute: 'textField'
    },
    {
      value: props.data.childrens,
      placeholder: "Childrens count",
      name: 'prebookChildrens',
      attribute: 'textField'
    },
    {
      value: props.data.discount,
      placeholder: "Discount amount",
      name: "prebookDiscount",
      attribute: 'textField'
    }
  ])
  
  // Custom modal body item view!
  function customModalBodyItem(){
    return(
      <div className = "text-center">
        <MetadataFields data = {prebookEdit} updateData = {setPrebookEdit} />
      </div>
    )
  }


  return(
    <div className = "container text-center heading-top" style = {{marginTop: '20px'}}>
      <CustomModal modalData = {customModal}  showBodyItemView = {() => customModalBodyItem()} />
    </div>
  )
}

export default EditPrebookRoomItem;