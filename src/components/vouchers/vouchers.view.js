import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {useCheckboxSelection} from '../global.state/global.state.manager'
import {addValue, removeValue, getValue, removeAllValue} from '../../global.state/actions/index';
import ModalAssist from '../modal.assist/modal.assist.view';
import CustomModal from '../CustomModal/custom.modal.view';
import PanelItemView from '../SidePanelView/panel.item/panel.item.view';
import CollectionView from '../SidePanelView/collection.view/collection.view'
import VoucherContent from './vouchers.content.view';
import NetProfitView from './net.profit.view';
import MetadataFields from '../fields/metadata.fields.view';
import { getVouchersList, getNetProfitPreview, addVouchersList, getVoucherModelList, addVoucherModelList, editVoucherModelList, deleteVoucherModelList, getPrevVoucherModel } from './vouchers.utils.js';
import { getAllPaymentTracker, getRoomList } from '../paymentTracker/payment.tracker.utils/payment.tracker.utils';
import { Link, useParams } from "react-router-dom";
import {setStorage, getStorage, removeItemStorage} from '../../Controller/Storage/Storage'
import { globalMessage, commonLabel, activityLoader } from '../common.functions/common.functions.view';
import { nodeConvertor, validateFieldData, _clearData, _enableInlineToast, checkboxSelection, handleCommands } from '../common.functions/node.convertor';
import {formatCustomIntoDateFormat, convertFormat, convertServerFormat } from '../common.functions/common.functions';
import changeScreen from '../Action';


