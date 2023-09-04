import React, { useState } from 'react';
import SidepanelWrapper from '../sidepanel.container.wrapper/sidepanel.container.wrapper';
import PropertyContainer from '../property.container/property.container';
import CustomModal from '../../CustomModal/custom.modal.view';


const DashboardWrapper = (props) => {
  
  // Selected Model state handler!
  const [selectedModel, setSelectedModel] = useState({
    roomModel: undefined,
    formMode: undefined,
    onFormSave: false,
    onCheckout: false
  });
  
  // Sidepanel controller throught props state handler!
  const [propertyController, setPropertyContainer] = useState({
    reloadSidepanel: false
  });

  // Update the selected model from the side panel wrapper!
  function updateSelectedModel(roomModel, formMode){
    setSelectedModel(prevState => ({...prevState, roomModel: roomModel, formMode: formMode}));
  };
  
  // Onform save triggered!
  function onFormSave(value){
    setSelectedModel(prevState => ({...prevState, onFormSave: value}))
  };
  
  // On checkout triggered!
  function onCheckout(value){
    setSelectedModel(prevState => ({...prevState, onCheckout: value}));
  };
  
  // On form cancel operation!
  function onFormCancel(opts){
    setSelectedModel(prevState => ({...prevState, roomModel: undefined}));
    _updateDashboardWrapper(opts);
  };
  
  // Update dashboard wrapper!
  function _updateDashboardWrapper(opts){
    opts.reloadSidepanel && _reloadSidepanel();
  };
  
  // Reload sidepanel function!
  function _reloadSidepanel(){
    setPropertyContainer(prevState => ({...prevState, reloadSidepanel: true}));
  };
  
  //  Whole dashboard wrapper!
  function _dashboardWrapper(){
    return(
      <div className = "sidepanel-wrapper">
        <div className = "flex-1">
          <SidepanelWrapper controller = {propertyController} data = {props.modalAssistData} params = {props.params} 
          selectedModel = {(roomModel, formMode) => updateSelectedModel(roomModel, formMode)} />
        </div>
        <div className = "flex-2">
          {selectedModel.roomModel !== undefined && ( // Render the property container only when any room model is clicked
            <div className = "dashboard-property-container">
              <PropertyContainer data = {selectedModel} propertyContainerHeight = {props.modalAssistData.height} 
              onSave = {(value) => onFormSave(value)} onCancel = {(opts) => onFormCancel(opts)} 
              onCheckout = {(value) => onCheckout(value)} params = {props.params} />
            </div>
          )}
        </div>
      </div>
    )
  };
  
  return _dashboardWrapper();
}

export default DashboardWrapper;