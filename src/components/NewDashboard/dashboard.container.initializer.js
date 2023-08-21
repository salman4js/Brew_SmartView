import React, {useState} from 'react';
import NavbarWrapper from './navbar.container.wrapper/navbar.container.wrapper';
import ModalAssist from '../modal.assist/modal.assist.view';
import DashboardWrapper from './dashboard.container.wrapper/dashboard.container.wrapper';

const DashboardInitializer = (props) => {
  
  // Model assist model data!
  var [modalAssistData, setModalAssistData] = useState({
    header: "Dashboard",
    _showHeaderChildView: null,
    height: undefined,
    style: {
      fontWeight: "bold",
      overflow: "auto",
      marginTop: '60px'
    }
  });
  
  // Get modal assist height and store it in the state to let the sidepanel
  // Know about its rendering height!
  function storeModalAssistHeight(value){
    setModalAssistData(prevState => ({...prevState, height: value}));
  };
  
  // Dashboard wrapper view!
  function dashboardWrapperView(){
    return <DashboardWrapper modalAssistData = {modalAssistData} />
  }
  
  return(
    <>
      <NavbarWrapper />
      <ModalAssist data = {modalAssistData} height={(value) => storeModalAssistHeight(value)}
      childView={() => dashboardWrapperView()}  />
    </>
  )
}

export default DashboardInitializer;