const VoucherView = () => {
  
  //Check the ID and token of the application!
  const { id } = useParams();
  const splitedIds = id.split(/[-]/);
  
  // Global state management - Checkbox selection!
  var checkboxSelector = useCheckboxSelection();
  const dispatch = useDispatch();
  
  // History reference!
  const navigate = useNavigate();
  
  // Link with vouchers!
  const [linkWithVouchers, setLinkWithVouchers] = useState({
    isLinkedWithVouchers: isLinkedWithVouchers,
    parentData: [{
      title: "Inflow",
      loadData: 'paymentTracker'
    },{
      title: 'Outflow',
      loadData: 'vouchers'
    }]
  })
  
  // Modal assist state handler!
  const [modalAssist, setModalAssist] = useState({
    header: "Vouchers Content Assist",
    _showHeaderChildView: _showHeaderChildView,
    style: {
      fontWeight: "bold",
      overflow: "auto"
    }
  });
  
  // Is livixius linked with vouchers!
  function isLinkedWithVouchers(){
    return JSON.parse(getStorage('is-linked-with-vouchers'));
  }
  
  // Modal assist header child view!
  function _showHeaderChildView(){
    return(
      <div className = "brew-cursor" onClick = {() => changeScreen()}>
        LogOut
      </div>
    )
  }
  
  // Table view state handler!
  const [tableView, setTableView] = useState({
    cellValues: undefined,
    headerValue: undefined,
    tableHeight: undefined,
    infoMessage: "No vouchers has been selected...",
    tableLoader: false,
    selectedVoucherId: undefined,
    isCheckboxSelected: false,
    enableCheckbox: true,
    tableCellWidth : "290px",
    checkbox: [
      {
        select: checkboxSelected,
        value: false,
        attribute: "checkBoxField",
        enableCellCheckbox: true,
        enableHeaderCheckbox: false
      }
    ]
  })
  
  // Command helper state handler!
  const [commandHelper, setCommandHelper] = useState({
    commandHelper : false,
    commands: [
      {
        value: "Edit",
        onClick: _getPrevVoucherValue
      },
      {
        value: "Delete",
        onClick: onDeleteVoucherModel
      }
    ]
  });

  // Get previous voucher value!
  async function _getPrevVoucherValue(){
    var acknowledgerMessage = "Fetching previous value..."
    _triggerAcknowledger(acknowledgerMessage)
    const checkboxSelection = JSON.parse(getStorage("selectedItem"));
    // Get previous value for the selected voucher model!
    var data = {};
    data["voucherId"] = checkboxSelection[0]; // Since we support only one edit at a time!
    const prevData = await getPrevVoucherModel(splitedIds[0], data);
    if(prevData.data.success){
      killAcknowledger();
      _triggerEditModel(checkboxSelection[0])
    }
  }
  
  // On Delete voucher model!
  async function onDeleteVoucherModel(){
    const checkboxSelection = JSON.parse(getStorage("selectedItem"));
    const data = {};
    data['voucherId'] = checkboxSelection;
    const result = await deleteVoucherModelList(splitedIds[0], data);
    if(result.data.success){
      destroyCommandHelper();
      panelItemOnClick(result.data.voucherId);
    }
  }
  
  // On edit voucher model!
  async function _triggerEditModel(checkboxSelection){
    var inlineHeader = "Edit Voucher Model";
    var customModalButtonId = "Edit";
    _triggerAddVoucherModel(checkboxSelection, inlineHeader, customModalButtonId) // Checkbox selection will always be one,
    // Since we support only single item edit at a time!
  }
  
  // Perform action after the checkbox is being selected!
  function checkboxSelected(value, modelId){
    var storageId = "voucher-selected-count";
    checkboxSelection(value, setCommandHelper, storageId);
    setModelId(value, modelId);
    isCommandsValid();
  }
  
  // Check for the valid commands, and disable the invalid!
  function isCommandsValid(){
    const selectedCount = getStorage("voucher-selected-count");
    var commands = ['Edit'];
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
  
  // Destroy command helper!
  function destroyCommandHelper(){
    dispatch(removeAllValue()) // Clear out the global state manager,
    // Before destroying the command helper!
    setStorage("voucher-selected-count", 0);
    setCommandHelper(prevState => ({...prevState, commandHelper: false}));
  }
  
  // Trigger table loader!
  function _triggerTableLoader(value){
    setTableView(prevState => ({...prevState, tableLoader: value}));
  }
  
  // Custom modal input field state handler!
  const [inputField, setInputField] = useState([
    {
      value: undefined,
      placeholder: "Name of the voucher",
      label: "Voucher Name",
      name: 'voucherName',
      attribute: 'textField',
      isRequired: true,
      inlineToast: {
        isShow: false,
        inlineMessage: 'Please enter a valid voucher name'
      }
    }
  ])
  
  // Custom modal input field state handler for voucher model!
  const [voucherModel, setVoucherModel] = useState([
    {
      value: undefined,
      placeholder: "Voucher no",
      label: "Voucher No",
      name: 'vNo',
      attribute: 'textField',
      isRequired: true,
      inlineToast: {
        isShow: false,
        inlineMessage: 'Please provide a valid input.'
      }
    },
    {
      value: new Date(),
      defaultValue: new Date(),
      placeholder: "Date",
      label: "Date",
      name: 'dateTime',
      attribute: 'dateField',
      isRequired: false,
      inlineToast: {
        isShow: false,
        inlineMessage: 'Please provide a valid input.'
      }
    },
    {
      value: undefined,
      placeholder: "Particulars",
      label: "Particulars",
      name: 'particulars',
      attribute: 'textField',
      isRequired: true,
      inlineToast: {
        isShow: false,
        inlineMessage: 'Please provide a valid input.'
      }
    },
    {
      value: undefined,
      placeholder: "Cash Mode",
      label: "Cash Mode",
      name: 'cashMode',
      attribute: 'textField',
      isRequired: true,
      inlineToast: {
        isShow: false,
        inlineMessage: 'Please provide a valid cash mode.'
      }
    },
    {
      value: 0,
      defaultValue: 0,
      placeholder: "Receipt",
      label: "Receipt",
      name: 'receipt',
      attribute: 'textField',
      isRequired: true,
      inlineToast: {
        isShow: false,
        inlineMessage: 'Please provide a valid receipt.'
      }
    },
    {
      value: 0,
      defaultValue: 0,
      placeholder: "Payment",
      label: "Payment",
      name: 'payment',
      attribute: 'textField',
      isRequired: true,
      inlineToast: {
        isShow: false,
        inlineMessage: 'Please provide a valid payment.'
      }
    }
  ])
  
  // get field data from the node convertor!
  function getFieldData(node){
    return nodeConvertor(node);
  }
  
  // Clear field data!
  function _clearFieldData(state, setState){
    const updatedFieldData = _clearData(state);
    setState(state);
  }
  
  // Get modal assist height and store it in the state!
  function storeModalAssistHeight(value){
    setSidepanel(prevState => ({...prevState, height: value}));
  }
  
  // Update the selected id list1
  function updateSelectedIdList(selectedId){
    setSidepanel(prevState => ({...prevState, selectedId: [...prevState.selectedId, selectedId]}))
  };
  
  // Get the selected option!
  function getSelectedOption(){
    return sidepanel.selectedOption;
  }
  
  // Side panel state handler!
  const [sidepanel, setSidepanel] = useState({
    height: undefined,
    header: "Vouchers List",
    headerControl: true,
    headerControlEvent: _openCustomDialog,
    headerInfoEvent: _openInfoDialog,
    eventTrigerred: false,
    infoEventTriggered: false,
    enableLoader: true,
    data: undefined,
    inlineAction: false,
    inlineHeader: undefined,
    customModalButtonId: undefined,
    voucherId: undefined,
    voucherModelId: undefined,
    selectedId: [],
    showCheatCodeFilter: true
  });
  
  // Net profit preview state handler!
  const [netProfit, setNetProfit] = useState({
    isLinkedWithVouchers: isLinkedWithVouchers(),
    isLoading: true,
    paymentTrackerSum: undefined,
    voucherPaymentSum: undefined,
    vouchersReceiptSum: undefined,
    paymentTrackerTaxableAmount: undefined,
    netProfit: undefined,
    netProfitWithoutLivixius: undefined
  });
  
  // Room list state handler incase of vouchers linked with livixius!
  const [roomList, setRoomList] = useState({
    rooms: undefined
  })
  
  // Global message state handler!
  const [acknowledger, setAcknowledger] = useState({
    show: false,
    message: undefined,
    closeButton: false,
    onHide: killAcknowledger
  });
  
  // Kill Global Message!
  function killAcknowledger(){
    setAcknowledger(prevState => ({...prevState, show: false}));
  };
  
  // trigger the global message!
  function _triggerAcknowledger(message){
    setAcknowledger(prevState => ({...prevState, show: true, message:message}));
  }
  
  // Show global message!
  function _showGlobalMessage(){
    return globalMessage(acknowledger);
  }
  
  // Enable / Disable side panel loader!
  function _sidePanelLoader(value){
    setSidepanel(prevState => ({...prevState, enableLoader: value}));
  }
  
  // trigger custom dialog!
  function _openCustomDialog(){
    setSidepanel(prevState => ({...prevState, eventTrigerred: true, inlineAction: false}))
  };
  
  // Open info dialog!
  async function _openInfoDialog(){
    setSidepanel(prevState => ({...prevState, infoEventTriggered: true}))
    const result = await getNetProfitPreview(splitedIds[0]);
    if(result.data.success){
      setNetProfit(prevState => ({...prevState, isLoading: false, 
        paymentTrackerSum: result.data.data.paymentTrackerSum, voucherPaymentSum: result.data.data.vouchersPayment, 
      voucherReceiptSum: result.data.data.vouchersReceipt, paymentTrackerTaxableAmount: result.data.data.paymentTrackerTotalTaxable,
      netProfit: result.data.data.netProfit, netProfitWithoutLivixius: result.data.data.netProfitForVouchers}))
    }
  }
  
  // Close custom dialog!
  function _closeCustomDialog(){
    setSidepanel(prevState => ({...prevState, eventTrigerred: false, inlineAction: false}))
  };
  
  // Close info dialog!
  function _closeInfoDialog(){
    setSidepanel(prevState => ({...prevState, infoEventTriggered: false}))
  }
  
  // Close add voucher model dialog!
  function _closeVoucherModelDialog(){
    setSidepanel(prevState => ({...prevState, inlineAction: false, eventTrigerred: false }));
  }
  
  // Open custom dialog for header control event!
  function _showCustomDialog(onCloseAction, onCreateAction, val, setVal){
    // Form modal data and invoice details data!
    const data = {
      show: true,
      onHide: onCloseAction,
      header: "Add new voucher",
      centered: false,
      modalSize: "medium",
      footerEnabled: true,
      footerButtons: [
        {
          btnId: "Create",
          variant: "success",
          onClick: onCreateAction
        }
      ]
    }
    
    return(
      <CustomModal modalData = {data} showBodyItemView = {() => customModalChildView(val, setVal)}  />
    )
  };
  
  // Open custom info dialog for header info event!
  function _showInfoDialog(onCloseAction){
    // Form modal data!
    const data = {
      show: true,
      onHide: onCloseAction,
      header: "Net profit preview",
      centered: false,
      modalSize: 'medium',
      footerEnabled: false
    }
    
    return (
      <CustomModal modalData = {data} showBodyItemView = {() => customModalChildInfoView()} />
    )
  }
  
  // Show custom modal child view!
  function customModalChildView(val, setVal){
    return(
      <div className = "text-center">
        <MetadataFields data = {val} updateData = {setVal}  />
      </div>
    )
  };
  
  // Show custom modal child info view!
  function customModalChildInfoView(){
    var opts = {
      message: "No vouchers has been added...",
      color: "black",
      textCenter: true
    }
    if(netProfit.isLoading){
      return activityLoader(opts)
    } else {
      return <NetProfitView data = {netProfit} />
    }
  }
  
  // On voucher create action!
  async function onVoucherCreate(){
    const isValid = await validateFieldData(inputField, setInputField);
    if(isValid.length === 0){
      _sidePanelLoader(true); // Enable side panel loader!
      const fieldData = getFieldData(inputField); // Convert the data into server based format!
      _saveVoucherCreation(splitedIds[0], fieldData);
    }
  }
  
  // On voucher model create action!
  async function onVoucherModelAction(){
    var mode = sidepanel.customModalButtonId; // Considering the button modal ID as the mode (Edit || Delete);
    const isValid = await validateFieldData(voucherModel, setVoucherModel);
    if(isValid.length === 0){
      const fieldData = getFieldData(voucherModel);
      _closeVoucherModelDialog();
      _triggerTableLoader(true);
      mode === "Create" && _saveVoucherModelCreation(splitedIds[0], fieldData);
      mode === "Edit" && _onEditVoucherModel(splitedIds[0], fieldData);
    }
  }
  
  // Save voucher creation list!
  async function _saveVoucherCreation(lodgeId, data){
    const result = await addVouchersList(lodgeId, data);
    if(result.data.success){
      _sidePanelLoader(false);
      _clearFieldData(inputField, setInputField);
      _closeCustomDialog();
      vouchersList();
    } else {
      _sidePanelLoader(false);
    }
  }
  
  // Save voucher model creation list!
  async function _saveVoucherModelCreation(lodgeId, data){
    data['voucherId'] = sidepanel.voucherId;
    data.dateTime = convertServerFormat(formatCustomIntoDateFormat(data.dateTime)); // Convert the date into dd/mm/yyy format!
    const result = await addVoucherModelList(lodgeId, data);
    if(result.data.success){
      _triggerTableLoader(false);
      _clearFieldData(voucherModel, setVoucherModel);
      panelItemOnClick(sidepanel.voucherId);
    } else {
      _triggerTableLoader(false);
    }
  }
  
  // On edit voucher model data!
  async function _onEditVoucherModel(lodgeId, data){
    data['voucherId'] = sidepanel.voucherId;
    data.dateTime = convertServerFormat(formatCustomIntoDateFormat(data.dateTime)); // Convert the date into dd/mm/yyy format!
    const result = await editVoucherModelList(lodgeId, data);
    if(result.data.success){
      _triggerTableLoader(false);
      destroyCommandHelper();
      _clearFieldData(voucherModel, setVoucherModel);
      panelItemOnClick(result.data.voucherId);
    } else {
      _triggerTableLoader(false);
    }
  }
  
  // Panel child view setup!
  function panelChildView(){
    var opts = {
      message: "No vouchers has been added...",
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
  
  // Nested child side panel!
  function nestedChildSidePanel(){
    return(
      linkWithVouchers.parentData.map((options) => {
        return(
          <CollectionView data = {options.title} 
          showCollectionChildView = {() => getPanelCollectionView(options.loadData)} />
        )
      })
    )
  };
  
  // Choose the panel collection view!
  function getPanelCollectionView(loadData){
    return loadData === 'vouchers' ? renderVouchersList(true) : renderRoomLists(true)
  }

  // Panel child item view!
  function childItemView(){
    if(linkWithVouchers.isLinkedWithVouchers()){
      return nestedChildSidePanel()
    } else {
      return renderVouchersList()
    }
  };
  
  // Render room list panel view!
  function renderRoomLists(showIndentationArrow){
    return(
      roomList.rooms.map((options, index) => {
        return(
          <PanelItemView data = {options.roomno} _id = {options._id} showIndentationArrow = {showIndentationArrow}
          onClick = {(id) => panelItemOnClick(id, 'paymentTracker')}/>
        )
      })
    )
  }
  
  // Vouchers list!
  function renderVouchersList(showIndentationArrow){
    var inlineHeader = "Add new voucher model";
    var cutomModalButtonId = "Create"
    return(
      sidepanel.data.map((options, key) => {
        return(
          <PanelItemView data = {options.voucherName} _id = {options._id} showIndentationArrow = {showIndentationArrow}
          onClick = {(id) => panelItemOnClick(id, 'vouchers')} showInlineMenu = {true} selectedItem = {sidepanel.selectedId}
          inlineAction = {(voucherId) => _triggerAddVoucherModel(voucherId, inlineHeader, cutomModalButtonId)} />
        )
      })
    )
  }
  
  // Panel Item view inline action functionality!
  function _triggerAddVoucherModel(voucherId, inlineHeader, modalButtonId){
    setSidepanel(prevState => ({...prevState, inlineAction: true, voucherId: voucherId, inlineHeader: inlineHeader, customModalButtonId: modalButtonId}))
  }
  
  // Show add voucher model view!
  function _showAddVoucherModel(onCloseAction, onCreateAction, val, setVal){
    const data = {
      show: true,
      onHide: onCloseAction,
      header: sidepanel.inlineHeader,
      centered: false,
      modalSize: "medium",
      footerEnabled: true,
      footerButtons: [
        {
          btnId: sidepanel.customModalButtonId,
          variant: "success",
          onClick: onCreateAction
        }
      ]
    }
    
    return(
      <CustomModal modalData = {data} showBodyItemView = {() => customModalChildView(val, setVal)}  />
    )
  }
  
  // Side panel item on click!
  async function panelItemOnClick(selectedId, currentOption){
    _triggerTableLoader(true);
    updateSelectedIdList(selectedId);
    var data = {};
    if(currentOption === 'paymentTracker'){
      shouldShowCheckbox(false);
      updateTableCellWidth('350px');
      shouldShowCheatCodeFilter(false);
      data['lodgeId'] = splitedIds[0];
      data['roomId'] = selectedId;
      const result = await getAllPaymentTracker(data);
      updateTableCellData(result); // Dont pass selectedId here, as it is being used for vouchers special case in voucher.content.view
    } else {
      shouldShowCheckbox(true);
      updateTableCellWidth('290px');
      shouldShowCheatCodeFilter(true);
      data['voucherId'] = selectedId;
      const result = await getVoucherModelList(splitedIds[0], data);
      updateTableCellData(result, selectedId)
    }
  };
  
  // Show and unshow cheat code filter!
  function shouldShowCheatCodeFilter(value){
    setSidepanel(prevState => ({...prevState, showCheatCodeFilter: value}))
  }
  
  // Show and Unshow checkbox on table view!
  function shouldShowCheckbox(value){
    setTableView(prevState => ({...prevState, enableCheckbox: value}))
  };
  
  // update cell width on table view!
  function updateTableCellWidth(width){
    setTableView(prevState => ({...prevState, tableCellWidth: width}))
  }
  
  // Get the filtered model based on the filter query!
  function updateTableCellData(result, selectedId){
    if(result.data.success){
      _triggerTableLoader(false);  
      setTableView(prevState => ({...prevState, cellValues: result.data.message, headerValue: result.data.tableHeaders, infoMessage: result.data.infoMessage, selectedVoucherId: selectedId}));
    }
  }
  
  // Calculate height for the metadata table for vouchers content!
  function calculateHeight(commandHelper, cheatCode){
    const height = cheatCode.current.offsetHeight + commandHelper.current.offsetHeight;
    setTableView(prevState => ({...prevState, tableHeight: height}));
  }

  // Set up the voucher content view!
  function voucherContentView(){
    return(
      <VoucherContent data = {sidepanel} commandHelper = {commandHelper} childView = {() => panelChildView()} 
      tableData = {tableView} lodgeId = {splitedIds[0]} 
      getFilteredModel = {(filteredData, voucherId) => updateTableCellData(filteredData, voucherId)}
      updateSidepanelHeight = {(value) => storeModalAssistHeight(value)} getElementRef = {(commandHelper, cheatCode) => calculateHeight(commandHelper, cheatCode)} />
    )
  }
  
  // Get vouchers list!
  async function vouchersList(){
    const result = await getVouchersList(splitedIds[0]);
    if(result.data.success){
      setSidepanel(prevState => ({...prevState, data: result.data.message, enableLoader: false}))
    }
  }
  
  // Get payment tracker data based on the room no1
  async function getPaymentTracker(roomId){
    var data = {lodgeId: splitedIds[0], roomId: roomId};
    const result = await getAllPaymentTracker(data);
    if(result.data.success){
      
    }
  };
  
  // Get all the room items!
  async function getAllRoomList(){
    var result = await getRoomList(splitedIds[0]);
    if(result.data.success){
      setRoomList(prevState => ({...prevState, rooms: result.data.message}))
    } else {
      changeScreen(); // Token must have been expired, navigate back to login screen!
    }
  }
  
  // Call the functions on onRender!
  useEffect(() => {
    vouchersList();
    getAllRoomList();
    setStorage("voucher-selected-count", 0);
    removeItemStorage("selectedItem"); // Remove any unused selection id's
  }, [])
  
  return(
    <div>
      <ModalAssist data = {modalAssist} height = {(value) => storeModalAssistHeight(value)} childView = {() => voucherContentView()} />
      {sidepanel.eventTrigerred && (
        _showCustomDialog(_closeCustomDialog, onVoucherCreate, inputField, setInputField)
      )}
      {sidepanel.infoEventTriggered && (
        _showInfoDialog(_closeInfoDialog)
      )}
      {sidepanel.inlineAction && (
        _showAddVoucherModel(_closeVoucherModelDialog, onVoucherModelAction, voucherModel, setVoucherModel)
      )}
      {acknowledger.show && (
        _showGlobalMessage()
      )}
    </div>
  )
}

export default VoucherView;