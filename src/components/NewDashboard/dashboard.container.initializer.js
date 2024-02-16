import React, {useState, useRef} from 'react';
import { useParams } from 'react-router-dom';
import NavbarWrapper from './navbar.container.wrapper/navbar.container.wrapper';
import ModalAssist from '../modal.assist/modal.assist.view';
import DashboardWrapper from './dashboard.container.wrapper/dashboard.container.wrapper';

const DashboardInitializer = (props) => {

  // Get the ID params from the url!
  const { id } = useParams();
  const splitedIds = id.split(/[-]/);
  
  // Child component references!
  var dashboardWrapperRef = useRef(null);
  
  // Club the params into a single object!
  var paramsObj = {
    id: id,
    accIdAndName: splitedIds
  };
  
  // Model assist model data!
  var [modalAssistData, setModalAssistData] = useState({
    header: `${paramsObj.accIdAndName[1]} -  Dashboard`,
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
    return <DashboardWrapper ref = {dashboardWrapperRef} modalAssistData = {modalAssistData} params = {paramsObj} />
  };
  
  return(
    <>
      <NavbarWrapper params = {paramsObj} refreshState = {() => refreshState()} goToLocation = {(options) => goToLocation(options)} />
      <ModalAssist data = {modalAssistData} height={(value) => storeModalAssistHeight(value)}
      childView={() => dashboardWrapperView()} />
    </>
  )
}

export default DashboardInitializer;