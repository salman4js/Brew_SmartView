import React, {useRef, useEffect} from 'react';
import jsPDF from 'jspdf';
import CustomModal from '../CustomModal/custom.modal.view';
import RegistrationCard from './RegistrationCard/registration.card.view';
import Button from 'react-bootstrap/Button';
import {refreshPage} from '../common.functions/common.functions'

const GuestRegistration = (props) => {
  
  // Reference for the guest registration card download!
  const grcTemplateDownload = useRef(null);
  
  // Show Custom Modal!
  function _showCustomModal(){
    
    return(
      <div className = "grc-modal-view">
        {props.modalData?.show && (
          <CustomModal modalData = {props.modalData} showBodyItemView = {() => customModalBodyItem()} />
        )}
      </div>
    )
  }
  
  // Custom Modal body view!
  function customModalBodyItem(){
    // Form model to render guest question and hotel questions!
    const hotelQuestions = ["By Direct", "By Company", "By Reservation"];
    const guestQuestions = ['Purpose of visit', 'Arrived from', 'State', 'Vehicle No'];
    const registrationQuestions = {
      hotelQuestions,
      guestQuestions
    } 
    
    return(
      <div ref = {grcTemplateDownload} className = "grcDownloadTemplate">
        <RegistrationCard data = {props.data} reqQuestions = {registrationQuestions} />
      </div>
    )
  }
  
  // Download trigger!
  async function triggerDownload(){
    const doc = new jsPDF("landscape", "pt", "A4");
    // Adding the fonts!
    doc.setFont('Inter-Regular', 'normal');
    // Converting the HTML content to PDF
    await doc.html(grcTemplateDownload.current, {
      callback: function (doc) {
        doc.save('grc.pdf');
      },
      x: 90,
      y: 50,
      html2canvas: {
        scale: 0.9,
        logging: true,
        width: doc.internal.pageSize.getWidth(),
        height: doc.internal.pageSize.getHeight(),
      },
    });
    props.modalData.footerButtons[0].onClick(); // Change the downloadTriggered state back to initial state!
    props.modalData.onHide(false, true); // Close the preview dialog!
    refreshPage();
  }
  
  // Listen if the download has been triggered or not!
  useEffect(() => {
    if(props.modalData.downloadTriggered){
      triggerDownload()
    }
  }, [props.modalData.downloadTriggered])
  
  return(
    <div>
      {_showCustomModal()}
    </div>
  )
}

export default GuestRegistration;