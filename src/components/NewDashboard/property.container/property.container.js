import React, {useState, useEffect} from 'react';
import MetadataFields from '../../fields/metadata.fields.view';
import CheckInForm from './checkin.view/checkin.form.view';
import CheckOutView from './checkout.view/checkout.form.view';
import RoomStatusView from './room.status.view/room.status.view';
import DefaultView from './default.view/default.view';
import StatusTableView from './table.view/table.view';

const PropertyContainer = (props) => {
  // Panel fields state handler!
  const [panelField, setPanelField] = useState([]);
  
  // Get panel field data!
  function getPanelFieldData(){
    // Get panel field dropdown options!
    var panelFieldDropdownOptions = getPanelFieldDropdown();
    // Get panel field selected and default values!
    var selectedValues = getPanelFieldsValues();
    return [
      {
        value: selectedValues,
        attribute: "dataListField",
        allowInputField: false,
        allowPanelField: true,
        allowRightSideControl: true,
        rightSideControl: _renderRightSideControl,
        height: 27,
        width: '200px',
        selectedValue: selectedValues,
        showListValue: function(){
          return props.data.dashboardMode !== 'roomStatus' ? true : false;
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
        options: panelFieldDropdownOptions
      }
    ]
  };

  // Get panel field dropdown values!
  function getPanelFieldDropdown(){
    if(props.data.dashboardMode !== 'roomStatus' && props.data.dashboardMode !== 'statusTableView'){
       return [
          {
            value: (props.data.dashboardMode === 'edit' ? 'checkin-form' : 'checkout-form')
          },
          {
            value: (props.data.dashboardMode === 'edit' ? undefined : 'payment tracker')
          }
        ]
    } else {
      return []; // Return empty array as per the design of the panel field!
    }
  };

  // Get panel field dropdown selectedValues and values!
  function getPanelFieldsValues(){
    if(props.data.dashboardMode !== 'roomStatus'){
      return (props.data.dashboardMode === 'edit' ? 'checkin-form' : 'checkout-form')
    }
  };

  // Render property model!
  function _renderPropertyModel(){
    if(props.data.dashboardMode === 'edit'){
      return <CheckInForm height = {props.propertyContainerHeight} data = {props.data} params = {props.params} 
      afterFormSave = {(opts) => props.onCancel(opts)} />
    };
    
    if(props.data.dashboardMode === 'read'){
      return <CheckOutView height = {props.propertyContainerHeight} data = {props.data} params = {props.params}
      cancelCheckoutPrompt = {(opts) => props.cancelCheckoutPrompt(opts)} afterCheckout = {(opts) => props.onCancel(opts)} />
    };
    
    if(props.data.dashboardMode === 'roomStatus'){
      return <RoomStatusView height = {props.propertyContainerHeight} data = {props.data} params = {props.params}
      dashboardController = {(opts) => props.dashboardController(opts)} />
    };
    
    if(props.data.dashboardMode === 'default'){
      return <DefaultView data = {props.propertyDetails} params = {props.params} height = {props.propertyContainerHeight}
      dashboardController = {(opts) => props.dashboardController(opts)} />
    };
    
    if(props.data.dashboardMode === 'statusTableView'){
      return <StatusTableView data = {props.data} propertyDetails = {props.propertyDetails} height = {props.propertyContainerHeight}
      onBack = {(opts) => props.dashboardController(opts)} />
    };
  };

  // Get form models!
  function getFormModels(){
    var emptyFormModel = [];

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
        btnValue: 'Continue Checkout',
        onClick: onCheckout,
        attribute: 'buttonField'
      }
    ];

    var roomStatusFormModel = [{
        btnValue: 'Cancel',
        onClick: onCancel,
        attribute: 'buttonField'
    }];
    
    return {checkinFormModel, checkoutFormModel, roomStatusFormModel, emptyFormModel};
  };

  // Get panel field right side data!
  function getPanelRightSideData(){
    var formModels = getFormModels();
    if(props.data.dashboardMode === 'edit'){
      return formModels.checkinFormModel;
    };
    if(props.data.dashboardMode === 'read'){
      return formModels.checkoutFormModel;
    }
    if(props.data.dashboardMode === 'roomStatus'){
      return formModels.roomStatusFormModel;
    }
    if(props.data.dashboardMode === 'default'){
      return formModels.checkinFormModel;
    }
    if(props.data.dashboardMode === 'statusTableView'){
      return formModels.emptyFormModel;
    }
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
  
  // Should show panel field and for statusTableView we render panel field separately!
  function shouldShowPanelField(){
    return (props.data.dashboardMode !== 'default' && props.data.dashboardMode !== 'statusTableView');
  };
  
  // Force update when the props changes!
  useEffect(() => {
    var panelFieldData = getPanelFieldData();
    setPanelField(panelFieldData); // Update the panel field data when the dashboardMode changes!
  }, [props.data.dashboardMode])
  
  return(
    <>
      {shouldShowPanelField() && (
        <MetadataFields data = {panelField} updateData = {setPanelField} />
      )}
      {_renderPropertyModel()}
    </>
  )
}

export default PropertyContainer;