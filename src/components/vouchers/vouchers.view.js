import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch} from 'react-redux';
import {useCheckboxSelection} from '../global.state/global.state.manager'
import {addValue, removeValue, removeAllValue} from '../../global.state/actions/index';
import { _renderNavbar } from '../common.functions/common.functions.view';
import ModalAssist from '../modal.assist/modal.assist.view';
import CustomModal from '../CustomModal/custom.modal.view';
import PanelItemView from '../SidePanelView/panel.item/panel.item.view';
import CollectionView from '../SidePanelView/collection.view/collection.view'
import VoucherContent from './vouchers.content.view';
import NetProfitView from './net.profit.view';
import InvoiceView from '../Invoice/invoice.view';
import MetadataFields from '../fields/metadata.fields.view';
import { getVouchersList, getNetProfitPreview, addVouchersList, getVoucherModelList, addVoucherModelList, editVoucherModelList, deleteVoucherModelList, getPrevVoucherModel } from './vouchers.utils.js';
import { getAllPaymentTracker, getRoomList } from '../paymentTracker/payment.tracker.utils/payment.tracker.utils';
import { useParams } from "react-router-dom";
import {setStorage, getStorage, removeItemStorage} from '../../Controller/Storage/Storage'
import { globalMessage, commonLabel, activityLoader } from '../common.functions/common.functions.view';
import {
  nodeConvertor,
  validateFieldData,
  _clearData,
  checkboxSelection,
  handleCommands,
} from '../common.functions/node.convertor';
import {formatCustomIntoDateFormat, convertServerFormat } from '../common.functions/common.functions';
import changeScreen from '../Action';


