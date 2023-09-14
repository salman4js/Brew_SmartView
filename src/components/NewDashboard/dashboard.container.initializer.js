import React, {useState} from 'react';
import { useParams } from 'react-router-dom';
import NavbarWrapper from './navbar.container.wrapper/navbar.container.wrapper';
import ModalAssist from '../modal.assist/modal.assist.view';
import DashboardWrapper from './dashboard.container.wrapper/dashboard.container.wrapper';

const DashboardInitializer = (props) => {
  
  // Get the ID params from the url!
  const { id } = useParams();
  const splitedIds = id.split(/[-]/);
  
  // Club the params into a single object!
  var paramsObj = {
    id: id,
    accIdAndName: splitedIds
  };
  
  // Model assist model data!
  var [modalAssistData, setModalAssistData] = useState({
    header: 'Dashboard',
    _showHeaderChildView: null,
    height: undefined,
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
  
  // Dashboard wrapper view!
  function dashboardWrapperView(){
    return <DashboardWrapper modalAssistData = {modalAssistData} params = {paramsObj} />
  }
  
  return(
    <>
      <NavbarWrapper params = {paramsObj} />
      <ModalAssist data = {modalAssistData} height={(value) => storeModalAssistHeight(value)}
      childView={() => dashboardWrapperView()} />
    </>
  )
}

export default DashboardInitializer;