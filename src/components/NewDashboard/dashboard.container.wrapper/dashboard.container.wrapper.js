import React, { useState, useRef } from 'react';
import _ from 'lodash';
import SidepanelWrapper from '../sidepanel.container.wrapper/sidepanel.container.wrapper';
import PropertyContainer from '../property.container/property.container';
import CollectionInstance from '../../../global.collection/widgettile.collection/widgettile.collection';


const DashboardWrapper = (props, ref) => {
  
  var sidePanelRef = useRef(null);
  
  // Selected Model state handler!
  const [selectedModel, setSelectedModel] = useState({
    roomModel: undefined,
    userModel: undefined,
    dashboardMode: 'default',
    onFormSave: false,
    onCheckout: false,
    widgetTileModel: undefined, // This two states used for widget tile for statusTableView,
    widgetTileModelCount: undefined,
    userStatusMap: undefined,
    selectedRoomConstant: undefined,
    filteredData: undefined,
    filterTableOptions: undefined
  });

  // Custom html content state handler!
  const [htmlContent, setHtmlContent] = useState({
    customHtmlContent: undefined,
    replacements: undefined
  })

  // Default view room model details state handler!
  const [propertyDetails, setPropertyDetails] = useState({
    roomCollection: undefined,
    totalCount: undefined,
    countAvailability: undefined,
    reservedCount: undefined,
    roomStatus: undefined,
    isFetched: false,
    userCollection: undefined
  });
  
  // Function to update property details!
  function _updatePropertyDetails(roomCollection, availability, roomStatus, userCollection){
    var totalCount = roomCollection.length,
      countAvailability = availability,
      reservedCount = totalCount - availability;
    setPropertyDetails(prevState => ({...prevState, roomCollection: roomCollection, totalCount: totalCount, 
      countAvailability: countAvailability, roomStatus: roomStatus, reservedCount: reservedCount, isFetched: true, userCollection: userCollection}));
  };
  
  // Update property details user collection on Checkout and Checkin operation to keep the data on sync!
  function _updateUserCollection(options, ignoreUpdateOfDefaultView){
    // Make the copy of the userCollection!
    var userCollection = [...propertyDetails.userCollection];
    // By using the roomId, Add the particular user reference to the userCollection on Checkin operation!
    if(options.action === 'CHECK-IN'){
      userCollection.push(options.updatedUserModel);
    };
    // By using the roomId, Delete the particular user reference from the userCollection on Checkout operation!
    if(options.action === 'CHECK-OUT'){
      _.remove(userCollection, function(obj){
        return obj.room === options.id; // Comparing obj room id because in updatedRoomModel user reference will be null after checkout!
      });
    };
    setPropertyDetails(prevState => ({...prevState, userCollection: userCollection}));
    CollectionInstance.updateCollections('userCollections', userCollection);
  };
  
  // Sidepanel controller throught props state handler!
  const [propertyController, setPropertyController] = useState({
    reloadSidepanel: {
      silent: false
    }
  });

  // Update the selected model from the side panel wrapper!
  function updateSelectedModel(roomModel, dashboardMode, userModel, htmlContent){
    onFormCancel(); // this will clear out the form data, so that the newly selected roomModel will load.
    // When dashboardMode is undefined, get the dashboardMode from the roomModel data.
    dashboardMode = !dashboardMode ? getFormMode(roomModel.roomStatusConstant) : dashboardMode;
    setSelectedModel(prevState => ({...prevState, roomModel: roomModel, dashboardMode: dashboardMode, userModel: userModel}));
  };
  
  // Onform save triggered!
  function onFormSave(value){
    setSelectedModel(prevState => ({...prevState, onFormSave: value}))
  };
  
  // On checkout triggered!
  function onCheckout(value){
    setSelectedModel(prevState => ({...prevState, onCheckout: value}));
  };
  
  // On room transfer!
  function onRoomTransfer(opts){
    sidePanelRef.current._setFilterPanel(true);
    _updateDashboardWrapper(opts);
  };
  
  // On form cancel operation!
  function onFormCancel(opts){
    setSelectedModel(prevState => ({...prevState, dashboardMode: 'default'})); // On form cancel, set the dashboardMode
    // to the default form mode widget-table!
    opts && _updateDashboardWrapper(opts);
  };
  
  // Update dashboard wrapper!
  function _updateDashboardWrapper(opts){
    opts.reloadSidepanel && _reloadSidepanel(opts);
    opts.navigateToStatusTableView && _navigateToStatusTableView(opts);
    opts.navigateToPropertyContainer && _navigateToPropertyContainer();
    opts.persistStatusView && _reloadAndPersistStatusView(opts.updatedModel); // Reload persist status view need 
    // updated room model to updated it to the latest value
    opts.updatedModel && _updateRoomModel(opts);
    opts.goToLocation && updateSelectedModel(opts.roomModel);
    opts.goToCustomHtmlContent && updateCustomHtmlContent(opts);
    opts.updateUserCollection && _updateUserCollection(opts.updateUserCollection, opts.ignoreUpdateOfDefaultView);
  };
  
  // Navigate to status table view!
  function _navigateToStatusTableView(opts){
    setSelectedModel(prevState => ({...prevState, dashboardMode: opts.dashboardMode, widgetTileModelCount: opts.widgetTileModelCount,
    widgetTileModel: opts.widgetTileModel, userStatusMap: opts.userStatusMap, selectedRoomConstant: opts.selectedRoomConstant,
      filterTableOptions: opts.filterTableOptions}));
  };

  // Navigate the perspective to custom html content by updating the html content and the dashboard mode.
  function updateCustomHtmlContent(opts){
    setSelectedModel(prevState => ({...prevState, dashboardMode: opts.dashboardMode}));
    setHtmlContent(prevState => ({...prevState, customHtmlContent: opts.customHtmlContent,
      replacements: opts.replacements}));
  };

  // Reload sidepanel function!
  function _reloadSidepanel(opts){
    sidePanelRef.current._setTreePanel(true); // When reloading the sidepanel, keep the left panel as roomListTreeView!
    var _reload = {...opts};
    setPropertyController(prevState => ({...prevState, reloadSidepanel: _reload.reloadSidepanel}));
  };
  
  // Reload property container!
  function _navigateToPropertyContainer(){ // As of now, reload property container will 
    // redirect the dashboard to main container
    onFormCancel(); 
  };
  
  // Get current form mode!
  function getFormMode(roomStatusConstant){
    if(roomStatusConstant === 'afterCleaned'){
      return 'edit';
    } else if(roomStatusConstant === 'afterCheckin'){
      return'read';
    } else {
      return 'roomStatus';
    }
  };
  
  // Update user filtered data!
  function _updateFilterData(value){
    setSelectedModel(prevState => ({...prevState, filteredData: value}));
  };
  
  // Update the room model with new data!
  function _updateRoomModel(opts){
    setSelectedModel(prevState => ({...prevState, roomModel: opts.updatedModel}));
    var roomCollections = CollectionInstance.getCollections('roomsListCollection').data,
        indexToUpdate = _.findIndex(roomCollections, {_id: opts.updatedModel._id});
    // Check if the indexToUpdate is in the global collections!
    if(indexToUpdate !== -1){
      _.assign(roomCollections[indexToUpdate], opts.updatedModel);
    };
    CollectionInstance.updateCollections('roomsListCollection', roomCollections);
    setPropertyDetails(prevState => ({...prevState, roomCollection: roomCollections})); // When the room model update is completed, Update the state property of the room collections.
  };
  
  // Reload and persist room status view!
  function _reloadAndPersistStatusView(updatedModel){
    var dashboardMode = getFormMode(updatedModel.roomStatusConstant);
    setSelectedModel(prevState => ({...prevState, dashboardMode: dashboardMode}));
  };
  
  // On cancel checkout prompt!
  function onCancelCheckoutPrompt(opts){
    setSelectedModel(prevState => ({...prevState, onCheckout: false}));
    opts && _updateDashboardWrapper(opts);
  };
  
  // Expose child component function to the parent component ie DashboardWrapper!
  React.useImperativeHandle(ref, () => ({
    updateSelectedModel
  }));
  
  //  Whole dashboard wrapper!
  function _dashboardWrapper(){
    return(
      <div className = "sidepanel-wrapper">
        <div className = "flex-1">
          <SidepanelWrapper ref = {sidePanelRef} controller = {propertyController} data = {props.modalAssistData} params = {props.params} selectedModelData = {selectedModel}
          selectedModel = {(roomModel, dashboardMode) => updateSelectedModel(roomModel, dashboardMode)} updateFilterData = {(value) => _updateFilterData(value)} 
          updatePropertyDetails = {(roomCollection, availability, roomStatus, userCollection) => _updatePropertyDetails(roomCollection, availability, roomStatus, userCollection)} />
        </div>
        <div className = "flex-2">
          <div className = "dashboard-property-container">
            <PropertyContainer data = {selectedModel} htmlContent = {htmlContent} propertyContainerHeight = {props.modalAssistData.height} propertyDetails = {propertyDetails}
            onSave = {(value) => onFormSave(value)} onCancel = {(opts) => onFormCancel(opts)} dashboardController = {(opts) => _updateDashboardWrapper(opts)}
            updateSelectedModel = {(roomModel, dashboardMode, userModel) => updateSelectedModel(roomModel, dashboardMode, userModel)}
            onCheckout = {(value) => onCheckout(value)} onRoomTransfer = {(opts) => onRoomTransfer(opts)} cancelCheckoutPrompt = {(opts) => onCancelCheckoutPrompt(opts)} params = {props.params} />
          </div>
        </div>
      </div>
    )
  };
  
  return _dashboardWrapper();
}

export default React.forwardRef(DashboardWrapper);