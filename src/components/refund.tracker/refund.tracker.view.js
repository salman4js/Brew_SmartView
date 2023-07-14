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
    _showHeaderChildView: null,
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