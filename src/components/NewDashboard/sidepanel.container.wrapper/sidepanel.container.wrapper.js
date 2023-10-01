import React, {useState, useEffect} from 'react';
import { getAvailableRoomTypes, getUserModel } from './sidepanel.container.utils';
import { getRoomList } from '../../paymentTracker/payment.tracker.utils/payment.tracker.utils';
import { getStatusCodeColor } from '../../common.functions/common.functions';
import { globalMessage, commonLabel, activityLoader } from '../../common.functions/common.functions.view';
import PanelView from '../../SidePanelView/panel.view';
import PanelItemView from '../../SidePanelView/panel.item/panel.item.view';
import CollectionView from '../../SidePanelView/collection.view/collection.view'

const SidepanelWrapper = (props) => {

  // Sidepanel state handler!
  const [sidepanel, setSidepanel] = useState({
    height: undefined,
    header: "Rooms List",
    isLoading: true,
    parentData: undefined,
    childData: undefined,
    selectedId: []
  });
  
  // Update sidepanel height!
  function updateSidePanelHeight(value){
    setSidepanel(prevState => ({...prevState, height: value}))
  };
  
  // toggle side panel loader!
  function _toggleLoader(value){
    setSidepanel(prevState => ({...prevState, isLoading: value}));
  };
  
  // Sidepanel child view!
  function sidepanelChildView(){
    if(sidepanel.isLoading){
      return activityLoader(getLoaderOpts());
    } else {
      return childViewMainContent();
    }
  };
  
  // Sidepanel chid view main content!
  function childViewMainContent(){
    return sidepanel.parentData.map((options) => {
      return <CollectionView data = {options.suiteType} 
      showCollectionChildView = {() => _renderPanelItemViewCollection(options.suiteType)}/>
    })
  };
  
  // Render custom inline menu for item panel collection!
  function _renderCustomInlineMenu(data){
    return(
      <span style = {{marginBottom: '2px'}}>
        <span className = "inline-menu" style = {{border: '2px solid black', 
          backgroundColor: "lightblue", color: 'black', padding: '0px 2px 0px 2px'}}>
          {data + ' F'}
        </span>
      </span>
    )
  };
  
  // Get form mode based on room status constant!
  function getFormMode(model) {
    const status = model.roomStatusConstant;
    if (status === 'afterCheckin') {
      return 'read';
    } else if (status === 'afterCleaned') {
      return 'edit';
    } else {
      return 'roomStatus';
    }
  };

  // Item panel collection onClick!
  function panelItemOnClick(uId, model){
    var dashboardMode = getFormMode(model);
    _updateSelectedIdList(uId);
    props.selectedModel(model, dashboardMode);
  };
  
  // Highlight selected ID!
  function _updateSelectedIdList(id){
    setSidepanel(prevState => ({...prevState, selectedId: [...prevState.selectedId, id]}));
  };
  
  // Render panel item view collection!
  function _renderPanelItemViewCollection(selectedType){
    return sidepanel.childData.map((options) => {
      if(options.suiteName === selectedType){
        // Determine the status color code!
        var statusColorCode = getStatusCodeColor(options.roomStatusConstant);
        return <PanelItemView data = {options.roomno} _id = {options._id} showIndentationArrow = {true}
        showInlineMenu = {true} customInlineMenu = {true} colorCode = {statusColorCode}
        onClick = {(uId) => panelItemOnClick(uId, options)} selectedItem = {sidepanel.selectedId}
        _renderCustomInlineMenu = {() => _renderCustomInlineMenu(options.floorNo)} />
      }
    })
  };
  
  // Get side panel loader options!
  function getLoaderOpts(){
    return{
      color: "black",
      marginTop: (sidepanel.height) / 2.2 + "px",
      textCenter: true
    }
  };
  
  // Fetch the available room types!
  async function fetchRoomsTypes(){
    _toggleLoader(true);
    const result = await getAvailableRoomTypes(props.params.accIdAndName[0]);
    if(result.data.success){
      setSidepanel(prevState => ({...prevState, parentData: result.data.message}));
      fetchRoomsLists();
    }
  };

  // Fetch user model!
  async function fetchUserModel(){
    var params = {lodgeId: props.params.accIdAndName[0]};
    const result = await getUserModel(params);
    if(result.data.success){
      return result.data.message;
    };
  };
  
  // Fetch the available rooms list!
  async function fetchRoomsLists(){
    const result = await getRoomList(props.params.accIdAndName[0]);
    if(result.data.success){
      setSidepanel(prevState => ({...prevState, childData: result.data.message}));
      var userModel = await fetchUserModel();
      props.updatePropertyDetails(result.data.message, result.data.countAvailability, result.data.roomStatus, userModel); // Send the property details to the dashboard container!
      _toggleLoader(false);
    }
  };
  
  // Reset client side data to its original data value!
  function _resetClientData(){
    setSidepanel(prevState => ({...prevState, height: undefined, selectedId: []}));
  };
  
  // Update the child model on every silent true state update!
  function updateModel(){
    if(props.selectedModelData.roomModel !== undefined){ // this condition is added here because when we click on cancel on the property container 
      // The opts which gets send to the dashboardController function is reloadSidepanel silent: true to avoid making an api call for cancel operation!
      // That time the props.selectedModelData.roomModel will be undefined.
      var currentModelData = sidepanel.childData,
        updatedModelId = props.selectedModelData.roomModel._id,
        updatableIndex;
      currentModelData.map((key,index) => {
        if(key._id === updatedModelId){
          updatableIndex = index;
        };
      });
      // Update the data at the calculated index!
      currentModelData[updatableIndex] = props.selectedModelData.roomModel;
      setSidepanel(prevState => ({...prevState, childData: currentModelData})); // Update the child data!
    }
  };
  
  // Update the sidepanel height when props.data.height changes!
  useEffect(() => {
    if(!props.controller.reloadSidepanel.silent){ 
      fetchRoomsTypes();
    } else {
      updateModel();
    }
    _resetClientData();
    updateSidePanelHeight(props.data.height);
  }, [props.data.height, props.controller.reloadSidepanel]);
  
  // Panel View!
  function _renderPanelView(){
    return <PanelView data = {sidepanel} childView = {() => sidepanelChildView()} />
  }
  
  return _renderPanelView();
}

export default SidepanelWrapper;