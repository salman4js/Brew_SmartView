import React, { useState, useEffect } from 'react';
import brewDate from 'brew-date';
import Variables from './Variables';
import {useDispatch} from 'react-redux';
import { nodeConvertor, updateMetadataFields } from './common.functions/node.convertor';
import { activityLoader } from './common.functions/common.functions.view';
import {useGlobalMessage} from './global.state/global.state.manager';
import {createGlobalMessage, killGlobalMessage} from '../global.state/actions/index';
import ProgressPanel from './progresspanel/progresspanel.view/progresspanel.view';
import CustomModal from './CustomModal/custom.modal.view';
import StepperWizard from './stepper.wizard/stepper.wizard.view';
import MetadataFields from './fields/metadata.fields.view'
import axios from 'axios';
import LogoTop from '../Assets/logo512.png';
import { Link, useParams, useNavigate } from "react-router-dom";
import { getStorage } from '../Controller/Storage/Storage';
import CollectionInstance from '../global.collection/widgettile.collection/widgettile.collection';
import ChatPerformer from './chat.performer/chat.performer.view';
import InputAnalyser from './chat.performer/chat.input.analyzer';

const Navbar = (props) => {
  
    //Check the ID and token of the application!
    const { id } = useParams();
    const splitedIds = id.split(/[-]/);
    
    let navigate = useNavigate();
    
    // Get dashboard version from the storage!
    var dashboardVersion =  CollectionInstance.getModel('widgetTileCollections', 'dashboardVersion');
    
    // Custom styles for checkbox field!
    const customCheckboxStyle = {
      color: 'black',
      border: '1px solid grey',
      backgroundColor: '#EDEADE',
      padding: '5px 5px 5px 5px',
      borderRadius: '5px',
      marginBottom: '20px'
    };
    
    // Custom modal state handler!
    const [customModalState, setCustomModalState] = useState({
      show: false,
      onHide: _toggleUserPreferenceModal,
      header: 'Livixius Customization Settings',
      centered: true,
      enableLoader: false,
      restrictBody: false,
      modalSize: "medium",
      footerEnabled: true,
      footerButtons: [{
        btnId: 'Apply and Save',
        variant: 'success',
        onClick: _updatePreferences
      },{
        btnId: 'Cancel',
        variant: 'dark',
        onClick: _toggleUserPreferenceModal
      }]
    });
    
    // Stepper Wizard state handler!
    const [stepperWizard, setStepperWizard] = useState({
      show: false,
      header: 'Ask Livixius',
      messages: [],
      passingProps: 'messages',
      enableFooter: true,
      footerView: _renderStepperWizardFooter,
      onHide: _toggleStepperWizard
    });
    
    // Stepper wizard input field state handler!
    const [stepperWizardInput, setStepperWizardInput] = useState([{
      value: undefined,
      width: '460px',
      placeholder: "Enter Any Room No",
      name: 'askQa',
      eventKeyRequired: true,
      eventKey: undefined,
      attribute: 'textField',
      isRequired: true,
      inlineToast: {
        isShow: false,
        inlineMessage: 'Please provide a valid input.'
      },
      callBackAfterUpdate: _performActionForText
    }]);
    
    // Customizable checkbox field state handler!
    const [checkboxField, setCheckboxField] = useState([
      {
        select: null,
        value: undefined,
        name: 'dashboardVersion',
        attribute: 'checkBoxField',
        updateValue: true,
        label: 'Enable Dashboard Version 2.o',
        isLabelFirst: true,
        customStyle: customCheckboxStyle
      },
      {
        select: null,
        value: undefined,
        name: 'upcomingCheckout',
        attribute: 'checkBoxField',
        updateValue: true,
        label: 'Enable Upcoming Checkout',
        isLabelFirst: true,
        customStyle: customCheckboxStyle
      },
      {
        select: null,
        value: undefined,
        name: 'upcomingPrebook',
        attribute: 'checkBoxField',
        updateValue: true,
        label: 'Enable Upcoming Prebook',
        isLabelFirst: true,
        customStyle: customCheckboxStyle
      },
      {
        select: null,
        value: undefined,
        name: 'favorites',
        attribute: 'checkBoxField',
        updateValue: true,
        label: 'Enable Favorites Guest',
        isLabelFirst: true,
        customStyle: customCheckboxStyle
      },
        {
            select: null,
            value: undefined,
            name: 'history',
            attribute: 'checkBoxField',
            updateValue: true,
            label: 'Enable history in dashboard',
            isLabelFirst: true,
            customStyle: customCheckboxStyle
        },
      {
        value: 0,
        name: 'datesBetweenCount',
        attribute: 'stepperButtonField',
        customStyle: customCheckboxStyle,
        label: 'Select dates between for widget tile data'
      }
    ]);
    
    // Update Stepper wizard chat details!
    function _updateStepperWizardChats(content, initiator, detailsMsg, roomModelId){
      const newMessage = {
        content: content,
        sender: initiator,
        detailsMsg: detailsMsg,
        roomModel: roomModelId
      };
      CollectionInstance.setCollections('chat-collections', newMessage);
      setStepperWizard(prevState => ({...prevState, messages: [...prevState.messages, newMessage]}));
    };

    // Perform action for user text input!
    function _performActionForText(){
      var requiredFieldValues = ['eventKey'];
      var textInput = nodeConvertor(stepperWizardInput, requiredFieldValues);
      if(textInput.eventKey === 'Enter'){
        _updateStepperWizardChats(textInput.askQa, 'user');
        var chatPerfomer = new InputAnalyser(textInput.askQa);
        var responseData = chatPerfomer.analyzeInput();
        responseData.response && _updateStepperWizardChats(responseData.response, 'chat-bot', responseData.detailsMessage, responseData.roomModelId);
        updateMetadataFields('askQa', {value: undefined}, stepperWizardInput, setStepperWizardInput); // When enter key is pressed, clear out the stepper wizard input value.
      };
    };
    
    // Global Message handler!
    var globalMessage = useGlobalMessage();
    var dispatch = useDispatch();
    
    // Check if logged in as manager or not!
    function isLoggedInAsManager(){
      return !(JSON.parse(getStorage("loggedInAsRecep")))
    }
    
    // Check if refund tracker is enabled or not!
    function isRefundTrackerEnabled(){
      return JSON.parse(getStorage("isRefundTrackerEnabled"));
    }
    
    // Check if livixius has been linked with vouchers!
    function isLinkedWithVouchers(){
      return JSON.parse(getStorage('is-linked-with-vouchers'));
    }

    // config options handler!
    const [options, setOptions] = useState([]);

    // Config Insights check
    var isInsights = JSON.parse(getStorage("isInsights"));
    
    // Permission levels!
    var loggedInAsRecep = JSON.parse(getStorage("loggedInAsRecep"));
    
    // Render progress panel icon1
    function renderProgressPanelIcon(){
      return(
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="blue" class="bi bi-chat-left-text-fill" viewBox="0 0 16 16">
          <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793V2zm3.5 1a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z"/>
        </svg>
      )
    }
    
    // Check global state for universal message, If message found return the message, If not fetch from the server!
    function checkGlobalStateForMessage(){
      const state = {
        success: globalMessage ? false : true,
        message: {show: true, message: globalMessage.value},
        status: globalMessage.status
      }
      
      return state;
    }
    
    // Trigger the global message!
    function _triggerGlobalMessage(value){
      dispatch(createGlobalMessage(value));
    }
    
    // Never trigger the universal message untill the next session!
    function _neverTriggerUniversalMessage(value){
      dispatch(killGlobalMessage(value));
    }
    
    // Should render universal message!
    function shouldRenderUniversalMessage(){
      return globalMessage.status === 'SHOW' ? true : false
    };
    
    // Fetch preference and update global collection instance!
    async function fetchPreferences(){
      // Get the options ready first!
      var datesBetweenCount = CollectionInstance.getModel('widgetTileCollections', 'datesBetweenCount');
      var options = {
        datesBetween: brewDate.getBetween(brewDate.getFullDate('yyyy/mm/dd'), brewDate.addDates(brewDate.getFullDate('yyyy/mm/dd'), datesBetweenCount))
      };
      // Check if the widget collection data already exists in collection instance!
      var widgetTileCollection = CollectionInstance.getCollections('widgetTileCollections');
      if(!widgetTileCollection){
        const result = await axios.post(`${Variables.hostId}/${splitedIds[0]}/getwidgettilecol`, options);
        CollectionInstance.setCollections('widgetTileCollections', result.data.data);
      };
      setCheckboxValueWithPref();
    };
    
    // Set and update the checkbox state with preferences!
    function setCheckboxValueWithPref(){
      var widgetTileCollection = CollectionInstance.getCollections('widgetTileCollections');
      var collection = Object.keys(widgetTileCollection.data);
      for (var [index, model] of collection.entries()){
        if(typeof widgetTileCollection.data[model] === 'object'){
          updateMetadataFields(model, {value: true}, checkboxField, setCheckboxField)
        } else {
          updateMetadataFields(model, {value: widgetTileCollection.data[model]}, checkboxField, setCheckboxField);
        }
      };
    };
    
    // Fetch and show universal message!
    async function fetchUniversalMessage(){
      var fetch = checkGlobalStateForMessage();
      if(fetch.status === "FETCH"){
        const result = await axios.get(`${Variables.hostId}/${splitedIds[0]}/getuniversalmessage`);
        if(result.data.state){
          _triggerGlobalMessage(result.data.message);
        } else { // Which means universal message has been died!
          _neverTriggerUniversalMessage(result.data.message);
        }
      } else if(fetch.status === "SHOW") {
        _triggerGlobalMessage(fetch.message)
      }
    };
    
    // Kill the universal message and never show it again untill the admin triggers!
    async function killGlobalMessageInServer(){
      axios.post(`${Variables.hostId}/${splitedIds[0]}/killuniversalmessage`)
        .then(result => {
          _neverTriggerUniversalMessage(result.data.message)
        }).catch(err => {
          // Problem while killing the universal message!
        })
    };
    
    // Custom modal body item view!
    function customModalBodyItem(){
      if(customModalState.enableLoader){
        // Options!
        var opts = {
          color: "black",
          marginTop: '25px',
          textCenter: true
        }
        
        return activityLoader(opts)
      } else {
        return <MetadataFields data = {checkboxField} updateData = {setCheckboxField} />
      }
    };
    
    // Render custom modal!
    function _renderCustomModal(){
      return <CustomModal modalData = {customModalState} showBodyItemView = {() => customModalBodyItem()} />
    };
    
    // Render stepper wizard footer!
    function _renderStepperWizardFooter(){
      return <MetadataFields data = {stepperWizardInput} updateData = {setStepperWizardInput} />
    };
    
    // Trigger go to location, this only supports in dashboard version 2.o.
    function _triggerGoToLocation(model){
      var options = {model: model}; // If need to pass any more params, use this object.
      props.goToLocation && props.goToLocation(options);
    };
    
    // Render body view for stepper wizard!
    function _renderBodyView(data){
      return <ChatPerformer data = {data} goToLocation = {(model) => _triggerGoToLocation(model)} />
    };
    
    // Render stepper wizard!
    function _renderStepperWizard(){
      return <StepperWizard data = {stepperWizard} bodyView = {(data) => _renderBodyView(data)} />
    };
    
    // Trigger user preference modal!
    function _toggleUserPreferenceModal(value){
      setCustomModalState(prevState => ({...prevState, show: value}));
    };
    
    // Set default greetings to the chat.performer!
    function _setDefaultGreetings(){
      // Check if default greetings has already been added!
      var chatCollections = CollectionInstance.getCollections('chat-collections');
      if(!chatCollections){
        var defaultGreetings = [{content: 'Hey there, Give me any room no to get details', sender: 'chat-bot'}];
        CollectionInstance.setCollections('chat-collections', defaultGreetings);
      };
    };
    
    // Trigger stepper wizard!
    function _toggleStepperWizard(value){
      _setDefaultGreetings();
      setStepperWizard(prevState => ({...prevState, show: value}));
    };
    
    // Custom modal loader!
    function _enableCustomModalLoader(value){
      setCustomModalState(prevState => ({...prevState, enableLoader: value}));
    };
    
    // Update preferences!
    async function _updatePreferences(){
      _enableCustomModalLoader(true);
      const fieldValue = nodeConvertor(checkboxField);
      var datesBetweenPref = fieldValue.datesBetweenCount || 3; // 3 being the default value of the datesBetween pref.
      fieldValue.datesBetween = brewDate.getBetween(brewDate.getFullDate('yyyy/mm/dd'), brewDate.addDates(brewDate.getFullDate('yyyy/mm/dd'), datesBetweenPref));
      const result = await axios.post(`${Variables.hostId}/${splitedIds[0]}/updatepref`, fieldValue); 
      if(result.data.success){
        CollectionInstance.removeCollections('widgetTileCollections'); // WHen the preference updated, Remove the existing collection!
        CollectionInstance.setCollections('widgetTileCollections', result.data.data); // And then update with the new preference collections!
        _enableCustomModalLoader(false);
        _toggleUserPreferenceModal(false); // After updating the state with new value, close the update preference model!
      };
      var dashboardVersion = CollectionInstance.getModel('widgetTileCollections', 'dashboardVersion');
      var chooseRoute = dashboardVersion ? 'dashboardcontainer' : 'dashboard';
      navigate(`/${splitedIds[0]}-${splitedIds[1]}/${chooseRoute}`, { replace: true });
      props.refreshState && props.refreshState();
    };

    useEffect(() => {
        setOptions(JSON.parse(getStorage("config-value")));
        fetchUniversalMessage();
        fetchPreferences();
    }, []);

    return (
        <nav className="navbar sticky-top navbar-expand-lg navbar-dark navbar-bg">
            <div className="container metadata-navbar-container">
                <a className="navbar-brand metadata-navbar-leftside" href="#">
                    <div className='row'>
                        <div className="col">
                            <img src={LogoTop} width="30" height="30" className="d-inline-block align-top" alt="" />
                        </div>
                        <div className="col stock">
                            {props.name}
                        </div>
                    </div>
                </a>
                {shouldRenderUniversalMessage() && (
                  <ProgressPanel data = {globalMessage.value} toolTip = {"Mark as read"} onClose = {() => killGlobalMessageInServer()} renderIcon = {() => renderProgressPanelIcon()} />
                )}
                <div className = "metadata-navbar-rightside">
                  <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                      <span className="navbar-toggler-icon"></span>
                  </button>
                  <div className="collapse navbar-collapse" id="navbarSupportedContent">
                      <ul className="navbar-nav ml-auto"  >
                          <li className="nav-item active">
                              <Link className="nav-link" to={dashboardVersion ? `/${props.id}/dashboardcontainer` : `/${props.id}/dashboard`} style={{ color: "white" }} > Home </Link>
                          </li>
                          <li class="nav-item dropdown">
                              <Link class="nav-link dropdown-toggle" to={`/${props.id}/rooms`} id="navbarDropdownMenuLink" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                  Rooms
                              </Link>
                              <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                  {!dashboardVersion && (
                                    <>
                                      <Link className="nav-link dropdown-item" to={`/${props.id}/landingpage`} style={{ color: "black" }}> Check-In Rooms </Link>
                                      <Link className='nav-link dropdown-item' to={`/${props.id}/rooms`} style={{ color: "black" }}> Available Rooms</Link>
                                    </>
                                  )}
                                  {
                                      options.map((item, key) => {
                                          if (item.config === 'PreBook') {
                                              return (
                                                <li>
                                                  <a class="dropdown-item" href="#"> Prebook rooms &raquo; </a>
                                                  <ul class="dropdown-menu dropdown-submenu dropdown-submenu-left">
                                                      <Link className='nav-link dropdown-item' to={`/${props.id}/prebookcheckin`} style={{ color: "black" }}> Pre Book Rooms </Link>
                                                      <Link className='nav-link dropdown-item' to={`/${props.id}/prebookrooms`} style={{ color: "black" }}> All Prebooked Rooms</Link>
                                                  </ul>
                                                </li>
                                              )
                                          }
                                      })
                                  }
                                  {!loggedInAsRecep && <Link className='nav-link dropdown-item' to={`/${props.id}/addrooms`} style={{ color: "black" }}> Add Rooms </Link>}
                                  {!loggedInAsRecep && <Link className='nav-link dropdown-item' to={`/${props.id}/updaterooms`} style={{ color: "black" }}> Update Rooms </Link>}
                              </div>
                          </li>
                          <div className = "nav-link dropdown brew-cursor" onClick = {() => _toggleStepperWizard(true)}>
                            Ask Livixius
                          </div>
                          {
                              options.map((item, key) => {
                                  if (item.config === 'Dish') {
                                      return (
                                          <li class="nav-item dropdown">
                                              <Link class="nav-link dropdown-toggle" to={`/${props.id}/rooms`} id="navbarDropdownMenuLink" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                  Dishes
                                              </Link>
                                              <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                                  <Link className='nav-link dropdown-item' to={`/${props.id}/dishes`} style={{ color: "black" }}> All Dishes </Link>
                                                  <Link className='nav-link dropdown-item' to={`/${props.id}/adddishes`} style={{ color: "black" }}> Add Dishes </Link>
                                                  <Link className='nav-link dropdown-item' to={`/${props.id}/updatedishes`} style={{ color: "black" }}> Update Dishes </Link>
                                              </div>
                                          </li>
                                      )
                                  }
                              })
                          }
                          {
                              options.some(option => option.config === 'Dish') || options.some(option => option.config === 'Transport')
                                  ?
                                  <li className='nav-item active'>
                                      <Link className="nav-link" to={`/${props.id}/notifications`} style={{ color: "white" }} > Notifications </Link>
                                  </li>
                                  :
                                  null
                          }
                          <li class="nav-item dropdown">
                              <Link class="nav-link dropdown-toggle" to={`/login`} id="navbarDropdownMenuLink" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                  {/* <img src={settings} width="30" height="30" alt="" /> */}
                                  Settings
                              </Link>
                              <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                  {/* <Link className='nav-link dropdown-item' to={`/${props.id}/configure`} style={{ color: "black" }}> Configure Bill </Link> */}
                                  <li>
                                      {!loggedInAsRecep && <a class="dropdown-item" href="#"> Configure Settings &raquo; </a>}
                                      <ul class="dropdown-menu dropdown-submenu dropdown-submenu-left">
                                          <Link className='nav-link dropdown-item' to={`/${props.id}/configure`} style={{ color: "black" }}> Add Room Type </Link>
                                          <Link className='nav-link dropdown-item' to={`/${props.id}/editconfig`} style={{ color: "black" }}> Edit Room Type Data</Link>
                                          {isLoggedInAsManager() && (
                                            <Link className='nav-link dropdown-item' to={`/${props.id}/managerecep`} style={{ color: "black" }}> Add Multiple Account </Link>
                                          )}
                                          {
                                              options.map((item, key) => {
                                                  if (item.config === 'Dish') {
                                                      return (
                                                          <>
                                                              <Link className='nav-link dropdown-item' to={`/${props.id}/editdish`} style={{ color: "black" }}> Add Dish Type </Link>
                                                              <Link className='nav-link dropdown-item' to={`/${props.id}/generator`} style={{ color: "black" }}> Generate QR code  </Link>
                                                          </>
                                                      )
                                                  }
                                              })
                                          }
                                          {
                                              options.map((item, key) => {
                                                  if (item.config === 'Transport') {
                                                      return (
                                                          <>
                                                              <Link className='nav-link dropdown-item' to={`/${props.id}/addmode`} style={{ color: "black" }}> Add Transport Mode </Link>
                                                              <Link className='nav-link dropdown-item' to={`/${props.id}/addData`} style={{ color: "black" }}>   Configure Transport </Link>
                                                          </>
                                                      )
                                                  }
                                              })
                                          }
                                          {isInsights && <Link className="nav-link dropdown-item" to={`/${props.id}/chart-dashboard`} style={{ color: "black" }}>Insights</Link>}
                                          <Link className='nav-link dropdown-item' to={`/${props.id}/contentnative`} style={{ color: "black" }}> Generate Reports </Link>
                                          <div className = 'nav-link dropdown-item' style = {{color: 'black'}} onClick = {() => _toggleUserPreferenceModal(true)}>
                                            User Preferences
                                          </div>
                                      </ul>
                                  </li>
                                  <Link className='nav-link dropdown-item' to={`/${props.id}/editroom`} style={{ color: "black" }}> Edit Customer Details </Link>
                                  {isLinkedWithVouchers() && (
                                    <Link className='nav-link dropdown-item' to={`/${props.id}/vouchers`} style={{ color: "black" }}> Vouchers Tracker </Link>
                                  )}
                                  <Link className='nav-link dropdown-item' to={`/${props.id}/paymenttracker`} style={{ color: "black" }}> Payment Tracker </Link>
                                  {isRefundTrackerEnabled() && (
                                    <Link className='nav-link dropdown-item' to={`/${props.id}/refundtracker`} style={{ color: "black" }}> Refund Tracker </Link>
                                  )}
                                  {!dashboardVersion && !loggedInAsRecep && <Link className='nav-link dropdown-item' to={`/${props.id}/userdb`} style={{ color: "black" }}>   Booking History </Link>}
                                  <Link className='nav-link dropdown-item' to={`/login`} style={{ color: "black" }}>   LogOut </Link>
                              </div>
                          </li>
                      </ul>
                  </div>
                </div>
            </div>
            {customModalState.show && (
              _renderCustomModal()
            )}
            {stepperWizard.show && (
              _renderStepperWizard()
            )}
        </nav>
    )
}

export default Navbar
