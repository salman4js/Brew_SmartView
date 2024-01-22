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
    filterTableOptions: undefined,
    originatingTableView: undefined, // This is to get the originating table view in other perspective view.
    // If the perspective view was opened from the table view through commands.
    propertyData: undefined,
    propertyDataCallBackFunc: undefined
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

  // Custom state based router handler!
  const [customStateRouter, setCustomStateRouter] = useState({
    stateModel: [], // This will contain the state router property-container name for routing.
    tableModel: [],
    dashboardModel: []
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
  function updateSelectedModel(roomModel, dashboardMode, userModel){
    onFormCancel(); // this will clear out the form data, so that the newly selected roomModel will load.
    // When dashboardMode is undefined, get the dashboardMode from the roomModel data.
    dashboardMode = !dashboardMode ? getFormMode(roomModel.roomStatusConstant) : dashboardMode;
    setSelectedModel(prevState => ({...prevState, roomModel: roomModel, dashboardMode: dashboardMode, userModel: userModel }));
  };

  // Update the state for goToLocation command action.
  function goToLocation(opts){
    var dashboardMode = opts.dashboardMode || getFormMode(opts.roomModel.roomStatusConstant);
    setSelectedModel(prevState => ({...prevState, roomModel: opts.roomModel, userModel: opts.userModel,
      dashboardMode: dashboardMode, originatingTableView: opts.originatingTableView, selectedRoomConstant: opts.selectedRoomConstant,
      propertyData: opts.propertyData, propertyDataCallBackFunc: opts.propertyDataCallBackFunc}));
  };

  // On edit properties from property.edit.view.
  function onEditProperties(opts){
    setSelectedModel(prevState => ({...prevState, propertyDataCallBackFunc: opts.propertyDataCallBackFunc}));
  };
  
  // Onform save triggered!
  function onFormSave(value){
    setSelectedModel(prevState => ({...prevState, onFormSave: value}));
  };
  
  // On checkout triggered!
  function onCheckout(value){
    setSelectedModel(prevState => ({...prevState, onCheckout: value}));
  };
  
  // On room transfer!
  function onRoomTransfer(){
    sidePanelRef.current._setFilterPanel(true);
  };
  
  // On form cancel operation!
  function onFormCancel(opts){
    setSelectedModel(prevState => ({...prevState, dashboardMode: 'default'})); // On form cancel, set the dashboardMode
    // to the default form mode widget-table!
    opts && _updateDashboardWrapper(opts);
  };

  // Update state router!
  function _updateStateRouter(opts) {
    return new Promise((resolve, reject) => {
      if (opts) {
        setCustomStateRouter((prevState) => {
          let newStateModel = [...prevState.stateModel];
          let newTableModel = [...prevState.tableModel];
          let newDashboardModel = [...prevState.dashboardModel];
          switch (opts.action) {
            case "ADD":
              if(!newStateModel.includes(opts.currentRouter)){
                newStateModel.push(opts.currentRouter);
                opts.currentTableMode && newTableModel.push(opts.currentTableMode);
                opts.currentDashboardMode && newDashboardModel.push(opts.currentDashboardMode);
              }
              break;
            case "REMOVE":
              newStateModel = newStateModel.filter(item => item !== opts.currentRouter);
              newTableModel = newTableModel.filter(item => item !== opts.currentTableMode);
              newDashboardModel = newDashboardModel.filter(item => item !== opts.currentDashboardMode);
              break;
            case "DELETE":
              newStateModel.pop();
              newTableModel.pop();
              newDashboardModel.pop();
              break;
            default:
              break;
          }
          resolve({stateModel: newStateModel, tableModel: newTableModel, dashboardModel: newDashboardModel});
          return {
            ...prevState,
            stateModel: newStateModel,
            tableModel: newTableModel,
            dashboardModel: newDashboardModel
          };
        });
      };
    })
  };

  // Get last router history from state router.
  function getLastRouterHistory(){
    return customStateRouter.stateModel[customStateRouter.stateModel.length - 1];
  };

  // Update state router model.
  async function _notifyStateRouter(opts){
    return opts.routerOptions && await _updateStateRouter(opts.routerOptions);
  };

  // State router controller!
  function _routerController(opts){
    return {
      _notifyStateRouter: async (opts) => await _notifyStateRouter(opts),
      _getLastRouterHistory: () => getLastRouterHistory()
    }
  };

  // Update dashboard wrapper!
  function _updateDashboardWrapper(opts){
    opts.reloadSidepanel && _reloadSidepanel(opts);
    opts.navigateToStatusTableView && _navigateToStatusTableView(opts);
    opts.navigateToPropertyContainer && _navigateToPropertyContainer();
    opts.persistStatusView && _reloadAndPersistStatusView(opts.updatedModel); // Reload persist status view need
    // updated room model to updated it to the latest value
    opts.updatedModel && _updateRoomModel(opts);
    opts.widgetTileModel && _updateWidgetTileModel(opts.widgetTileModel);
    opts.goToLocation && goToLocation(opts);
    opts.onEditProperties && onEditProperties(opts);
    opts.isRoomTransferCommand && onRoomTransfer(opts);
    opts.goToCustomHtmlContent && updateCustomHtmlContent(opts);
    opts.updateUserCollection && _updateUserCollection(opts.updateUserCollection, opts.ignoreUpdateOfDefaultView);
  };

  // Navigate to status table view!
  function _navigateToStatusTableView(opts) {
    setSelectedModel(prevState => {
      const updatedState = {};
      // Loop over the keys in opts and update state properties accordingly
      Object.keys(prevState).forEach((key) => {
        if (opts.hasOwnProperty(key)) {
          updatedState[key] = opts[key];
        } else {
          // If the key is not in opts, keep the existing value
          updatedState[key] = prevState[key];
        }
      });
      return updatedState;
    });
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

  // Update widget tile model collection!
  function _updateWidgetTileModel(opts){
    return new Promise((resolve) => {
      if(opts.objectIdToBeUpdated){ // When clicking on widgetTile from default.view, would trigger this method.
        // So to prevent updating the state, has the condition here to look up for the objectIdToBeUpdated.
        setSelectedModel(prevState => {
          const newState = { ...prevState };
          // Ensure that the widgetTileModel exists in the state
          if (!newState.widgetTileModel) {
            // Ideally this should not at all happen.
            newState.widgetTileModel = {};
          }
          _.forEach(opts.selectedConstant, (constant) => {
            _.forEach(opts.keysToCompare, (key) => {
              const objectIndex = _.findIndex(newState.widgetTileModel[constant], function(model){
                return model[key] === opts.objectIdToBeUpdated;
              });
              if (objectIndex !== -1) {
                switch (opts.action) {
                  case "REMOVE":
                    newState.widgetTileModel[constant] = _.filter(newState.widgetTileModel[constant], (model, index) => index !== objectIndex);
                    break;
                  default:
                    break;
                }
              }
            });
          });
          resolve(newState);
          return newState;
        });
      }
    })
  };
  
  // Reload and persist room status view!
  function _reloadAndPersistStatusView(updatedModel){
    if(updatedModel){
      var dashboardMode = getFormMode(updatedModel.roomStatusConstant);
      setSelectedModel(prevState => ({...prevState, dashboardMode: dashboardMode}));
    } else {
      _navigateToPropertyContainer();
    }
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
          dashboardController = {(opts) => _updateDashboardWrapper(opts)} selectedModel = {(roomModel, dashboardMode) => updateSelectedModel(roomModel, dashboardMode)} updateFilterData = {(value) => _updateFilterData(value)}
          updatePropertyDetails = {(roomCollection, availability, roomStatus, userCollection) => _updatePropertyDetails(roomCollection, availability, roomStatus, userCollection)} />
        </div>
        <div className = "flex-2">
          <div className = "dashboard-property-container">
            <PropertyContainer data = {selectedModel} htmlContent = {htmlContent} propertyContainerHeight = {props.modalAssistData.height} stateRouter = {customStateRouter}
            routerController = {(opts) => _routerController(opts)} propertyDetails = {propertyDetails} onSave = {(value) => onFormSave(value)}
            onCancel = {(opts) => onFormCancel(opts)} dashboardController = {(opts) => _updateDashboardWrapper(opts)}
            updateSelectedModel = {(roomModel, dashboardMode, userModel) => updateSelectedModel(roomModel, dashboardMode, userModel)}
            onCheckout = {(value) => onCheckout(value)} cancelCheckoutPrompt = {(opts) => onCancelCheckoutPrompt(opts)} params = {props.params} />
          </div>
        </div>
      </div>
    )
  };
  
  return _dashboardWrapper();
}

export default React.forwardRef(DashboardWrapper);