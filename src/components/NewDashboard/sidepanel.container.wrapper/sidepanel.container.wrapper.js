import React, {useState, useEffect} from 'react';
import { getAvailableRoomTypes } from './sidepanel.container.utils';
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
    paranetData: undefined,
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
  function getFormMode(model){
    switch(model.roomStatusConstant){
      case 'afterCheckin':
        return 'read';
        break;
      case 'afterCleaned':
        return 'edit';
        break;
      case 'afterCheckedout':
        return 'dirty';
        break;
      case 'inCleaning':
        return 'incleaning';
        break;
    };
  };
  
  // Item panel collection onClick!
  function panelItemOnClick(uId, model){
    var formMode = getFormMode(model);
    _updateSelectedIdList(uId);
    props.selectedModel(model, formMode);
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
  
  // Fetch the available rooms list!
  async function fetchRoomsLists(){
    const result = await getRoomList(props.params.accIdAndName[0]);
    if(result.data.success){
      setSidepanel(prevState => ({...prevState, childData: result.data.message}));
      _toggleLoader(false);
    }
  };
  
  // Reset client side data to its original data value!
  function _resetClientData(){
    setSidepanel(prevState => ({...prevState, height: undefined, selectedId: []}));
  };
  
  // Update the sidepanel height when props.data.height changes!
  useEffect(() => {
    if(!props.controller.reloadSidepanel.silent){ 
      fetchRoomsTypes();
    };
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