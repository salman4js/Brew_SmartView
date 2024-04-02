import React, {useState, useRef} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppHeaderView from "./app.header/app.header.view";
import ModalAssist from "./dialogs/modal.assist/modal.assist.view";
import DashboardWrapper from './dashboard.container.wrapper/dashboard.container.wrapper';
import {getBaseUrl} from "../common.functions/node.convertor";

const DashboardInitializer = (props) => {

  // Get the ID params from the url!
  const { id } = useParams();
  const splitedIds = id.split(/[-]/);
  const navigate = useNavigate();

  // Child component references!
  var dashboardWrapperRef = useRef(null);
  
  // Club the params into a single object!
  var contextObj = {
    id: id,
    accIdAndName: splitedIds,
    navigateInto: (options) => _navigateInto(options),
    rejectPerspective: () => _navigateInto({path: '/rejected'})
  };

  // Navigation context method!
  function _navigateInto(options){
    navigate(`${options.path}`, {replace: true});
  };
  
  // Model assist model data!
  var [modalAssistData, setModalAssistData] = useState({
    header: `${contextObj.accIdAndName[1]} -  Dashboard`,
    _showHeaderChildView: null,
    height: undefined,
    refreshState: false,
    style: {
      fontWeight: "bold",
      marginTop: '60px'
    }
  });
  
  // Get modal assist height and store it in the state to let the sidepanel
  // Know about its rendering height!
  function storeModalAssistHeight(value){
    setModalAssistData(prevState => ({...prevState, height: value}));
  };
  
  // Refresh the state only if navbar triggered refresh!
  function refreshState(){
    // Get the current state of the refreshState from the modalAssistData!
    var refreshState = modalAssistData.refreshState;
    setModalAssistData(prevState => ({...prevState, refreshState: !refreshState}));
  };
  
  // Go to location of that particular room model!
  function goToLocation(options){
    dashboardWrapperRef.current.updateSelectedModel({roomModel: options.model});
  };
  
  // Dashboard wrapper view!
  function dashboardWrapperView(){
    return <DashboardWrapper ref = {dashboardWrapperRef} modalAssistData = {modalAssistData} params = {contextObj} />
  };
  
  return(
    <>
      <AppHeaderView params = {contextObj} refreshState = {() => refreshState()} goToLocation = {(options) => goToLocation(options)} />
      <ModalAssist data = {modalAssistData} height={(value) => storeModalAssistHeight(value)}
      childView={() => dashboardWrapperView()} />
    </>
  )
}

export default DashboardInitializer;