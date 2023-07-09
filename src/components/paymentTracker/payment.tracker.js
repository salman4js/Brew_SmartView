import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useCheckboxSelection} from '../global.state/global.state.manager'
import {addValue, removeValue, getValue, removeAllValue} from '../../global.state/actions/index';
import PaymentTrackerContent from './payment.tracker.content/payment.tracker.content.view'
import PanelItemView from '../SidePanelView/panel.item/panel.item.view';
import { getRoomList, getPaymentTracker, getPaymentDetails} from './payment.tracker.utils/payment.tracker.utils';
import { globalMessage, commonLabel, activityLoader } from '../common.functions/common.functions.view';
import { checkboxSelection, handleCommands } from '../common.functions/node.convertor';
import { getStorage, setStorage, removeItemStorage} from '../../Controller/Storage/Storage'
import Navbar from '../Navbar';
import Invoice from '../Invoice/invoice.view'
import changeScreen from '../Action';
import ModalAssist from '../modal.assist/modal.assist.view'
import { Link, useParams } from "react-router-dom";

const PaymentTracker = (props) => {
  
  // Context ID references!
  const { id } = useParams();
  const splitedIds = id.split(/[-]/);
  
  // Global state management - Checkbox selection!
  var checkboxSelector = useCheckboxSelection();
  const dispatch = useDispatch();
  
  // Modal assist state handler!
  const [modalAssist, setModalAssist] = useState({
    header: "Payment Tracker",
    _showHeaderChildView: null,
    getWidth: true,
    getHeaderHeight: true,
    headerHeight: undefined,
    width: undefined,
    height: undefined,
    showCustomModal: false,
    showEditModal: false,
    customModalHeader: undefined,
    style: {
      fontWeight: "bold",
      marginLeft: "5px",
      marginRight: "5px",
      marginTop: "60px",
      marginBottom: "10px",
      overflow: "hidden"
    }
  })
  
  // Global Message State Handler!
  const [message, setMessage] = useState({
    show: false,
    message: undefined,
    onHide: messageOnHide
  })
  
  // Destroy the global message!
  function messageOnHide(){
    setMessage(prevState => ({...prevState, show: false}))
  }
  
  // Receipt generation state handler!
  const [receipt, setReceipt] = useState({
    isReceipt: true,
    generateReceipt: false,
    headerValue: undefined,
    cellValues: undefined,
    tableCellWidth: "200px",
    infoMessage: "No receipt's were selected to print!",
    tableLoader: false,
    totalAmount: undefined,
    customerDetails: undefined
  })
  
  // Table view state handler!
  const [tableView, setTableView] = useState({
    cellValues: undefined,
    headerValue: undefined,
    infoMessage: "No payment tracker has been selected...",
    tableLoader: false,
    selectedRoomId: undefined,
    isCheckboxSelected: false,
    enableCheckbox: true,
    tableCellWidth : "590px",
    checkbox: [
      {
        select: checkboxSelected,
        value: false,
        attribute: "checkBoxField",
        enableCellCheckbox: true,
        enableHeaderCheckbox: true
      }
    ],
    showPanelField: false,
  })
  
  // Panel field state handler!
  const [panelHelper, setPanelHelper] = useState(
    [
      {
        value: "check-in property",
        attribute: "dataListField",
        allowInputField: false,
        allowPanelField: true,
        height: 27,
        selectedValue: "check-in property",
        showListValue: function(){
          return true;
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
        options: [
          {
            value: "check-in property"
          },
          {
            value: "prebook property"
          }
        ]
      }
    ]
  )
  
  // Update panel helper from metadata fields!
  function updatePanelHelper(state){
    setPanelHelper(state); // Update the panel helper!
    panelItemOnClick(tableView.selectedRoomId); // When the panel helper changes,
    // Call the panelItemOnClick function with the roomId and the selected property 
    // To get the appropriate data!
  }
  
  // Command helper state handler!
  const [commandHelper, setCommandHelper] = useState({
    commandHelper: false,
    commands: [
      {
        value: "Generate Receipt",
        onClick: generateReceipt,
        disabled: false
      },
      {
        value: "Delete",
        onClick: null,
        disabled: false
      }
    ]
  })
  
  // Generate receipt for the selection!
  async function generateReceipt(){
    const checkboxSelection = JSON.parse(getStorage("selectedItem"));
    const data = {};
    data['paymentIds'] = checkboxSelection;
    data['isPrebook'] = getState();
    const result = await getPaymentDetails(splitedIds[0], data);
    if(result.data.success){
      // Generate Receipt
      setReceipt(prevState => ({...prevState, cellValues: result.data.message, 
        headerValue: result.data.tableHeaders, generateReceipt: true,
      customerDetails: result.data.customerDetails, totalAmount: result.data.totalAmount}));
      destroyCommandHelper();
    } else {
      setMessage(prevState => ({...prevState, show: true, message: result.data.message}))
    }
  }
  
  // On hide receipt when the operation is done!
  function onHideReceipt(){
    setReceipt(prevState => ({...prevState, generateReceipt: false}));
  }
  
  // Trigger the command helper when checkbox is being selected!
  function checkboxSelected(value, modelId){
    var storageId = "payment-tracker-selected-count"
    checkboxSelection(value, setCommandHelper, storageId);
    setModelId(value, modelId);
    isCommandsValid()
  }
  
  // Check for the valid commands, and disable the invalid!
  function isCommandsValid(){
    const selectedCount = getStorage("payment-tracker-selected-count");
    console.log(selectedCount)
    var commands = ['Delete'];
    var state = selectedCount > 1;
    handleCommands(commands, setCommandHelper, state);
  }
  
  // Store and remove modelId from the global state based on the action!
  function setModelId(value, modelId){
    if(value){
      dispatch(addValue(modelId));
    } else {
      dispatch(removeValue(modelId));
    }
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
    inlineAction: false
  })
  
  // trigger the table loader!
  function _triggerTableLoader(value){
    setTableView(prevState => ({...prevState, tableLoader: value}));
  }
  
  // Get modal assist height and store it in the state!
  function storeModalAssistHeight(value){
    setSidepanel(prevState => ({...prevState, height: value}));
  }
  
  // Setup side panel child view!
  function _showPanelChildView(){
    var opts = {
      message: "No payment has been tracked...",
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
  
  // Panel Item Child View!
  function childItemView(){
    return(
      sidepanel.data.map((options, key) => {
        return(
          <PanelItemView data = {options.roomno} _id = {options._id} 
          onClick = {(id) => panelItemOnClick(id)} showInlineMenu = {sidepanel.inlineAction} />
        )
      })
    )
  }
  
  // Get the property state to make the get call in boolean value (true being prebook and vice versa)!
  function getState(){
    var result;
    panelHelper.map((options, index) => {
      result = options.value !== "check-in property" ? true : false;
    })
    
    return result;
  }
  
  // Destroy command helper when the operation is done!
  function destroyCommandHelper(){
    dispatch(removeAllValue()); // Clear of the global state handler 
    // for selected model before destroying the command helper!
    setStorage("payment-tracker-selected-count", 0)
    setCommandHelper(prevState => ({...prevState, commandHelper: false}));
  }
  
  // Side panel item on click!
  async function panelItemOnClick(roomId){
    _triggerTableLoader(true);
    destroyCommandHelper();
    var data = {};
    data['room'] = roomId;
    data['isPrebook'] = getState();
    const result = await getPaymentTracker(splitedIds[0], data);
    updateTableCellData(result, roomId);
  }
  
  // Get the payment details and populate it into the model!
  function updateTableCellData(result, roomId){
    if(result.data.success){
      _triggerTableLoader(false);
      setTableView(prevState => ({...prevState, cellValues: result.data.message, headerValue: result.data.tableHeaders, 
        infoMessage: result.data.infoMessage, showPanelField: true, selectedRoomId: roomId}));
    }
  }
  
  // Set up the payment content view!
  function paymentTrackerContent(){
    return(
      <PaymentTrackerContent data = {sidepanel} tableData = {tableView} childView = {() => _showPanelChildView()}
      updateSidepanelHeight = {(value) => storeModalAssistHeight(value)} commandHelper = {commandHelper} 
      panelHelper = {panelHelper} updatePanelHelper = {(state) => updatePanelHelper(state)}  />
    )
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
  
  // Call the functions on onRender!
  useEffect(() => {
    roomsList();
    setStorage("payment-tracker-selected-count", 0); // Maintain this selectedCount in the local storage!
    removeItemStorage("selectedItem"); // Remove any undeleted selection id's
  }, [])
  
  return(
    <div>
      {receipt.generateReceipt && (
        <Invoice node = {receipt} onHide = {() => onHideReceipt()} />
      )}
      {!receipt.generateReceipt && (
        <>
          <Navbar id={id} name={splitedIds[1]} />
          <ModalAssist data = {modalAssist} height = {(value) => storeModalAssistHeight(value)} childView = {() => paymentTrackerContent()} />
        </>
      )}
      {message.show && (
        globalMessage(message)
      )}
    </div>
  )
}

export default PaymentTracker;