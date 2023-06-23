import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import ModalAssist from '../modal.assist/modal.assist.view';
import CustomModal from '../CustomModal/custom.modal.view';
import PanelItemView from '../SidePanelView/panel.item/panel.item.view';
import VoucherContent from './vouchers.content.view';
import MetadataFields from '../fields/metadata.fields.view';
import { getVouchersList, addVouchersList, getVoucherModelList, addVoucherModelList } from './vouchers.utils.js';
import { Link, useParams } from "react-router-dom";
import { globalMessage, commonLabel, activityLoader } from '../common.functions/common.functions.view';
import { nodeConvertor, validateFieldData, _clearData, _enableInlineToast } from '../common.functions/node.convertor';
import {formatCustomIntoDateFormat, convertFormat, convertServerFormat } from '../common.functions/common.functions';
import changeScreen from '../Action';


const VoucherView = () => {
  
  //Check the ID and token of the application!
  const { id } = useParams();
  const splitedIds = id.split(/[-]/);
  
  // History reference!
  const navigate = useNavigate();
  
  // Modal assist state handler!
  const [modalAssist, setModalAssist] = useState({
    header: "Vouchers Content Assist",
    _showHeaderChildView: _showHeaderChildView,
    style: {
      fontWeight: "bold"
    }
  })
  
  // Modal assist header child view!
  function _showHeaderChildView(){
    return(
      <div className = "brew-cursor" onClick = {() => changeScreen()}>
        LogOut
      </div>
    )
  }
  
  function dummyFunction(){
    return(
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
        <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
      </svg>
    )
  }
  
  // Table view state handler!
  const [tableView, setTableView] = useState({
    cellValues: undefined,
    headerValue: undefined,
    infoMessage: "No vouchers has been selected...",
    tableLoader: false,
    selectedVoucherId: undefined
  })
  
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
      placeholder: "Date",
      label: "Date",
      name: 'dateTime',
      attribute: 'dateField',
      isRequired: true,
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
      value: undefined,
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
  
  // Side panel state handler!
  const [sidepanel, setSidepanel] = useState({
    height: undefined,
    header: "Vouchers List",
    headerControl: true,
    headerControlEvent: _openCustomDialog,
    eventTrigerred: false,
    enableLoader: true,
    data: undefined,
    inlineAction: false,
    voucherId: undefined
  })
  
  // Enable / Disable side panel loader!
  function _sidePanelLoader(value){
    setSidepanel(prevState => ({...prevState, enableLoader: value}));
  }
  
  // trigger custom dialog!
  function _openCustomDialog(){
    setSidepanel(prevState => ({...prevState, eventTrigerred: true, inlineAction: false}))
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
  }
  
  // Show custom modal child view!
  function customModalChildView(val, setVal){
    return(
      <div className = "text-center">
        <MetadataFields data = {val} updateData = {setVal}  />
      </div>
    )
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
  async function onVoucherModelCreate(){
    const isValid = await validateFieldData(voucherModel, setVoucherModel);
    if(isValid.length === 0){
      const fieldData = getFieldData(voucherModel);
      _closeVoucherModelDialog();
      _triggerTableLoader(true);
      _saveVoucherModelCreation(splitedIds[0], fieldData);
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
  
  // Panel child item view!
  function childItemView(){
    return (
      sidepanel.data.map((options, key) => {
        return(
          <PanelItemView data = {options.voucherName} _id = {options._id} 
          onClick = {(id) => panelItemOnClick(id)} showInlineMenu = {true}
          inlineAction = {(voucherId) => _triggerAddVoucherModel(voucherId)} />
        )
      })
    )
  }
  
  // Panel Item view inline action functionality!
  function _triggerAddVoucherModel(voucherId){
    setSidepanel(prevState => ({...prevState, inlineAction: true, voucherId: voucherId}))
  }
  
  // Show add voucher model view!
  function _showAddVoucherModel(onCloseAction, onCreateAction, val, setVal){
    const data = {
      show: true,
      onHide: onCloseAction,
      header: `Add new voucher model`,
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
  }
  
  // Side panel item on click!
  async function panelItemOnClick(voucherId){
    _triggerTableLoader(true);
    var data = {};
    data['voucherId'] = voucherId;
    const result = await getVoucherModelList(splitedIds[0], data);
    updateTableCellData(result, voucherId)
  }
  
  // Get the filtered model based on the filter query!
  function updateTableCellData(result, voucherId){
    if(result.data.success){
      _triggerTableLoader(false);  
      setTableView(prevState => ({...prevState, cellValues: result.data.message, headerValue: result.data.tableHeaders, infoMessage: result.data.infoMessage, selectedVoucherId: voucherId}));
    }
  }

  // Set up the voucher content view!
  function voucherContentView(){
    return(
      <VoucherContent data = {sidepanel} childView = {() => panelChildView()} tableData = {tableView} lodgeId = {splitedIds[0]} getFilteredModel = {(filteredData, voucherId) => updateTableCellData(filteredData, voucherId)} />
    )
  }
  
  // Get vouchers list!
  async function vouchersList(){
    const result = await getVouchersList(splitedIds[0]);
    if(result.data.success){
      setSidepanel(prevState => ({...prevState, data: result.data.message, enableLoader: false}))
    }
  }
  
  // Call the functions on onRender!
  useEffect(() => {
    vouchersList()
  }, [])
  
  return(
    <div>
      <ModalAssist data = {modalAssist} height = {(value) => storeModalAssistHeight(value)} childView = {() => voucherContentView()} />
      {sidepanel.eventTrigerred && (
        _showCustomDialog(_closeCustomDialog, onVoucherCreate, inputField, setInputField)
      )}
      {sidepanel.inlineAction && (
        _showAddVoucherModel(_closeVoucherModelDialog, onVoucherModelCreate, voucherModel, setVoucherModel)
      )}
    </div>
  )
}

export default VoucherView;