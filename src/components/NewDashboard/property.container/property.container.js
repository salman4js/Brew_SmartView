import React, {useState, useEffect} from 'react';
import MetadataFields from '../../fields/metadata.fields.view';
import CheckInForm from './checkin.view/checkin.form.view';
import CheckOutView from './checkout.view/checkout.form.view';
import RoomStatusView from './room.status.view/room.status.view';
import DefaultView from './default.view/default.view';

const PropertyContainer = (props) => {

  // Panel fields state handler!
  const [panelField, setPanelField] = useState([]);
  
  // Get panel field data!
  function getPanelFieldData(){
    return [
      {
        value: (props.data.formMode === 'edit' ? 'checkin-form' : 'checkout-form'),
        attribute: "dataListField",
        allowInputField: false,
        allowPanelField: true,
        allowRightSideControl: true,
        rightSideControl: _renderRightSideControl,
        height: 27,
        width: '200px',
        selectedValue: (props.data.formMode === 'edit' ? 'checkin-form' : 'checkout-form'),
        showListValue: function(){
          return true;
        },
        style: {
          width: "200",
          color: "black",
          fontSize: "15px",
          paddingRight: "10px",
          paddingLeft: "10px",
          paddingTop: "10px",
          paddingBottom: "10px",
          cursor: "pointer",
        },
        options: [
          {
            value: (props.data.formMode === 'edit' ? 'checkin-form' : 'checkout-form')
          },
          {
            value: (props.data.formMode === 'edit' ? undefined : 'payment tracker')
          }
        ]
      }
    ]
  }
  
  // Render property model!
  function _renderPropertyModel(){
    if(props.data.formMode === 'edit'){
      return <CheckInForm height = {props.propertyContainerHeight} data = {props.data} params = {props.params} 
      afterFormSave = {(opts) => props.onCancel(opts)} />
    };
    
    if(props.data.formMode === 'read'){
      return <CheckOutView height = {props.propertyContainerHeight} data = {props.data} params = {props.params}
      cancelCheckoutPrompt = {(opts) => props.cancelCheckoutPrompt(opts)} afterCheckout = {(opts) => props.onCancel(opts)} />
    };
    
    if(props.data.formMode === 'dirty' || props.data.formMode === 'incleaning'){
      return <RoomStatusView height = {props.propertyContainerHeight} data = {props.data} params = {props.params}
      dashboardController = {(opts) => props.dashboardController(opts)} />
    };
    
    if(props.data.formMode === 'default'){
      return <DefaultView data = {props.propertyDetails} params = {props.params} />
    };
  };

  // Get panel field right side data!
  function getPanelRightSideData(){
    var checkinFormModel = [{
        btnValue: 'Cancel',
        onClick: onCancel,
        attribute: 'buttonField'
      },{
        btnValue: 'Check-In',
        onClick: onCheckIn,
        attribute: 'buttonField'
      }
    ];
    
    var checkoutFormModel = [{
        btnValue: 'Cancel',
        onClick: onCancel,
        attribute: 'buttonField'
      },
      {
        btnValue: 'Checkout Guest',
        onClick: onCheckout,
        attribute: 'buttonField'
      }
      
    ];
    
    return props.data.formMode === 'edit' ? checkinFormModel : checkoutFormModel;
  };
  
  // Render right side control panel for datalist field!
  function _renderRightSideControl(){
    var panelRightSideData = getPanelRightSideData();
    return <MetadataFields data = {panelRightSideData} />
  };
  
  // On checkout!
  function onCheckout(){
    props.onCheckout(true);
  };
  
  // On Cancel!
  function onCancel(){
    var opts = {reloadSidepanel: {silent: true}};
    props.onCancel(opts); // this will trigger the cancel operation on checkin form...
  };
  
  // On Save!
  function onCheckIn(){
    props.onSave(true); // this will trigger the onSave API call in checkin form view!
  };
  
  // Force update when the props changes!
  useEffect(() => {
    setPanelField(getPanelFieldData); // Update the panel field data when the formMode changes!
  }, [props.data])
  
  return(
    <>
      {props.data.formMode !== 'default' && (
        <MetadataFields data = {panelField} updateData = {setPanelField} />
      )}
      {_renderPropertyModel()}
    </>
  )
}

export default PropertyContainer;