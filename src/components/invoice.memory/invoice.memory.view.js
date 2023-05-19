import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Variables from '../Variables';
import Navbar from '../Navbar';
import Loading from '../Loading';
import { Link, useParams } from "react-router-dom";
import { getInvoiceMemory } from './invoice.memory.utils';
import CardView from '../CardView/card.view/card.view';
import PanelView from '../SidePanelView/panel.view';
  
const InvoiceMemory = () => {
  
  //Check the ID and token of the application!
  const { id } = useParams();
  const splitedIds = id.split(/[-]/);
  
  // Loader state handler!
  const [loader, setLoader] = useState({
    isLoader: false,
    offLoader: triggerLoader
  })
  
  // Popup modal state handler!
  const [modal, setModal] = useState({
    show: false,
    centered: true,
    header: "Invoice Memory Details",
    onHide: triggerModal,
    data: undefined
  })
  
  // Side panel height reference!
  const [sidePanelHeight, setSidePanelHeight] = useState();
  
  // Data State Handler!
  const [data, setData] = useState([]);
  
  // Trigger Loader!
  function triggerLoader(){
    setLoader(prevState => ({...prevState, isLoader: !loader.isLoader}))
  }
  
  // Trigger Modal!
  function triggerModal(value, result){
    setModal(prevState => ({...prevState, show: value, data: result}))
  }
  
  // Load the memory invoice!
  async function _loadMemory(){
    const result = await getInvoiceMemory(splitedIds[0]); //splitedIds[0] as LodgeId
    if(result.data.success){
      setData(result.data.message);
    } else {
      console.log("Value not loaded")
    }
  }
  
  // This method handle getting only of one invoice detail data based on the object ID!
  function getInvoiceDetail(object_id){
    var objectData = {};
    data.map((options, key) => {
      if(options._id === object_id){
        populateModel(options, objectData);
      }
    })
    return objectData
  }
  
  // Populate the modal for in modal data!
  function populateModel(options, objectData){
    console.log(options);
    objectData['Customer Name'] = options.customerName;
    objectData['Checkout Date'] = options.dateofCheckout;
    objectData['CheckIn Date'] = options.dateofCheckin;
    objectData['Phone Number'] = options.customerPhoneNumber;
    objectData['CheckIn Time'] = options.timeofCheckin;
    objectData['CheckOut Time'] = options.timeofCheckout;
    objectData['Aadhar Card'] = options.aadharCard;
    objectData['Payment Date'] = options.paymentDate;
    objectData['Invoice Date'] = options.invoiceDate;
  }
  
  
  // Trigger the modal for details view!
  function _detailView(object_id){
    const result = getInvoiceDetail(object_id); 
    triggerModal(true, result);
  }
  
  // Show Invoice Model View for each data!
  function _showChildView(){
    return(
      data.map((options, key) => {
        // Form up a data!
        const invoiceModel = {
          header : "INVOICE COUNT : " + options.invoiceCount,
          inBodyData: {
            "RECEIPT ID" : options.receiptId === undefined ? "Not Registered" : options.receiptId,
            "INVOICE DATE" : options.invoiceDate,
            "CUSTOMER NAME" : options.customerName,
            "CHECKOUT DATE" : options.dateofCheckout,
            "OBJECT_ID" : options._id 
          },
          footerButtons: {
            show: true,
            id: "Details",
            onClick: _detailView
          },
          isModalEnabled: true
        }
        return(
          <CardView data = {invoiceModel} modalData = {modal} />
        )
      })
    )
  }
  

  // Get the invoice memory of the user when the page loads!
  useEffect(() => {
    _loadMemory();
  },[])
    
  return(
    <div>
      <div>
          <Navbar id={id} name={splitedIds[1]} className="sticky" />
          <PanelView height = {(value) => setSidePanelHeight(value)} />
          <div className = "invoice-container">
            <div className = "text-center heading-bottom-space">
              <div>
                <h3 className = "heading-top topic-off">
                  Invoice Memory
                </h3>
              </div>
            </div>
            <div className = "custom-container">
              <div className = "row">
                {_showChildView()}
              </div>  
            </div>
          </div>
      </div>
    </div>
  )
}

export default InvoiceMemory;