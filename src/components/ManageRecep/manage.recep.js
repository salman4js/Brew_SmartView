import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {addValue, removeValue, getValue} from '../../global.state/actions/index';
import MetadataFields from '../fields/metadata.fields.view'
import {getAccountDetails, deleteMultiple, editLogins} from './manage.recep.utils/manage.recep.utils';
import { Link, useParams } from "react-router-dom";
import Navbar from '../Navbar';
import ModalAssist from '../modal.assist/modal.assist.view';
import CustomModal from '../CustomModal/custom.modal.view';
import ManageRecepAdd from './manage.recep.add.accounts/manage.recep.add.accounts';
import ManagerRecepDetails from './manage.recep.details/manage.recep.details';
import {activityLoader} from '../common.functions/common.functions.view';
import {validateFieldData} from '../common.functions/node.convertor';
import {domRefresh, nodeConvertor} from '../common.functions/node.convertor';
import {getStorage, setStorage} from '../../Controller/Storage/Storage'

const ManageRecep = () => {
  
  // Context ID references!
  const { id } = useParams();
  const splitedIds = id.split(/[-]/);
  
  // Global state management - Checkbox selection!
  var checkboxSelector = useSelector(state => state.checkboxSelection);
  setStorage("selectedItem", JSON.stringify(checkboxSelector));
  const dispatch = useDispatch();
  
  // Modal assist state handler!
  const [modalAssist, setModalAssist] = useState({
    header: "Manage Receptionist Accounts",
    _showHeaderChildView: _showHeaderChildView,
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
      marginLeft: "30px",
      marginRight: "30px",
      marginTop: "60px",
      marginBottom: "30px",
      overflow: "hidden"
    }
  })
  
  // Table view state handler!
  const [tableView, setTableView] = useState({
    cellValues: undefined,
    headerValue: undefined,
    infoMessage: "Fetching user account details...",
    tableLoader: true,
    enableCheckbox: true,
    isCheckboxSelected: false,
    commandDisabled: undefined,
    selectedCheckBoxId: [],
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
  
  // Edit modal state handler!
  const [editModal, setEditModal] = useState([
    {
      value: undefined,
      placeholder: "Enter New Username",
      label: "Username",
      name: 'username',
      attribute: 'textField',
      isRequired: true,
      inlineToast: {
        isShow: false,
        inlineMessage: 'Please enter a valid username'
      }
    },
    {
      value: undefined,
      placeholder: "Enter New Password",
      label: "Password",
      name: 'password',
      attribute: 'textField',
      isRequired: true,
      inlineToast: {
        isShow: false,
        inlineMessage: 'Please enter a valid password'
      }
    },
    {
      value: undefined,
      label: "Choose permissions",
      placeholder: "Choose permission level authorization",
      name: 'loginAs',
      attribute: 'listField',
      noneValue: "None",
      options: [
        {
          value: "Manager Level Authorization",
          actualValue: "managerLevel"
        },
        {
          value: "Receptionist Level Authorization",
          actualValue: "receptionistLevel"
        }
      ],
      style: {
        color: "black",
        fontSize: "15px",
        paddingRight: "10px",
        paddingLeft: "10px",
        cursor: "pointer",
      }
    }
  ])
  
  // Delete logins (Multiple and single login)
  async function deleteLogins(){
    const data = {};
    data['loginId'] = JSON.parse(getStorage("selectedItem"));
    data['lodgeid'] = splitedIds[0];
    const result = await deleteMultiple(data);
    if(result.data.success){
      _toggleSuccessModal(result.data.success, result.data.message);
      checkboxSelected(undefined, -1);
    }
  }
  
  // Show success modal!
  function _showSuccessModal(){
    // Custom modal options!
    const data = {
      show: true,
      onHide: _toggleSuccessModal,
      header: modalAssist.customModalHeader,
      centered: false,
      modalSize: "medium"
    }
    
    return <CustomModal modalData = {data} showBodyItemView = {() => _showHeaderChildView()} />
  }
  
  // Show Edit Modal!
  function _showEditModal(){
    // Custom modal options!
    const data = {
      show: true,
      onHide: _toggleEditModal,
      header: "Edit account details",
      centered: false,
      modalSize: "medium",
      footerEnabled: true,
      footerButtons: [
          {
            btnId: "Edit",
            variant: "success",
            onClick: _onSaveEdit
          }
      ]
    }
    
    return <CustomModal modalData = {data} showBodyItemView = {() => _showEditModalChild()} />
  }
  
  // Setup edit modal child view!
  function _showEditModalChild(){
    return(
      <div className = "text-center">
        <MetadataFields data = {editModal} updateData = {setEditModal} />
      </div>
    )
  }
  
  // On save edit mode!
  async function _onSaveEdit(){
    const isValidData = await validateFieldData(editModal, setEditModal);
    if(isValidData.length === 0){
      const fieldData = nodeConvertor(editModal);
      fieldData["loginId"] = JSON.parse(getStorage("selectedItem"));
      const result = await editLogins(fieldData);
      _toggleEditModal(); // Destroy the edit modal
      _toggleSuccessModal(result.data.success, result.data.message); // trigger the success modal
      checkboxSelected(undefined, -1); // Destroy the command helper when the operation is done!
    }
  }
  
  // toggle success modal!
  function _toggleSuccessModal(value, message){
    if(!value){
      getTableData(); // reload the table data when deleteLogins action done performing!
    }
    setModalAssist(prevState => ({...prevState, showCustomModal: value, customModalHeader: message}));
  }
  
  // toggle edit modal!
  function _toggleEditModal(value){
    setModalAssist(prevState => ({...prevState, showEditModal: value}))
  }
  
  // Perform action after the checkbox is being selected!
  function checkboxSelected(value, index){
    // Checkbox selected count reference!
    var selectedCount = getStorage("manage-recep-selected-count");
    
    if(value){
      // Store the selected model id to the global state management!
      dispatch(addValue(index))
      // Perform actions to show the appropriate commands
      const updatedCount = Number(selectedCount) + 1
      setStorage("manage-recep-selected-count", updatedCount);
      setTableView(prevState => ({...prevState, isCheckboxSelected: value}));
      selectedCount = updatedCount
    } else {
      // Remove the selected model id from the global state!
      dispatch(removeValue(index));
      // Perform actions to show the appropriate commands
      const updatedCount = Number(selectedCount) - 1;
      setStorage("manage-recep-selected-count", updatedCount);
      selectedCount = updatedCount
      if(updatedCount === 0){
        setTableView(prevState => ({...prevState, isCheckboxSelected: value}))
      }
    }
    isCommandsValid(selectedCount)
  }
  
  // Check the commands are valid for the user selection!
  function isCommandsValid(selectedCount){
    if(selectedCount > 1){
      setTableView(prevState => ({...prevState, commandDisabled: "Edit"}))
    } else {
      setTableView(prevState => ({...prevState, commandDisabled: undefined}))
    }
  }
  
  // Trigger the table loader!
  function _triggerTableLoader(value){
    setTableView(prevState => ({...prevState, tableLoader: value}))
  }
  
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
        <ManageRecepAdd lodgeId = {splitedIds[0]} domRefresh = {() => getTableData()}/>
      </div>
    )
  }
  
  // Show account details!
  function _showAccountDetails(){
    if(!tableView.tableLoader){
      return(
        <div style = {{marginTop: (modalAssist.height / 9) + "px", padding: "30px", color: "black"}}>
          <ManagerRecepDetails tableView = {tableView} onDelete = {() => deleteLogins()} onEdit = {() => _toggleEditModal(true)} />
        </div>
      )
    } else {
      // Options!
      var opts = {
        color: "white",
        marginTop: (modalAssist.height) / 2.5 + "px",
        textCenter: true
      }
      return activityLoader(opts);
    }
  }
  
  // Get table data!
  async function getTableData(){
    _triggerTableLoader(true);
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
          <div className = "text-center manage-recep-flex-1" style = {{backgroundColor: "#393740", borderRight: "1.9px solid black", flex: 1, 
          width: (modalAssist.width) / 2 + "px", height: (modalAssist.height + modalAssist.headerHeight) + "px"}}>
            {_showAddAccounts()}
          </div>
          <div className = "text-center manage-recep-flex-2" style = {{ backgroundColor: "#393740", flex: 2, 
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
    getTableData();
    setStorage("manage-recep-selected-count", 0); // Maintain the selected count in the local storage!
  }, [])
  
  return(
    <div>
      <Navbar id={id} name={splitedIds[1]} />
      <ModalAssist data = {modalAssist} height = {(value) => storeModalAssistHeight(value)}
      childView = {() => _renderChildView()} width = {(value) => storeModalAssistWidth(value)}
      headerHeight = {(value) => storeModalAssistHeaderHeight(value)} />
      
      {/* Show success modal */}
      {modalAssist.showCustomModal && (
        _showSuccessModal()
      )}
      
      {/* Show edit modal */}
      {modalAssist.showEditModal && (
        _showEditModal()
      )}
    </div>
  )
}

export default ManageRecep;