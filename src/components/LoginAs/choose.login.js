import React, {useState} from 'react';
import { loginAs } from './choose.login.utils';
import CustomModal from '../CustomModal/custom.modal.view';
import MetadataFields from '../fields/metadata.fields.view';
import { Link, useNavigate, useParams } from "react-router-dom";
import ModalAssist from '../modal.assist/modal.assist.view';
import { activityLoader } from '../common.functions/common.functions.view';
import { validateFieldData, nodeConvertor } from '../common.functions/node.convertor';
import CollectionInstance from '../../global.collection/widgettile.collection/widgettile.collection';
import {getStorage, setStorage, defaultStorage} from '../../Controller/Storage/Storage'

const ChooseLogin = () => {
  
  // Navigate reference!
  let navigate = useNavigate();

  // User Id reference!
  const { id } = useParams();
  const splitedIds = id.split(/[-]/);
  
  // Local storage reference!
  var redirectTo = getStorage("redirectTo");
  
  // Custom login dialog state handler!
  const [customLogin, setCustomLogin] = useState([
    {
      value: undefined,
      placeholder: "Enter Your Username",
      label: "Username",
      name: 'username',
      attribute: 'textField',
      isRequired: true,
      inlineToast: {
        isShow: false,
        inlineMessage: 'Enter a valid username'
      }
    },
    {
      value: undefined,
      placeholder: "Enter Your Password",
      label: "Password",
      name: 'password',
      attribute: 'textField',
      isRequired: true,
      type: "password",
      inlineToast: {
        isShow: false,
        inlineMessage: 'Enter a valid password'
      }
    }
  ])
  
  // Modal assist state handler!
  const [modalAssist, setModalAssist] = useState({
    header: "Login As",
    _showHeaderChildView: _showHeaderChildView,
    height: undefined,
    style: {
      fontWeight: "bold",
      marginLeft: "30px",
      marginRight: "30px",
      marginTop: "30px",
      marginBottom: "30px",
      overflow: "hidden"
    }
  })
  
  // Custom login modal dialog!
  const [customModal, setCustomModal] = useState({
    show: undefined,
    onHide: customModelonHide,
    header: undefined,
    bodyFooter: undefined,
    bodyFooterView: _showBodyFooterView,
    bodyFooterErrorText: "Please check your credentials!",
    centered: false,
    modalSize: 'medium',
    footerEnabled: true,
    footerButtons: [
      {
        btnId: "Login",
        disabled: false,
        variant: "success",
        onClick: validateUser
      },
      {
        btnId: "Cancel",
        variant: "secondary",
        onClick: customModelonHide
      }
    ]
  })
  
  // Custom modal on hide!
  function customModelonHide(){
    setCustomModal(prevState => ({...prevState, show: false}))
  }
  
  // Custom modal body header view!
  function _showBodyFooterView(){
    return(
      <div className = "text-center" style = {{color: "red", fontSize: '12px'}}>
        {customModal.bodyFooterErrorText}
      </div>
    )
  }
  
  // Update modal assist height to the modal assist state!
  function setModalAssistHeight(value){
    setModalAssist(prevState => ({...prevState, height: value}))
  }
  
  // Header child view for the modal assist!
  function _showHeaderChildView(){
    return;
  }
  
  // Show login choose dialog!
  function _showChooseDialog(){
    return(
      <ModalAssist data = {modalAssist} childView = {() => _renderChildView()} height = {(value) => setModalAssistHeight(value)} />
    )
  }
  
  // Login fields handler!
  function loginFieldHandler(){
    return(
      <div className = "text-center">
        <MetadataFields data = {customLogin} updateData = {setCustomLogin} />
      </div>
    )
  }
  
  // Show custom login modal!
  function _showCustomLoginModal(){
    return(
      <CustomModal modalData = {customModal} showBodyItemView = {() => loginFieldHandler()}  />
    )
  }
  
  // Validate entered user credentials!
  async function validateUser(){
    const isFieldValid = await validateFieldData(customLogin, setCustomLogin);
    if(isFieldValid.length === 0){
      const fieldData = nodeConvertor(customLogin);
      fieldData["lodge"] = splitedIds[0];
      const result = await loginAs(fieldData);
      const permissionLevel = getStorage("permissionLevel");
      const accessGranted = (permissionLevel === result.data.permissionLevel);
      if(result.data.success && accessGranted){
        const storageData = {
          "loggedInUser": result.data.loggedInUser,
          "loggedInAsRecep": result.data.loggedInAsRecep
        };
        // User preference to determine the navigation route!
        var userPreferenceDashboard = CollectionInstance.getModel('widgetTileCollections', 'dashboardVersion');
        const loginRoute = userPreferenceDashboard ? 'dashboardcontainer' : "dashboard"
        defaultStorage(storageData);
        navigateUser(loginRoute);
      } else {
        _loginAsError(true, result.data.message);
      }
    }
  }
  
  // Show error incase of login error!
  function _loginAsError(value, message){
    setCustomModal(prevState => ({...prevState, bodyFooter: value}));
  }

  // Navigate user to the appropriate product!
  function navigateUser(route){
    if(redirectTo === "livixius"){
      navigate(`/${id}/${route}`, { replace: true })
    } else {
      navigate(`/${id}/vouchers`, { replace: true })
    }
  }
  
  // Handle Multiple Logins!
  function handleLogin(key){
    setStorage("permissionLevel", key); // Storing the accessing level to validate the credentials once verified by the server!
    _triggerCustomLogin(key);
  }
  
  // Get login user label!
  function getUserLabel(key){
    return key !== "managerLevel" ? "Login as receptionist" : "Login as manager"
  }
  
  // trigger custom login for receptionist!
  function _triggerCustomLogin(key){
    var customModalHeader = getUserLabel(key);
    setCustomModal(prevState => ({...prevState, show: true, header: customModalHeader}));
  }
  
  // Show child view component!
  function _renderChildView(){
    if(modalAssist.height !== undefined){
      return(
        <div>
          <div className = "text-center" style = {{backgroundColor: "#000000ba", height: (modalAssist.height / 2) + "px"}} onClick = {() => handleLogin("receptionistLevel")}>
            <div style = {{paddingTop: (modalAssist.height / 5) + "px", cursor: "pointer"}}>
              Login As Receptionist
            </div>
          </div>
          <div className = "text-center" style = {{backgroundColor: "rgb(51 0 255 / 50%)", height: (modalAssist.height / 1.7) + "px"}} onClick = {() => handleLogin("managerLevel")}>
            <div style = {{paddingTop: (modalAssist.height / 5) + "px", cursor: "pointer"}}>
              Login As Manager
            </div>
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
  
  
  return(
    <div>
      {_showChooseDialog()}
      {customModal.show && (
        _showCustomLoginModal()
      )}
    </div>
  )
}

export default ChooseLogin;