const VoucherView = () => {
  
  //Check the ID and token of the application!
  const { id, state } = useParams(); // This state is being a boolean value to indicate that the embedded mode has been enabled!
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
      overflow: "auto",
      marginTop: isLinkedWithVouchers() ? '60px' : '0px' // This state is being a boolean value to indicate that the embedded mode has been enabled!
    }
  });
  
  // Is livixius linked with vouchers!
  function isLinkedWithVouchers(){
    return JSON.parse(getStorage('is-linked-with-vouchers'));
  }
  
  // Modal assist header child view!
  function _showHeaderChildView(){
    var isLinkedWithLivixius = isLinkedWithVouchers();
    if(!isLinkedWithLivixius){
      return(
        <div className = "brew-cursor" onClick = {() => changeScreen()}>
          LogOut
        </div>
      )
    }
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
      value: undefined,
      defaultValue: 0,
      placeholder: "Receipt",
      label: "Receipt",
      name: 'receipt',
      dependentValue: 'payment',
      updateIsRequiredOnDependentValue: true,
      attribute: 'textField',
      isRequired: true,
      inlineToast: {
        isShow: false,
        inlineMessage: 'Please provide a valid receipt.'
      }
    },
    {
      value: undefined,
      defaultValue: 0,
      placeholder: "Payment",
      label: "Payment",
      name: 'payment',
      dependentValue: 'receipt',
      updateIsRequiredOnDependentValue: true,
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
    controlCenter: controlCenter,
    headerControl: true,
    headerControlEvent: _openCustomDialog,
    headerInfoEvent: _openAndCloseInfoDialog,
    eventTrigerred: false,
    infoEventTriggered: false,
    isPrintTriggered: false,
    previewGenerationTriggered: false,
    onPreviewGenerationClose: _onPreviewGenerationTriggered,
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
    netProfitWithoutLivixius: undefined,
    netProfitStatus: undefined
  });
  
  // Render control center for sidepanel header!
  function controlCenter(){
    return(
      <>
        <span className = "sidepanel-header-control brew-cursor" onClick = {() => _openCustomDialog()}>
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="22" fill="currentColor" class="bi bi-file-plus" viewBox="0 0 16 16">
            <path d="M8.5 6a.5.5 0 0 0-1 0v1.5H6a.5.5 0 0 0 0 1h1.5V10a.5.5 0 0 0 1 0V8.5H10a.5.5 0 0 0 0-1H8.5V6z"/>
            <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"/>
          </svg>
        </span>
        <span className = "sidepanel-header-control brew-cursor" onClick = {() => _openAndCloseInfoDialog(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="22" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
          </svg>
      </span>
      </>
    )
  }
  
  // Table view state handler for inflow
  const [tablePreviewViewForInflow, setTablePreviewViewForInflow] = useState({
    cellValues: undefined,
    headerValue: undefined,
    infoMessage: "There is no payments to track today!",
    tableLoader: true,
    enableCheckbox: false,
    commandHelper: false,
    commandDisabled: undefined,
    tableCellWidth : "290px"
  })
  
  // Table view state handler for outflow
  const [tablePreviewViewForOutflow, setTablePreviewViewForOutflow] = useState({
    cellValues: undefined,
    headerValue: undefined,
    infoMessage: "There is no payments to track today!",
    tableLoader: true,
    enableCheckbox: false,
    commandHelper: false,
    commandDisabled: undefined,
    tableCellWidth : "290px"
  })
  
  // Choose date for net profit preview state handler!
  const [netProfitPreviewDate, setNetProfitPreviewDate] = useState([
    {
      value: new Date(),
      defaultValue: new Date(),
      placeholder: "Generate Report by Date",
      label: "Generate Report by Date",
      name: 'date',
      attribute: 'dateField',
      showTimeSelect: false,
      dateFormat: 'MMMM d, yyyy',
      isChanged: false,
      isRequired: true,
      inlineToast: {
        isShow: false,
        inlineMessage: 'Please provide a valid input.'
      }
    }    
  ])
  
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
  async function _openAndCloseInfoDialog(value){
    setSidepanel(prevState => ({...prevState, infoEventTriggered: value}));
  }
  
  // Close custom dialog!
  function _closeCustomDialog(){
    setSidepanel(prevState => ({...prevState, eventTrigerred: false, inlineAction: false}))
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
  function _showInfoDialog(onCloseAction, onCreateAction, val, setVal){
    // Form modal data!
    const data = {
      show: true,
      onHide: onCloseAction,
      header: "Net profit preview",
      centered: false,
      modalSize: 'medium',
      footerEnabled: true,
      footerButtons: [
        {
          btnId: "Search and Generate Preview",
          variant: "success",
          onClick: onCreateAction
        }
      ]
    }
    
    return (
      <CustomModal modalData = {data} showBodyItemView = {() => customModalChildView(val, setVal)} />
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
  function _renderNetProfitPreview(){
    // Activity loader options!
    var opts = {
      message: "No vouchers has been added...",
      color: "black",
      textCenter: true
    }
    if(netProfit.isLoading){
      return activityLoader(opts)
    } else {
      return <NetProfitView data = {netProfit} tableDataForInflow = {tablePreviewViewForInflow} tableDataForOutFlow = {tablePreviewViewForOutflow} />
    }
  };
  
  // Preview generation modal!
  function _previewGenerationModel(onCloseAction){
    // Preview generation modal data!
    const data = {
      show: true,
      onHide: onCloseAction,
      header: "Net profit preview",
      centered: false,
      modalSize: 'xl',
      footerEnabled: true,
      footerButtons: [
        {
          btnId: "Print Report",
          variant: "secondary",
          onClick: printVouchersReport
        }
      ]
    }
    return <CustomModal modalData = {data} showBodyItemView = {() => _renderNetProfitPreview()}  />
  };
  
  // Print vouchers report!
  function printVouchersReport(value){
    var value = (value === undefined);
    _onPreviewGenerationTriggered(false);
    setSidepanel(prevState => ({...prevState, isPrintTriggered: value}))
  };
  
  // Trigger print for vouchers!
  function _triggerPrint(){ // Invoice view takes care of prints functionality!
    return <InvoiceView node = {{vouchersReport: true}} netProfit = {netProfit}
    tablePreviewViewForInflow = {tablePreviewViewForInflow} tablePreviewViewForOutflow = {tablePreviewViewForOutflow}
    onHide = {() => printVouchersReport(false)}/>
  }
  
  // On voucher create action!
  async function onVoucherCreate(){
    const isValid = await validateFieldData(inputField, setInputField);
    if(isValid.length === 0){
      _sidePanelLoader(true); // Enable side panel loader!
      const fieldData = getFieldData(inputField); // Convert the data into server based format!
      _saveVoucherCreation(splitedIds[0], fieldData);
    }
  };
  
  // On preview generation search based on date!
  async function onPreviewGeneration(){
    const isValid = await validateFieldData(netProfitPreviewDate, setNetProfitPreviewDate);
    if(isValid.length === 0){
      _openAndCloseInfoDialog(false);
      _onPreviewGenerationTriggered(true);
      const fieldData = getFieldData(netProfitPreviewDate);
      fieldData['lodgeId'] = splitedIds[0]
      const result = await getNetProfitPreview(fieldData);
      if(result.data.success){
        // Update netprofit preview data!
        setNetProfit(prevState => ({...prevState, isLoading: false, 
          paymentTrackerSum: result.data.data.inflowDetails.totalAmount, voucherPaymentSum: result.data.data.outflowDetails.totalPayment,
        voucherReceiptSum: result.data.data.outflowDetails.totalReceipt, paymentTrackerTaxableAmount: result.data.data.inflowDetails.totalTaxableAmount,
        netProfit: result.data.data.netProfitStatus, netProfitStatus: result.data.data.netProfitStatus > 0 ? 'PROFIT' : "LOSS"}));
        
        // Update tablePreview data for inflow
        setTablePreviewViewForInflow(prevState => ({...prevState, cellValues: result.data.data.individualVoucherReportForPayment, 
          headerValue: result.data.data.individualVoucherReportTableHeader, tableLoader: false}));
        
        // Update tablePreview data for outflow
        setTablePreviewViewForOutflow(prevState => ({...prevState, cellValues: result.data.data.tableReport,
          headerValue: result.data.data.tableHeader.outflow, tableLoader: false}));
      }
    }
  };
  
  // On preview generation modal close!
  function _onPreviewGenerationTriggered(value){
    setSidepanel(prevState => ({...prevState, previewGenerationTriggered: value}))
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
          <CollectionView data = {options.title} ignoreTreePref = {true}
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
  };
  
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
  
  return (
    <>
      {isLinkedWithVouchers() && (
        _renderNavbar(id, splitedIds)
      )}
      <div>
        {!sidepanel.isPrintTriggered && (
          <ModalAssist
            data={modalAssist}
            height={(value) => storeModalAssistHeight(value)}
            childView={() => voucherContentView()}
          />
        )}
        {sidepanel.eventTrigerred && (
          _showCustomDialog(_closeCustomDialog, onVoucherCreate, inputField, setInputField)
        )}
        {sidepanel.infoEventTriggered && (
          _showInfoDialog(
            _openAndCloseInfoDialog,
            onPreviewGeneration,
            netProfitPreviewDate,
            setNetProfitPreviewDate
          )
        )}
        {sidepanel.previewGenerationTriggered && (
          _previewGenerationModel(_onPreviewGenerationTriggered)
        )}
        {sidepanel.inlineAction && (
          _showAddVoucherModel(
            _closeVoucherModelDialog,
            onVoucherModelAction,
            voucherModel,
            setVoucherModel
          )
        )}
        {acknowledger.show && (
          _showGlobalMessage()
        )}
      </div>
      {sidepanel.isPrintTriggered && (
        _triggerPrint()
      )}
    </>
  );
}

export default VoucherView;