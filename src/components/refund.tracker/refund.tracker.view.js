import React, {useState, useEffect} from 'react';
import { _renderNavbar } from '../common.functions/common.functions.view';
import PanelItemView from '../SidePanelView/panel.item/panel.item.view';
import PaymentTrackerContent from '../paymentTracker/payment.tracker.content/payment.tracker.content.view';
import { getRoomList } from '../paymentTracker/payment.tracker.utils/payment.tracker.utils';
import { getRefundTrackerList } from "./refund.tracker.utils";
import {activityLoader, commonLabel} from '../common.functions/common.functions.view';
import changeScreen from '../Action';
import ModalAssist from '../modal.assist/modal.assist.view';
import { Link, useParams } from "react-router-dom";

const RefundTracker = () => {
  
  // Context ID references!
  const { id } = useParams();
  const splitedIds = id.split(/[-]/);
  
  // Modal assist state handler!
  const [modalAssist, setModalAssist] = useState({
    header: "Refund Tracker",
    _showHeaderChildView: _showHeaderChildView,
    getWidth: true,
    getHeaderHeight: true,
    headerHeight: undefined,
    width: undefined,
    height: undefined,
    style: {
      fontWeight: "bold",
      marginLeft: "5px",
      marginRight: "5px",
      marginTop: "60px",
      marginBottom: "10px",
      overflow: "hidden"
    }
  });
  
  // Show modal assist header child view!
  function _showHeaderChildView(){
    return(
      <div className = "brew-cursor" onClick = {() => null}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16">
          <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
          <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
        </svg>
      </div>
    )
  }
  
  // Table view state handler!
  const [tableView, setTableView] = useState({
    cellValues: undefined,
    headerValue: undefined,
    infoMessage: "No refund tracker has been selected...",
    tableLoader: false,
    selectedRoomId: undefined,
    isCheckboxSelected: false,
    enableCheckbox: false,
    tableCellWidth : "590px",
    checkbox: [
      {
        select: null,
        value: false,
        attribute: "checkBoxField",
        enableCellCheckbox: true,
        enableHeaderCheckbox: true
      }
    ],
    showPanelField: false,
  });
  
  // trigger the table loader!
  function _triggerTableLoader(action){
    setTableView(prevState => ({...prevState, tableLoader: action}))
  }
  
  // Side panel state handler!
  const [sidepanel, setSidepanel] = useState({
    height: undefined,
    header: "Rooms List",
    headerControl: false,
    headerControlEvent: null,
    eventTrigerred: false,
    enableLoader: true,
    data: undefined,
    inlineAction: false,
    selectedId: []
  })
  
  // Store modal assist value!
  function storeModalAssistHeight(value){
    setSidepanel(prevState => ({...prevState, height: value}));
  }
  
  // Show child panel side view!
  function _showPanelChildView(){
    var opts = {
      message: "Cannot fetch rooms at this moment..",
      color: "black",
      marginTop: (sidepanel.height) / 2.2 + "px",
      textCenter: true
    }
    
    if(sidepanel.enableLoader){
      return activityLoader(opts)
    }
    
    if(sidepanel.data?.length === 0){
      return commonLabel(opts)
    }

    if(sidepanel.data !== undefined && sidepanel.data.length !== 0){
      return childItemView();
    }
  }
  
  // Panel Item on click!
  function panelItemOnClick(id){ // ID being the refund tracker ID!
    updateSelectedIdList(id);
    updateTableData(id);
  }
  
  // Update selected ID list of the panel item!
  function updateSelectedIdList(id){
    setSidepanel(prevState => ({...prevState, selectedId: [...prevState.selectedId, id]}))
  }
  
  // Panel Item child view!
  function childItemView(){
    return(
      sidepanel.data.map((options, key) => {
        return(
          <PanelItemView data = {options.roomno} _id = {options._id} selectedItem = {sidepanel.selectedId}
          onClick = {(id) => panelItemOnClick(id)} showInlineMenu = {sidepanel.inlineAction} />
        )
      })
    )
  }
  
  // ChildView for refund tracker!
  function refundTrackerContent(){
    return <PaymentTrackerContent data = {sidepanel} tableData = {tableView} idInstance = {["lodge", 'roomId']} childView = {() => _showPanelChildView()} updateSidepanelHeight = {(value) => storeModalAssistHeight(value)} />
  }
  
  // Get rooms list!
  async function roomsList(){
    const result = await getRoomList(splitedIds[0]);
    if(result.data.success){
      setSidepanel(prevState => ({...prevState, data: result.data.message, enableLoader: false}))
    } else { // Token must have expired, navigate back to login route!
      changeScreen(true);
    }
  }
  
  // Get and update table data!
  async function updateTableData(roomId){
    _triggerTableLoader(true);
    const data = {
      roomId: roomId
    }
    const result = await getRefundTrackerList(splitedIds[0], data);
    if(result.data.success){
      _triggerTableLoader(false);
      setTableView(prevState => ({...prevState, cellValues: result.data.message, headerValue: result.data.tableHeaders, 
        infoMessage: result.data.infoMessage, showPanelField: false, selectedRoomId: roomId}));
    }
  }
  
  // Call the functions on onRender!
  useEffect(() => {
    roomsList();
    updateTableData();
  }, [])
  
  return(
    <div>
      {_renderNavbar(id, splitedIds)}
      <ModalAssist data = {modalAssist} height = {(value) => storeModalAssistHeight(value)} childView = {() => refundTrackerContent()} />
    </div>
  )
}

export default RefundTracker;