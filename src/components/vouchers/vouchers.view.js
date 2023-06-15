import React, {useState, useEffect} from 'react';
import ModalAssist from '../modal.assist/modal.assist.view';
import CustomModal from '../CustomModal/custom.modal.view';
import PanelItemView from '../SidePanelView/panel.item/panel.item.view';
import VoucherContent from './vouchers.content.view';
import MetadataFields from '../fields/metadata.fields.view'
import { getVouchersList, addVouchersList, getVoucherModelList } from './vouchers.utils.js';
import { Link, useParams } from "react-router-dom";
import { globalMessage, commonLabel, activityLoader } from '../common.functions/common.functions.view';
import { nodeConvertor, validateFieldData, _clearData } from '../common.functions/node.convertor';

const VoucherView = () => {
  
  //Check the ID and token of the application!
  const { id } = useParams();
  const splitedIds = id.split(/[-]/);
  
  // Modal assist state handler!
  const [modalAssist, setModalAssist] = useState({
    header: "Vouchers Content Assist"
  })
  
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
  
  // get field data from the node convertor!
  function getFieldData(){
    return nodeConvertor(inputField);
  }
  
  // Clear field data!
  function _clearFieldData(){
    const updatedFieldData = _clearData(inputField);
    setInputField(updatedFieldData);
  }
  
  // Enable inline toast message for input field!
  function _enableInlineToast(nodeValue){
    // Create a copy of the inputField array
     const updatedInputField = [...inputField];

     // Find the object where isShow needs to be updated
     const targetObjectIndex = updatedInputField.findIndex(item => item.name === nodeValue);

     // If the object is found, update the isShow property
     if (targetObjectIndex !== -1) {
       updatedInputField[targetObjectIndex].inlineToast.isShow = true;
     }

     // Set the modified copy of the inputField array back into the state
     setInputField(updatedInputField);
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
    data: undefined
  })
  
  // Enable / Disable side panel loader!
  function _sidePanelLoader(value){
    setSidepanel(prevState => ({...prevState, enableLoader: value}));
  }
  
  // trigger custom dialog!
  function _openCustomDialog(){
    setSidepanel(prevState => ({...prevState, eventTrigerred: true}))
  }
  
  // Close custom dialog!
  function _closeCustomDialog(){
    setSidepanel(prevState => ({...prevState, eventTrigerred: false}))
  }
  
  // Open custom dialog for header control event!
  function _showCustomDialog(){
    // Form modal data and invoice details data!
    const data = {
      show: true,
      onHide: _closeCustomDialog,
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
      <CustomModal modalData = {data} showBodyItemView = {() => customModalChildView()}  />
    )
  }
  
  // Show custom modal child view!
  function customModalChildView(){
    return(
      <div className = "text-center">
        <MetadataFields data = {inputField} updateData = {setInputField}  />
      </div>
    )
  }
  
  // On create action!
  function onCreateAction(){
    const isValid = validateFieldData(inputField);
    if(!isValid.isValid){
      _enableInlineToast(isValid.statusName);
    } else {
      _sidePanelLoader(true); // Enable side panel loader!
      const fieldData = getFieldData(); // Convert the data into server based format!
      _saveCreation(splitedIds[0], fieldData);
    }
  }
  
  // Save creation1
  async function _saveCreation(lodgeId, data){
    const result = await addVouchersList(lodgeId, data);
    if(result.data.success){
      _sidePanelLoader(false);
      _clearFieldData();
      _closeCustomDialog();
      vouchersList();
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
          <PanelItemView data = {options.voucherName} _id = {options._id} onClick = {(id) => panelItemOnClick(id)} />
        )
      })
    )
  }
  
  // Side panel item on click!
  async function panelItemOnClick(voucherId){
    var data = {};
    data['voucherId'] = voucherId;
    const result = await getVoucherModelList(splitedIds[0], data);
    console.log(result)
  }
  
  // Set up the voucher content view!
  function voucherContentView(){
    return(
      <VoucherContent data = {sidepanel} childView = {() => panelChildView()} />
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
        _showCustomDialog()
      )}
    </div>
  )
}

export default VoucherView;