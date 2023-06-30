import React, {useState, useEffect} from 'react';
import {getAccountDetails} from './manage.recep.utils/manage.recep.utils';
import { Link, useParams } from "react-router-dom";
import Navbar from '../Navbar';
import ModalAssist from '../modal.assist/modal.assist.view';
import ManageRecepAdd from './manage.recep.add.accounts/manage.recep.add.accounts';
import ManagerRecepDetails from './manage.recep.details/manage.recep.details';
import {activityLoader} from '../common.functions/common.functions.view';
import {domRefresh} from '../common.functions/node.convertor';

const ManageRecep = () => {
  
  // Context ID references!
  const { id } = useParams();
  const splitedIds = id.split(/[-]/);
  
  // Table view state handler!
  const [tableView, setTableView] = useState({
    cellValues: undefined,
    headerValue: undefined,
    infoMessage: "Fetching user account details...",
    tableLoader: true,
  })
  
  // Trigger the table loader!
  function _triggerTableLoader(value){
    setTableView(prevState => ({...prevState, tableLoader: value}))
  }
  
  // Modal assist state handler!
  const [modalAssist, setModalAssist] = useState({
    header: "Manage Receptionist Accounts",
    _showHeaderChildView: _showHeaderChildView,
    getWidth: true,
    getHeaderHeight: true,
    headerHeight: undefined,
    width: undefined,
    height: undefined,
    style: {
      fontWeight: "bold",
      marginLeft: "30px",
      marginRight: "30px",
      marginTop: "60px",
      marginBottom: "30px",
      overflow: "hidden"
    }
  })
  
  // Render header child view for modal assist!
  function _showHeaderChildView(){
    return;
  }
  
  // Store modal asssit height in modal assist state handler!
  function storeModalAssistHeight(value){
    setModalAssist(prevState => ({...prevState, height: value}))
  }
  
  // Store modal asssit width in modal assist state handler!
  function storeModalAssistWidth(value){
    setModalAssist(prevState => ({...prevState, width: value}))
  }
  
  // Store modal asssit headerHeight in modal assist state handler!
  function storeModalAssistHeaderHeight(value){
    setModalAssist(prevState => ({...prevState, headerHeight:value}))
  }
  
  // Show add accounts dialog!
  function _showAddAccounts(){
    return(
      <div style = {{marginTop: (modalAssist.height / 4) + "px", padding: "30px"}}>
        <ManageRecepAdd lodgeId = {splitedIds[0]} domRefresh = {() => domRefresh()}/>
      </div>
    )
  }
  
  // Show account details!
  function _showAccountDetails(){
    if(!tableView.tableLoader){
      return(
        <div style = {{marginTop: (modalAssist.height / 9) + "px", padding: "30px", color: "black"}}>
          <ManagerRecepDetails tableView = {tableView} />
        </div>
      )
    } else {
      // Options!
      var opts = {
        color: "black",
        marginTop: (modalAssist.height) / 2.5 + "px",
        textCenter: true
      }
      return activityLoader(opts);
    }
  }
  
  // Get table data!
  async function getTableData(){
    // Form the params!
    const data = {
      lodge: splitedIds[0]
    }
    const result = await getAccountDetails(data);
    if(result.data.success){
      setTableView(prevState => ({...prevState, cellValues: result.data.message, headerValue: result.data.tableHeaders, tableLoader: false}))
    }
  }
  
  // Show modal assist child view!
  function _renderChildView(){
    if(modalAssist.width !== undefined){
      return(
        <div className = "manage-recep-wrapper">
          <div className = "text-center manage-recep-flex-1" style = {{backgroundColor: "grey", borderRight: "1.9px solid black", flex: 1, 
          width: (modalAssist.width) / 2 + "px", height: (modalAssist.height + modalAssist.headerHeight) + "px"}}>
            {_showAddAccounts()}
          </div>
          <div className = "text-center manage-recep-flex-2" style = {{ backgroundColor: "grey", flex: 2, 
          width: (modalAssist.width) / 2 + "px", height: (modalAssist.height + modalAssist.headerHeight) + "px"}}>
            {_showAccountDetails()}
          </div>
        </div>
      )
    } else {
      var opts = {
        color: "black",
        marginTop: "360px",
        textCenter: true
      }
      return activityLoader(opts);
    }
  }
  
  // Everytime the page loads, get the table data!
  useEffect(() => {
    getTableData()
  }, [])
  
  return(
    <div>
      <Navbar id={id} name={splitedIds[1]} />
      <ModalAssist data = {modalAssist} height = {(value) => storeModalAssistHeight(value)}
      childView = {() => _renderChildView()} width = {(value) => storeModalAssistWidth(value)}
      headerHeight = {(value) => storeModalAssistHeaderHeight(value)} />
    </div>
  )
}

export default ManageRecep;