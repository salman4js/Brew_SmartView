import React, {useState, useEffect} from 'react';
import sidepanelConstants from "./sidepanel.container.constants";
import SidepanelContainerSearchView from "./sidepanel.container.search.view";
import { getAvailableRoomTypes, getUserModel } from './sidepanel.container.utils';
import { getRoomList } from '../../paymentTracker/payment.tracker.utils/payment.tracker.utils';
import { getStatusCodeColor, formatDate } from '../../common.functions/common.functions';
import { updateMetadataFields, nodeConvertor } from '../../common.functions/node.convertor';
import { activityLoader } from '../../common.functions/common.functions.view';
import CustomModal from '../../CustomModal/custom.modal.view';
import MetadataTableView from '../../metadata.table.view/metadata.table.view';
import MetadataFields from '../../fields/metadata.fields.view';
import PanelView from '../../SidePanelView/panel.view';
import PanelItemView from '../../SidePanelView/panel.item/panel.item.view';
import CollectionView from '../../SidePanelView/collection.view/collection.view';

const SidepanelWrapper = (props, ref) => {

  // Sidepanel state handler!
  const [sidepanel, setSidepanel] = useState({
    height: undefined,
    header: "Rooms List",
    isLoading: true,
    parentData: undefined,
    childData: undefined,
    selectedId: [],
    listFilter: undefined
  });
  
  // Sidepanel view state handler!
  const [sidepanelView, setSidepanelView] = useState({
    roomListTreePanel: true, // By default, roomListTreePanel is true!
    filterRoomPanel: false
  });
  
  // Filter input metadata fields!
  const [filterState, setFilterState] = useState([{
    value: undefined,
    width: '300px',
    padding: '10px 5px 5px 5px',
    placeholder: "Filter by type",
    name: 'suiteType',
    attribute: 'listField',
    noneValue: "None",
    options: undefined,
    style: {
      color: "black",
      fontSize: "15px",
      paddingRight: "10px",
      paddingLeft: "10px",
      cursor: "pointer",
    },
    callBackAfterUpdate: _applyFilter
  }, {
    value: new Date(),
    placeholder: "Date of Checkout",
    name: 'checkOutDate',
    attribute: 'dateField',
    isRequired: true,
    style: {
      color: "black",
      fontSize: "15px",
      paddingRight: "10px",
      paddingLeft: "10px",
      cursor: "pointer",
    },
    callBackAfterUpdate: _applyFilter
  }]);
  
  // Custom modal state handler!
  const [customModal, setCustomModal] = useState({
    show: false,
    onHide: _toggleCustomModal,
    customData: undefined,
    header: 'Room details',
    centered: true,
    modalSize: 'medium'
  });

  // Update filter string from the sidepanel search view!
  function _updateFilterData(filterData){
    setSidepanel(prevState => ({...prevState, listFilter: filterData}))
  };

  // Is filter applied!
  function isFilterApplied(){
    return sidepanel.listFilter && sidepanel.listFilter.length > 0;
  };
  
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
    if(sidepanelView.roomListTreePanel){
      return roomListTreeView();
    } else {
      return filterPanelView();
    }
  };
  
  // Sidepanel filter state view!
  function filterPanelView(){
    return(
      <div className = 'sidepanel-filter-panel'>
        <MetadataFields data = {filterState} updateData = {setFilterState}/>
      </div>
    )
  };

  // Side-panel search bar view!
  function _renderSearchBarView(){
    return <SidepanelContainerSearchView updateFilterData = {(filterData) => _updateFilterData(filterData)} />
  }
  
  // Sidepanel room list tree view!
  function roomListTreeView(){
    return (
        <>
          {_renderSearchBarView()}
          {!sidepanel.listFilter && sidepanel.parentData.map((options) => {
            return <CollectionView data = {options.suiteType} showCollectionChildView = {() => _renderPanelItemViewCollection(options.suiteType)}/>
          })}
          {sidepanel.listFilter && (sidepanel.listFilter.length !== 0) && sidepanel.listFilter.map((options) => {
            options['allowSubData'] = true;
            return (
                <div className = 'collection-sub-child-view'>
                  {_renderPanelItemView(options)}
                </div>
            )
          })}
        </>
    )
  };
  
  // Render custom inline menu for item panel collection!
  function _renderCustomInlineMenu(data){
    return(
      <span style = {{marginBottom: '2px'}} onClick = {(e) => _toggleCustomModal(data, e, true)}>
        <span className = "inline-menu" style = {{border: '2px solid black', 
          backgroundColor: "lightblue", color: 'black', padding: '0px 2px 0px 2px'}}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle-fill" viewBox="0 0 16 16">
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
          </svg>
        </span>
      </span>
    )
  };
  
  // Get form mode based on room status constant!
  function getFormMode(model) {
    const status = model.roomStatusConstant;
    if (status === sidepanelConstants.formModeConstants.READ_MODE) {
      return sidepanelConstants.formMode.READ_MODE;
    } else if (status === sidepanelConstants.formModeConstants.EDIT_MODE) {
      return sidepanelConstants.formMode.EDIT_MODE;
    } else {
      return sidepanelConstants.formMode.ROOM_STATUS_MODE;
    }
  };  
  
  // Enabled filter panel!
  function _setFilterPanel(value){
    // Generate options and update filterpanel data.
    var filterPanelDropdownOptions = prepareFilterPanelOptions(sidepanel.parentData);
    updateMetadataFields('suiteType', {options: filterPanelDropdownOptions}, filterState, setFilterState);
    _toggleSidepanelView(!value, value);
  };
  
  // Enable tree panel!
  function _setTreePanel(value){
    _toggleSidepanelView(value, !value);
  };
  
  // Apply filter for the user filtered data!
  function _applyFilter(){
    var filterData = nodeConvertor(filterState);
    filterData.checkOutDate = formatDate(filterData.checkOutDate);
    props.updateFilterData(filterData);
  };
  
  // Toggle between sidepanel view!
  function _toggleSidepanelView(roomListTree, filterPanel){
    // Choose header and change panel state!
    var panelHeader = roomListTree ? sidepanelConstants.panelHeader.ROOM_LISTS : sidepanelConstants.panelHeader.FILTER_PANEL;
    setSidepanel(prevState => ({...prevState, header: panelHeader}));
    setSidepanelView(prevState => ({roomListTreePanel: roomListTree, filterRoomPanel: filterPanel}));
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
        return _renderPanelItemView(options);
      }
    })
  };

  // Render panel item view for filter and non-filter data's.
  function _renderPanelItemView(options){
    // Determine the status color code!
    var statusColorCode = getStatusCodeColor(options.roomStatusConstant);
    return <PanelItemView data = {options.roomno} _id = {options._id} showIndentationArrow = {true} subData = {options.customerName}
                   allowSubData = {options.allowSubData} showInlineMenu = {true} customInlineMenu = {true} colorCode = {statusColorCode}
                   onClick = {(uId) => panelItemOnClick(uId, options)} selectedItem = {sidepanel.selectedId}
                   _renderCustomInlineMenu = {() => _renderCustomInlineMenu(options)} />
  };
  
  // Get side panel loader options!
  function getLoaderOpts(){
    return{
      color: "black",
      marginTop: (sidepanel.height) / 2.2 + "px",
      textCenter: true
    }
  };
  
  // Side panel custom modal body item view!
  function customModalBodyItemView(){
    var data = customModal.customData,
      headerValue = sidepanelConstants.tableHeader.MORE_DETAILS_HEADER,
      cellValues = [{_id: 'dummyInstance', floorNo: data.floorNo, bedCount: data.bedCount, extraBedPrice: data.extraBedPrice, roomPrice: data.price}],
      tableData = {headerValue, cellValues, tableCellWidth: "180px"};
    return <MetadataTableView data = {tableData} /> 
  };
  
  // Trigger custom modal!
  function _toggleCustomModal(data, e, value){
    e && e.stopPropagation();
    setCustomModal(prevState => ({...prevState, show: value, customData: data}));
  };
  
  // Render custom modal!
  function _renderCustomModal(){
    return <CustomModal modalData = {customModal} showBodyItemView = {customModalBodyItemView} />
  };
  
  // Prepare filter panel options!
  function prepareFilterPanelOptions(parentData){
    var result = [];
    for (var data of parentData){
      var options = {};
      options.value = data.suiteType;
      options.actualValue = data.suiteType;
      result.push(options);
    };
    return result;
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
    var options = {getWidgetTileCollection: true};
    const result = await getRoomList(props.params.accIdAndName[0], options);
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
      var isListFilterApplied = isFilterApplied(),
          currentModelData = sidepanel.childData,
          currentListFilterData = sidepanel.listFilter,
          updatedModelId = props.selectedModelData.roomModel._id,
          updatableIndex,
          updatableFilterIndex;
      // Find the changed data index through the changed model roomId for side panel's child data
      currentModelData.map((key, index) => {
        if(key._id === updatedModelId){
          updatableIndex = index;
        };
      });
      // Find the changed data index through the changed model roomId for side panel's list filter data
      isListFilterApplied && currentListFilterData.map((key, index) => {
        if(key._id === updatedModelId){
          updatableFilterIndex = index;
        }
      });
      // Update the data at the calculated index!
      currentModelData[updatableIndex] = props.selectedModelData.roomModel;
      setSidepanel(prevState => ({...prevState, childData: currentModelData})); // Update the child data!
      if(isListFilterApplied){
        currentListFilterData[updatableFilterIndex] = props.selectedModelData.roomModel;
        setSidepanel(prevState => ({...prevState, listFilter: currentListFilterData})); // Update the list filter data!
      }
    }
  };
  
  // Expose child function to the parent component!
  React.useImperativeHandle(ref, () => ({
    _setFilterPanel, _setTreePanel
  }));

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
    return(
      <>
        {customModal.show && _renderCustomModal()}
        <PanelView data = {sidepanel} childView = {() => sidepanelChildView()} />
      </>
    )
  }
  
  return _renderPanelView();
}

export default React.forwardRef(SidepanelWrapper);