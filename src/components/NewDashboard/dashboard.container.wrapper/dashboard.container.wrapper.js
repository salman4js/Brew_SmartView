import React, { useState } from 'react';
import SidepanelWrapper from '../sidepanel.container.wrapper/sidepanel.container.wrapper';
import PropertyContainer from '../property.container/property.container';
import CustomModal from '../../CustomModal/custom.modal.view';


const DashboardWrapper = (props) => {
  
  // Selected Model state handler!
  const [selectedModel, setSelectedModel] = useState({
    roomModel: undefined,
    formMode: 'default',
    onFormSave: false,
    onCheckout: false
  });
  
  // Default view room model details state handler!
  const [propertyDetails, setPropertyDetails] = useState({
    roomCollection: undefined,
    totalCount: undefined,
    countAvailability: undefined,
    reservedCount: undefined,
    roomStatus: undefined,
    isFetched: false,
    updatePropertyDetails: _updatePropertyDetails
  });
  
  // Function to update property details!
  function _updatePropertyDetails(roomCollection, availability, roomStatus){
    var totalCount = roomCollection.length,
      countAvailability = availability,
      reservedCount = totalCount - availability;
    setPropertyDetails(prevState => ({...prevState, roomCollection: roomCollection, totalCount: totalCount, 
      countAvailability: countAvailability, roomStatus: roomStatus, reservedCount: reservedCount, isFetched: true}));
  };
  
  // Sidepanel controller throught props state handler!
  const [propertyController, setPropertyController] = useState({
    reloadSidepanel: {
      silent: false
    }
  });

  // Update the selected model from the side panel wrapper!
  function updateSelectedModel(roomModel, formMode){
    onFormCancel(); // this will clear out the form data, so that the newly selected roomModel will load.
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
    setSelectedModel(prevState => ({...prevState, roomModel: undefined, formMode: 'default'})); // On form cancel, set the formMode
    // to the default form mode widget-table!
    opts && _updateDashboardWrapper(opts);
  };
  
  // Update dashboard wrapper!
  function _updateDashboardWrapper(opts){
    opts.reloadSidepanel && _reloadSidepanel(opts);
    opts.reloadPropertyContainer && _reloadPropertyContainer();
    opts.persistStatusView && _reloadAndPersistStatusView(opts.updatedModel); // Reload persist status view need 
    // updated room model to updated it to the latest value
  };
  
  // Reload sidepanel function!
  function _reloadSidepanel(opts){
    var _reload = {...opts};
    setPropertyController(prevState => ({...prevState, reloadSidepanel: _reload.reloadSidepanel}));
  };
  
  // Reload property container!
  function _reloadPropertyContainer(){ // As of now, reload property container will 
    // redirect the dashboard to main container
    onFormCancel(); 
  };
  
  // Get current form mode!
  function getFormMode(roomStatusConstant){
    if(roomStatusConstant === 'afterCleaned'){
      return 'edit';
    } else if(roomStatusConstant === 'afterCheckedout' || roomStatusConstant === 'inCleaning'){
      return 'dirty';
    } else {
      return 'read';
    }
  };
  
  // Reload and persist room status view!
  function _reloadAndPersistStatusView(updatedModel){
    var formMode = getFormMode(updatedModel.roomStatusConstant);
    setSelectedModel(prevState => ({...prevState, roomModel: updatedModel, formMode: formMode}));
  };
  
  // On cancel checkout prompt!
  function onCancelCheckoutPrompt(opts){
    setSelectedModel(prevState => ({...prevState, onCheckout: false}));
    opts && _updateDashboardWrapper(opts);
  };
  
  //  Whole dashboard wrapper!
  function _dashboardWrapper(){
    return(
      <div className = "sidepanel-wrapper">
        <div className = "flex-1">
          <SidepanelWrapper controller = {propertyController} data = {props.modalAssistData} params = {props.params} selectedModelData = {selectedModel}
          selectedModel = {(roomModel, formMode) => updateSelectedModel(roomModel, formMode)} 
          updatePropertyDetails = {(roomCollection, availability, roomStatus) => _updatePropertyDetails(roomCollection, availability, roomStatus)} />
        </div>
        <div className = "flex-2">
          <div className = "dashboard-property-container">
            <PropertyContainer data = {selectedModel} propertyContainerHeight = {props.modalAssistData.height} propertyDetails = {propertyDetails}
            onSave = {(value) => onFormSave(value)} onCancel = {(opts) => onFormCancel(opts)} dashboardController = {(opts) => _updateDashboardWrapper(opts)}
            onCheckout = {(value) => onCheckout(value)} cancelCheckoutPrompt = {(opts) => onCancelCheckoutPrompt(opts)} params = {props.params} />
          </div>
        </div>
      </div>
    )
  };
  
  return _dashboardWrapper();
}

export default DashboardWrapper;