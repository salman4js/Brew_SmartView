import React, { useState, useEffect, useLayoutEffect } from 'react';
import Variables from '../Variables';
import Success from '../ToastHandler/Success';
import Error from '../ToastHandler/Error';
import Feed from '../Configure_Transport/Feed_tMode/Feed';
import axios from 'axios';
import Loading from '../Loading';
import {nodeConvertor} from '../common.functions/node.convertor';
import MetadataFields from "../fields/metadata.fields.view";
import { Link, useParams } from "react-router-dom";
import { addRoomStatus } from '../room.status.utils/room.status.utils';
// Importing Config Matrix!
import ConfigMatrix from './config.matrix/config.matrix.view';


const Client = () => {

    // Get ID and token!
    const { id } = useParams();
    const splitedIds = id.split(/[-]/);
    const token = localStorage.getItem("token");
    
    // State handler for adding room state!
    const [roomState, setRoomState] = useState();
    
    // State handler for room status configuration!
    const [roomStatus, setRoomStatus] = useState({
      name: undefined,
      afterCheckedout: undefined,
      inCleaning: undefined,
      afterCleaning: undefined,
      afterCheckin: undefined
    });
    
    // State handler for show full details!
    const [showFullDetails, setShowFullDetails] = useState({
      isEnabled: false,
      label: 'Show full details in checkin card view',
      onChange: _showFullDetailToggler
    });
    
    // Show full details toggle function!
    function _showFullDetailToggler(value){
      setShowFullDetails(prevState => ({...prevState, isEnabled: value}));
    };
    
    // Link vouchers with livixius!
    const [linkWithLivixius, setLinkWithLivixius] = useState({
      label: "Link livixius with vouchers",
      onChange: _linkVouchersWithLivixius,
      isEnabled: false
    });
    
    // Advance amount restriction state handler!
    const [restrictAdvance, setRestrictAdvance] = useState({
      label: 'Restrict advance amount',
      onChange: _restrictAdvanceAmount,
      isEnabled: false
    });
    
    // Internal use config state handler!
    const [editableOptions, setEditableOptions] = useState({
      label: 'Make checkin date editable option',
      onChange: _editableCheckinDate,
      isEnabled: false
    });
    
    // Function to handle internal use config handler!
    function _editableCheckinDate(value){
      setEditableOptions(prevState => ({...prevState, isEnabled: value}));
    };
    
    // Function to handle changing for restrict advance!
    function _restrictAdvanceAmount(value){
      setRestrictAdvance(prevState => ({...prevState, isEnabled: value}));
    };
    
    // Function to link vouchers with livixius!
    function _linkVouchersWithLivixius(value){
      setLinkWithLivixius(prevState => ({...prevState, isEnabled: value}))
    }
    
    // Function to update the room status!
    function updateRoomStatus(id, name, key){
      if(key === "afterCheckedout"){
        setRoomStatus(prevState => ({...prevState, afterCheckedout: name}));
      }
      
      if(key === "inCleaning"){
        setRoomStatus(prevState => ({...prevState, inCleaning: name}));
      }
      
      if(key === "afterCheckin"){
        setRoomStatus(prevState => ({...prevState, afterCheckin: name}))
      }
      
      if(key === "afterCleaned"){
        setRoomStatus(prevState => ({...prevState, afterCleaning: name}))
      }
    }
    
    // Multiple Receptionist State Handler!
    const [multipleLogin, setMultipleLogin] = useState({
      label: "Enable Multiple Receptionist",
      onChange: _toggleMultipleLogin,
      isEnabled: false
    })
    
    // Toggle multiple login receptionist1
    function _toggleMultipleLogin(value){
      setMultipleLogin(prevState => ({...prevState, isEnabled: value}))
    }

    // Loader option handler!
    const [loader, setLoader] = useState(false);
    const [loading, setLoading] = useState(false);

    //Success and error handler!
    const [success, setSuccess] = useState(false);
    const [successText, setSuccessText] = useState();
    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState();

    // State handler for GST!
    const [isGst, setIsGst] = useState(false);

    // Hourly basis state handler!
    const [isHourly, setIsHourly] = useState(false);

    // Channel Enable state handler!
    const [isChannel, setIsChannel] = useState(false);

    // Update Room Price configuration!
    const [updatePrice, setUpdatePrice] = useState(false);

    // Extra bed state handler!
    const [isExtra, setIsExtra] = useState(false);
    const [extraPrice, setExtraPrice] = useState();

    const extraModel = {
        placeholder: "Extra bed amount per day!",
        label:  "Extra Bed Price Amount",
        className: {
            labelClassName: "text-center text-handler",
            inputClassName: "form-control",
            divClassName: "dashboard-input"
        },
        extraPrice: extraPrice,
        onChange: function(data){
            setExtraPrice(data);
        }
    }
    
    // GRC Enable/Disable state handler!
    const [grcHandler, setGrcHandler] = useState({
      isGrcEnabled: false,
      label: "Enable GRC Preview",
      onChange: handleGrcAction
    })
    
    // Handle function to disable and enable grc on command!
    function handleGrcAction(value){
      setGrcHandler(prevState => ({...prevState, isGrcEnabled: value}));
    }

    // GST Mode Handler!
    const [gstMode, setGstMode] = useState({
        isExclusive: false,
        label: "GST Exclusive Calculation (Default: Inclusive)",
        onChange: handleGSTMode
    })

    function handleGSTMode(value){
        setGstMode(prevState => ({...prevState, isExclusive: value}))
    }

    // Insights enable handler!
    const [insights, setInsights] = useState({
        isEnable: false,
        label: "Enable Insights",
        onChange: handleInsights
    })
    
    // Room Delete Options Handler!
    const [optDelete, setOptDelete] = useState({
      canDelete: false,
      labelDelete: "Enable Can Delete Option",
      onChange: optDeleteChange
    })
    
    // Extra bed calculation based on no of stays state handler!
    const [extraBed, setExtraBed] = useState({
      isDay: false,
      labelExtra: "Enable Calculation of extra bed based on stay days!",
      onChange: handleExtraBed
    })
    
    // Redirect state handler to determin the product has to logged in!
    const [redirect, setRedirect] = useState([
      {
        value: undefined,
        placeholder: "Choose the software has to be redirected",
        label: "Choose the redirected to",
        name: 'redirectTo',
        attribute: 'listField',
        isSelected: false,
        redirectLabel: "Select which software needs to be accessed!",
        redirectTo: "livixius",
        options: [
          {
            value: "livixius"
          },
          {
            value: "vouchers"
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
  ]);

  // Custom HTML configuration state handler!
  const [customHtmlConfiguration, setCustomHtmlConfiguration] = useState({
        billPreview: {
            label: "Select custom html content for bill preview",
            isEnabled: undefined,
        },
        historyPreview: {
            label: "Select custom html content for history preview",
            isEnabled: undefined,
        },
        propertyReadRoom: {
            label: "Select custom html content for property read",
            isEnabled: undefined
        },
        billGeneration: {
            label: "Select custom html content for bill generation",
            isEnabled: undefined
        },
        invoiceGeneration: {
            label: "Select custom html content for invoice generation",
            isEnabled: undefined
        },
        onChange: (isEnabled, node) => updateCustomHtmlContentConfig(isEnabled, node)
  });

    // Custom HTML template configuration.
    const [customHistoryTemplate, setCustomHistoryTemplate] = useState([
        {
            value: undefined,
            placeholder: "Custom History Template",
            name: 'customTemplate',
            rows: '10',
            attribute: 'textAreaField'
        }
    ]);

    // Custom Bill preview configuration
    const [customBillPreview, setCustomBillPreview] = useState([
        {
            value: undefined,
            placeholder: "Custom Bill preview Template",
            name: 'customTemplate',
            rows: '10',
            attribute: 'textAreaField'
        }
    ]);

    // Custom Property Read Room View Template Configuration
    const [customPropertyReadRoomTemplate, setCustomPropertyReadRoomTemplate] = useState([
        {
            value: undefined,
            placeholder: "Custom Property Read preview Template",
            name: 'customTemplate',
            rows: '10',
            attribute: 'textAreaField'
        }
    ]);

    // Custom Property Read User View Template Configuration
    const [customPropertyReadUserTemplate, setCustomPropertyReadUserTemplate] = useState([
        {
            value: undefined,
            placeholder: "Custom Property User preview Template",
            name: 'customTemplate',
            rows: '10',
            attribute: 'textAreaField'
        }
    ]);

    // Custom property bill generation template configuration!
    const [customPropertyBillGeneration, setCustomPropertyBillGeneration] = useState([{
        value: undefined,
        placeholder: "Custom Property Bill Generation preview Template",
        name: 'customTemplate',
        rows: '10',
        attribute: 'textAreaField'
    }]);

    // Custom property invoice generation template configuration!
    const [customPropertyInvoiceGeneration, setCustomPropertyInvoiceGeneration] = useState([{
        value: undefined,
        placeholder: "Custom Property Invoice Generation preview Template",
        name: 'customTemplate',
        rows: '10',
        attribute: 'textAreaField'
    }])
  
  // RefundTracker state handler!
  const [refundTracker, setRefundTracker] = useState({
    isEnabled: false,
    onChange: updateRefundTracker,
    label: "Refund Tracker"
  })
  
  // Update refund tracker!
  function updateRefundTracker(value){
    setRefundTracker(prevState => ({...prevState, isEnabled: value}))
  };

  // Update the HTML configuration from the server initially
  function _updateCustomHtmlConfig(customHtmlContentConfig){
     if(customHtmlContentConfig){
         var customHtmlContent = Object.keys(customHtmlContentConfig);
         for ( var htmlContent of customHtmlContent){
             updateCustomHtmlContentConfig(customHtmlContentConfig[htmlContent].isEnabled, htmlContent);
         };
     };
  };

  function updateCustomHtmlContentConfig(isEnabled, node) {
      setCustomHtmlConfiguration(prevState => ({
          ...prevState,
          [node]: {
              ...prevState[node],
              isEnabled: isEnabled
          }
      }));
  };
    
    // Get field data!
    function getFieldData(state){
      return nodeConvertor(state);
    }
    
    // Handle redirect to state handler!
    function updateRedirectTo(nodeValue, value){
      const updatedState = [...redirect];
      const targetObjectState = updatedState.findIndex(item => item.name === nodeValue);
      if(targetObjectState !== -1){
        updatedState[targetObjectState].value = value;
      }
      setRedirect(updatedState);
    }
    
    // Update universal message!
    function updateUniversalMessage(nodeValue, value){
      const updatedState = [...universalMessage];
      const targetObjectState = updatedState.findIndex(item => item.name === nodeValue);
      if(targetObjectState !== -1){
        updatedState[targetObjectState].value = value.message;
        updatedState[targetObjectState].inlineToast.isShow = value.show;
        updatedState[targetObjectState].inlineToast.inlineMessage = value.show ? "Message still in banner" : "Message has been killed"
      }
      setUniversalMessage(updatedState);
    }
    
    // Handle Extra Bed State!
    function handleExtraBed(value){
      setExtraBed(prevState => ({...prevState, isDay: value}));
    }
    
    // optDelete state handler onChange function!
    function optDeleteChange(value){
      setOptDelete(prevState => ({...prevState, canDelete: value}))
    }

    function handleInsights(value){
        setInsights(prevState => ({...prevState, isEnable: value}))
    }

    const successHandler = () => {
        setSuccess(!success);
    }

    const errorHandler = () => {
        setError(false);
    }

    // Specific reports generation handler!
    const [specific, setSpecific] = useState({
        isEnable: false,
        label: "Enable Specific Reports",
        onChange: handleReports
    });
    
    // Invoice configuration state handler!
    const [invoiceConfig, setInvoiceConfig] = useState({
      removePan: false,
      removePanLabel: "Remove pan number on invoice!",
      printManager: false,
      printManagerLabel: "Print manager instead of manager name",
      validateInvoiceDetails: false,
      validateInvoiceDetailsLabel: "Do validation for invoice details",
      onChange: onChangeInvoiceConfig
    })
    
    // Function to handle changes on invoice config!
    function onChangeInvoiceConfig(printManager,removePan, validateInvoiceDetails){
      setInvoiceConfig(prevState => ({...prevState, removePan: removePan, printManager: printManager, validateInvoiceDetails: validateInvoiceDetails}))
    }

    // Function to handle specific reports!
    function handleReports(value){
        setSpecific(prevState => ({...prevState, isEnable: value}))
    }
    
    // Universal Message handler!
    const [universalMessage, setUniversalMessage] = useState([
      {
        value: undefined,
        placeholder: "Universal Message",
        label: "Enter the universal message",
        name: 'message',
        attribute: 'textField',
        inlineToast: {
          isShow: false,
          inlineMessage: 'Message has been killed'
        }
      }
    ])

    // Set Options
    const [options, setOptions] = useState([]);
    const [dropdown, setDropdown] = useState();
    const [value, setValue] = useState([]);

    // Get the config options from the server
    const showConfig = () => {
        axios.get(`${Variables.hostId}/${splitedIds[0]}/config-get`)
            .then(res => {
                if (res.data.success) {
                    setOptions(res.data.message);
                } else {
                    // TODO: Error Handling!
                }
            })
    }

    // Show applied config from the server!
    const checkConfig = () => {
        setLoading(true)
        axios.get(`${Variables.hostId}/${splitedIds[0]}/config-checking`)
            .then(res => {
                if (res.data.success) {
                    setValue(res.data.message);
                } else {
                    //TODO : Erro handling!
                }
            })
        setLoading(false);
    }

    // Check Matrix Data!
    const checkMatrix = () => {
        setLoading(true)
        axios.get(`${Variables.hostId}/${splitedIds[0]}/check-matrix`)
            .then(res => {
                if(res.data.success){
                    setIsGst(res.data.object.isGstEnabled);
                    setIsHourly(res.data.object.isHourly);
                    setIsChannel(res.data.object.isChannel);
                    setUpdatePrice(res.data.object.updatePrice);
                    setIsExtra(res.data.isExtra);
                    setGstMode(prevState => ({...prevState, isExclusive: res.data.object.isExclusive}))
                    setInsights(prevState => ({...prevState, isEnable: res.data.object.isInsights}))
                    setSpecific(prevState => ({...prevState, isEnable: res.data.object.isSpecific}))
                    setOptDelete(prevState => ({...prevState, canDelete: res.data.object.canDelete}))
                    setExtraBed(prevState => ({...prevState, isDay: res.data.object.extraCalc}))
                    setGrcHandler(prevState => ({...prevState, isGrcEnabled: res.data.object.grcPreview}));
                    setMultipleLogin(prevState => ({...prevState, isEnabled: res.data.object.multipleLogins}));
                    setInvoiceConfig(prevState => ({...prevState, removePan: res.data.object.removePan, 
                      printManager: res.data.object.printManager, validateInvoiceDetails: res.data.object.validateInvoiceDetails}))
                    setRefundTracker(prevState => ({...prevState, isEnabled: res.data.object.refundTracker}))
                    updateRedirectTo("redirectTo", res.data.object.redirectTo);
                    updateUniversalMessage('message', res.data.object.universalMessage);
                    setRoomStatus(prevState => ({...prevState, afterCheckedout: res.data.object.afterCheckedout}))
                    setRoomStatus(prevState => ({...prevState, inCleaning: res.data.object.inCleaning}))
                    setRoomStatus(prevState => ({...prevState, afterCheckin: res.data.object.afterCheckin}))
                    setRoomStatus(prevState => ({...prevState, afterCleaning: res.data.object.afterCleaned}));
                    setRestrictAdvance(prevState => ({...prevState, isEnabled: res.data.object.restrictAdvance}));
                    setEditableOptions(prevState => ({...prevState, isEnabled: res.data.object.checkinDateEditable}));
                    _showFullDetailToggler(res.data.object.showFullDetails);
                    _linkVouchersWithLivixius(res.data.object.linkVouchersWithLivixius);
                    _updateCustomHtmlConfig(res.data.object.customHtmlContent);
                }
            })
       setLoading(false)
    }

    // Disbale the enabled config!
    const onDelete = (id) => {
        setLoader(true);
        const data = {
            id: id
        }
        axios.post(`${Variables.hostId}/${splitedIds[0]}/delete-config`, data)
            .then(res => {
                if (res.data.success) {
                    setLoader(false);
                } else {
                    setLoader(false);
                }
            })
            .catch(err => {
                setError(!error);
                setErrorText("Some internal error occured!")
            })
            .finally(() => {
                checkConfig();
            })
    }
    
    // Add room state!
    async function addRoomState(){
      var data = {lodgeId: splitedIds[0], statusName: roomState};
      const result = await addRoomStatus(data);
      if(result.data.success){
        setLoader(false);
        setSuccess(!success);
        setSuccessText("Room status created successfully!");
      }
    }

    // Process the data!
    const processData = () => {
        setLoader(true);
        const data = {
            config: dropdown,
            id: splitedIds[0]
        }
        axios.post(`${Variables.hostId}/${splitedIds[0]}/create-config`, data)
            .then(res => {
                if (res.data.success) {
                    setLoader(false);
                    setSuccess(!success);
                    setSuccessText(res.data.message);
                } else {
                    setLoader(false)
                    setError(!error);
                    setErrorText(res.data.message);
                }
            })
            .catch(err => {
                setLoader(false);
                setError(!error);
                setErrorText("Some internal error occured!");
            })
            .finally(() => {
                checkConfig();
            })
    }

    // GST handler!
    function handleGST() {
        setIsGst(!isGst);
    }

    // Handle Hourly!
    function handleHourly(){
        setIsHourly(!isHourly);
    }

    // Handle Channel Manager!
    function handleChannel(){
        setIsChannel(!isChannel);
    }

    // Handle Update Price State!
    function handlePrice(){
        setUpdatePrice(!updatePrice);
    }

    // Handle Extra bed state 
    function handleExtra(value){
        setIsExtra(value);
    };

    // Update custom template data!
    async function _updateCustomTemplate(templateName, metadataField){
      var fieldData = getFieldData(metadataField);
      setLoading(true);
      fieldData['templateName'] = templateName;
      var result = await axios.post(`${Variables.hostId}/${splitedIds[0]}/savecustomtemplate`, fieldData);
      if(result.data.status){
          setLoading(false);
          setSuccess(!success);
          setSuccessText("Custom Template updated");
      }
    };

    // Change Matrix config data!
    function changeMatrix() {
        const redirectToFieldData = getFieldData(redirect);
        const universalMessageFieldData = getFieldData(universalMessage);
        universalMessageFieldData['show'] = universalMessageFieldData.message !== undefined ? true : false
        setLoading(true);
        const data = {
            isGst: isGst,
            isHourly: isHourly,
            isChannel: isChannel,
            updatePrice: updatePrice,
            isExtra: isExtra,
            isExclusive: gstMode.isExclusive,
            isInsights: insights.isEnable,
            isSpecific: specific.isEnable,
            canDeleteRooms: optDelete.canDelete,
            extraCalc : extraBed.isDay,
            grcPreview: grcHandler.isGrcEnabled,
            redirectTo: redirectToFieldData.redirectTo,
            multipleLogin: multipleLogin.isEnabled,
            removePan: invoiceConfig.removePan,
            printManager: invoiceConfig.printManager,
            validateInvoiceDetails: invoiceConfig.validateInvoiceDetails,
            universalMessage: universalMessageFieldData,
            refundTracker: refundTracker.isEnabled,
            afterCheckedout: roomStatus.afterCheckedout,
            inCleaning: roomStatus.inCleaning,
            afterCheckin: roomStatus.afterCheckin,
            afterCleaning: roomStatus.afterCleaning,
            linkVouchersWithLivixius: linkWithLivixius.isEnabled,
            restrictAdvance: restrictAdvance.isEnabled,
            checkinDateEditable: editableOptions.isEnabled,
            showFullDetails: showFullDetails.isEnabled,
            customHtmlContent: customHtmlConfiguration
        }

        axios.post(`${Variables.hostId}/${splitedIds[0]}/config-update-matrix`, data)
            .then(resp => {
                if (resp.data.success) {
                    setSuccess(!success)
                    setSuccessText(resp.data.message);
                } else {
                    setSuccess(!success)
                    setSuccessText(resp.data.message);
                }
            })
            .catch(err => {
                setError(!error)
                setErrorText("Some internal error occured")
            })
            .finally(() => {
                checkMatrix();
            })

    };
    
    // Get the room status of the lodge for configuration!
    async function getRoomStatus(){
      await axios.get(`${Variables.hostId}/${splitedIds[0]}/getallroomstatus`)
        .then(res => {
          if(res.data.success){
            setRoomStatus(prevState => ({...prevState, name: res.data.infoMessage}))
          }
        })
        .catch(err => {
          setError(!error);
          setErrorText("Some internal error occured")
        })
    }

    // Getting the data before the DOM renders!
    useLayoutEffect(() => {
        showConfig();
    }, [])

    // Check the config collection when the DOM renders!
    useEffect(() => {
        checkConfig();
        checkMatrix();
        getRoomStatus();
    }, [])

    // Reseting the error message back to the initial state
    useEffect(() => {
        setTimeout(errorHandler, 4000);
    }, [error])


    return (
        <div className="align-down" style={{ display: "flex", justifyContent: "center", paddingLeft: "100px" }}>
            {
                loading ? (
                    <div className = "container">
                      <Loading />
                    </div>
                ) : (
                    <div className='row'>
                        <div className='col'>
                            {
                                error ? (
                                    <Error error={error} errorText={errorText} />
                                ) : (
                                    <div>
                                    </div>
                                )
                            }
                            <div class="card text-center" style={{ width: "50vh", height: "50vh" }}>
                                <div class="card-header" style={{ color: "black" }}>
                                    Config -  Featured
                                </div>
                                <div class="card-body">
                                    <div className='modal-gap'>
                                        <label style={{ color: "black" }}> Change Config </label>
                                        <select class="form-select" aria-label="Default select example" onChange={(e) => setDropdown(e.target.value)}>
                                            <option selected>Choose...</option>
                                            {
                                                options.map((item, key) => {
                                                    return (
                                                        <option>{item}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                    <br />
                                    <button className='btn btn-info' onClick={() => processData()}> Add Data </button>
                                </div>
                                <div style={{ color: "black", fontSize: "18px" }}>
                                    <div>
                                        {
                                            loader ? (
                                                <div className="modal-gap">
                                                    Loading, please wait...
                                                </div>
                                            ) : (
                                                <div className="overscroll">
                                                    {
                                                        value.map((item, key) => {
                                                            return (
                                                                <Feed name={item.config} id={item._id} onSelect={(id, name) => onDelete(id, name)} />
                                                            )
                                                        })
                                                    }
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                            <div class="card text-center" style={{ width: "50vh", marginTop: "10px", marginBottom: "10px" }}>
                                <div class="card-header" style={{ color: "black" }}>
                                    Config -  Room Status
                                </div>
                                <div class="card-body">
                                    <div className='modal-gap'>
                                        <label style={{ color: "black" }}> Add room status </label>
                                        <input className = 'form-control' placeholder = "Enter room status" value = {roomState} name = {roomState} onChange = {(e) => setRoomState(e.target.value)} />
                                    </div>
                                    <br />
                                    <button className='btn btn-info' onClick={() => addRoomState()}> Create Room State </button>
                                </div>
                                <div style={{ color: "black", fontSize: "18px" }}>
                                    <div>
                                        {
                                            loader ? (
                                                <div className="modal-gap">
                                                    Loading, please wait...
                                                </div>
                                            ) : (
                                                <div className="overscroll">
                                                  {roomStatus.name && roomStatus.name.map((opts, index) => {
                                                    return(
                                                      <Feed name={opts.statusName} id={opts._id} 
                                                      onSelect={(id, name) => updateRoomStatus(id, name, 'afterCheckin')}
                                                      highlight = {true} selected = {roomStatus.afterCheckin} />
                                                    )
                                                  })}
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                            {/* Success Handler */}
                            {
                                success ? (
                                    <Success show={success} text={successText} handleClose={successHandler} />
                                ) : (
                                    <div>

                                    </div>
                                )
                            }
                        </div>
                        <div className='col'>
                            {
                                error ? (
                                    <Error error={error} errorText={errorText}/>
                                ) : (
                                    <div>
                                    </div>
                                )
                            }
                            <div class="card" style={{width: "50vh", height: '50vh'}}>
                                <div class="card-header text-center" style={{color: "black"}}>
                                    Config - Matrix
                                </div>
                                <div class="card-body">
                                    <ConfigMatrix updatePrice={updatePrice} isGst={isGst} handleGST={() => handleGST()}
                                                  isHourly={isHourly} handleHourly={() => handleHourly()}
                                                  handleChannel={() => handleChannel()} isChannel={isChannel}
                                                  handlePrice={() => handlePrice()} isExtra={isExtra}
                                                  handleExtra={(value) => handleExtra(value)}
                                                  extraModel={extraModel} gstMode={gstMode} insights={insights}
                                                  specific={specific} optDelete={optDelete}
                                                  extraBed={extraBed} grcHandler={grcHandler} redirectTo={redirect}
                                                  updateRedirectTo={setRedirect} multipleLogin={multipleLogin}
                                                  invoiceConfig={invoiceConfig} universalMessage={universalMessage}
                                                  updateUniversalMessage={setUniversalMessage}
                                                  refundTracker={refundTracker}
                                                  linkVouchersWithLivixius={linkWithLivixius}
                                                  restrictAdvance={restrictAdvance} editableOptions={editableOptions}
                                                  showFullDetails={showFullDetails}
                                                  customHtmlConfiguration={customHtmlConfiguration}/>
                                    <br/>
                                    <button className="btn btn-primary btn-center-config-matrix"
                                            onClick={() => changeMatrix()}>Update Changes
                                    </button>
                                </div>
                            </div>
                            <div class="card"
                                 style={{width: "50vh", height: '50vh', marginTop: "10px", marginBottom: "10px"}}>
                                <div class="card-header text-center" style={{color: "black"}}>
                                    Config - Room Status
                                </div>
                                <div class="card-body">
                                    <p className="text-center" style={{color: "black"}}>
                                        Question to configure room status!
                                    </p>
                                    <p className="text-center" style={{color: "black"}}>
                                        When the room has been checkedout, what status should the room move into?
                                    </p>
                                    {roomStatus.name && roomStatus.name.map((opts, index) => {
                                        return (
                                            <Feed name={opts.statusName} id={opts._id}
                                                  onSelect={(id, name) => updateRoomStatus(id, name, 'afterCheckedout')}
                                                  highlight={true} selected={roomStatus.afterCheckedout}/>
                                        )
                                    })}
                                    <p className="text-center" style={{color: "black"}}>
                                        When the room is in dirty state, what status should the room move into?
                                    </p>
                                    {roomStatus.name && roomStatus.name.map((opts, index) => {
                                        return (
                                            <Feed name={opts.statusName} id={opts._id}
                                                  onSelect={(id, name) => updateRoomStatus(id, name, 'inCleaning')}
                                                  highlight={true} selected={roomStatus.inCleaning}/>
                                        )
                                    })}
                                    <p className="text-center" style={{color: "black"}}>
                                        When the room has been cleaned, what status should the room move into?
                                    </p>
                                    {roomStatus.name && roomStatus.name.map((opts, index) => {
                                        return (
                                            <Feed name={opts.statusName} id={opts._id}
                                                  onSelect={(id, name) => updateRoomStatus(id, name, 'afterCleaned')}
                                                  highlight={true} selected={roomStatus.afterCleaning}/>
                                        )
                                    })}
                                    <p className="text-center" style={{color: "black"}}>
                                        When the room has been checkedin, what status should the room move into?
                                    </p>
                                    {roomStatus.name && roomStatus.name.map((opts, index) => {
                                        return (
                                            <Feed name={opts.statusName} id={opts._id}
                                                  onSelect={(id, name) => updateRoomStatus(id, name, 'afterCheckin')}
                                                  highlight={true} selected={roomStatus.afterCheckin}/>
                                        )
                                    })}
                                    <button className="btn btn-primary btn-center-config-matrix"
                                            onClick={() => changeMatrix()}>Config Room Status
                                    </button>
                                </div>
                            </div>
                            {/* History Custom Template Preview */}
                            <div className="card modal-gap" style={{width: "50vh", height: '40vh'}}>
                                <div className="card-header text-center" style={{color: "black"}}>
                                    History Preview Custom Template
                                </div>
                                <div className='card-body'>
                                    <MetadataFields data={customHistoryTemplate}
                                                    updateData={(updatedData) => setCustomHistoryTemplate(updatedData)}/>
                                    <button className='btn btn-primary btn-center-config-matrix'
                                            onClick={() => _updateCustomTemplate('history', customHistoryTemplate)}> Update
                                        Custom Template
                                    </button>
                                </div>
                            </div>
                            {/* Bill Custom Template Preview */}
                            <div className="card modal-gap" style={{width: "50vh", height: '40vh'}}>
                                <div className="card-header text-center" style={{color: "black"}}>
                                    Bill Preview Custom Template
                                </div>
                                <div className='card-body'>
                                    <MetadataFields data={customBillPreview}
                                                    updateData={(updatedData) => setCustomBillPreview(updatedData)}/>
                                    <button className='btn btn-primary btn-center-config-matrix'
                                            onClick={() => _updateCustomTemplate('bill-preview', customBillPreview)}> Update
                                        Custom Template
                                    </button>
                                </div>
                            </div>
                            {/* Property Read Custom Template Preview */}
                            <div className="card modal-gap" style={{width: "50vh", height: '40vh'}}>
                                <div className="card-header text-center" style={{color: "black"}}>
                                    Property Read Room Details Preview Custom Template
                                </div>
                                <div className='card-body'>
                                    <MetadataFields data={customPropertyReadRoomTemplate}
                                                    updateData={(updatedData) => setCustomPropertyReadRoomTemplate(updatedData)}/>
                                    <button className='btn btn-primary btn-center-config-matrix'
                                            onClick={() => _updateCustomTemplate('property-room', customPropertyReadRoomTemplate)}> Update
                                        Custom Template
                                    </button>
                                </div>
                            </div>
                            <div className="card modal-gap" style={{width: "50vh", height: '40vh'}}>
                                <div className="card-header text-center" style={{color: "black"}}>
                                    Property Read User Details Preview Custom Template
                                </div>
                                <div className='card-body'>
                                    <MetadataFields data={customPropertyReadUserTemplate}
                                                    updateData={(updatedData) => setCustomPropertyReadUserTemplate(updatedData)}/>
                                    <button className='btn btn-primary btn-center-config-matrix'
                                            onClick={() => _updateCustomTemplate('property-user', customPropertyReadUserTemplate)}> Update
                                        Custom Template
                                    </button>
                                </div>
                            </div>
                            <div className="card modal-gap" style={{width: "50vh", height: '40vh'}}>
                                <div className="card-header text-center" style={{color: "black"}}>
                                    Property Bill Generation Custom Template
                                </div>
                                <div className='card-body'>
                                    <MetadataFields data={customPropertyBillGeneration}
                                                    updateData={(updatedData) => setCustomPropertyBillGeneration(updatedData)}/>
                                    <button className='btn btn-primary btn-center-config-matrix'
                                            onClick={() => _updateCustomTemplate('property-bill-generation', customPropertyBillGeneration)}> Update
                                        Custom Template
                                    </button>
                                </div>
                            </div>
                            <div className="card modal-gap" style={{width: "50vh", height: '40vh'}}>
                                <div className="card-header text-center" style={{color: "black"}}>
                                    Property Invoice Generation Custom Template
                                </div>
                                <div className='card-body'>
                                    <MetadataFields data={customPropertyInvoiceGeneration}
                                                    updateData={(updatedData) => setCustomPropertyInvoiceGeneration(updatedData)}/>
                                    <button className='btn btn-primary btn-center-config-matrix'
                                            onClick={() => _updateCustomTemplate('property-invoice-generation', customPropertyInvoiceGeneration)}> Update
                                        Custom Template
                                    </button>
                                </div>
                            </div>
                            {/* Success Handler */}
                            {
                                success ? (
                                    <Success show={success} text={successText} handleClose={successHandler}/>
                                ) : (
                                    <div>

                                    </div>
                                )
                            }
                        </div>
                    </div>
                )
            }

        </div>
    )
}

export default Client