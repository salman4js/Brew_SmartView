import React, {useState, useEffect} from 'react';
import ModalAssist from '../modal.assist/modal.assist.view';
import CustomModal from '../CustomModal/custom.modal.view';
import PanelItemView from '../SidePanelView/panel.item/panel.item.view';
import VoucherContent from './vouchers.content.view';
import { getVouchersList } from './vouchers.utils.js';
import { Link, useParams } from "react-router-dom";
import { globalMessage, commonLabel, activityLoader } from '../common.functions/common.functions.view'

const VoucherView = () => {
  
  //Check the ID and token of the application!
  const { id } = useParams();
  const splitedIds = id.split(/[-]/);
  
  // Modal assist state handler!
  const [modalAssist, setModalAssist] = useState({
    header: "Vouchers Content Assist"
  })
  
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
    data: undefined
  })
  
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
    }
    
    return(
      <CustomModal modalData = {data} showBodyItemView = {() => console.log("custom modal child triggered")}  />
    )
  }
  
  // Panel child view setup!
  function panelChildView(){
    var opts = {
      message: "No vouchers has been added...",
      color: "black",
      marginTop: (sidepanel.height) / 2.2 + "px",
      textCenter: true
    }
    
    if(sidepanel.data === undefined){
      return activityLoader(opts)
    }
    
    if(sidepanel.data.length === 0){
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
          <PanelItemView data = {options.voucherName} />
        )
      })
    )
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
      setSidepanel(prevState => ({...prevState, data: result.data.message}))
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