import React, { useState, useEffect, useLayoutEffect } from 'react';
import Variables from '../Variables';
import Success from '../ToastHandler/Success';
import Error from '../ToastHandler/Error';
import Feed from '../Configure_Transport/Feed_tMode/Feed';
import axios from 'axios';
import Loading from '../Loading';
import {nodeConvertor} from '../common.functions/node.convertor';
import { Link, useParams } from "react-router-dom";

// Importing Config Matrix!
import ConfigMatrix from './config.matrix/config.matrix.view';


const Client = () => {

    // Get ID and token!
    const { id } = useParams();
    const splitedIds = id.split(/[-]/);
    const token = localStorage.getItem("token");
    
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
  
  // RefundTracker state handler!
  const [refundTracker, setRefundTracker] = useState({
    isEnabled: false,
    onChange: updateRefundTracker,
    label: "Refund Tracker"
  })
  
  // Update refund tracker!
  function updateRefundTracker(value){
    setRefundTracker(prevState => ({...prevState, isEnabled: value}))
  }
    
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
                    setIsGst(res.data.isGstEnabled);
                    setIsHourly(res.data.isHourly);
                    setIsChannel(res.data.isChannel);
                    setUpdatePrice(res.data.updatePrice);
                    setIsExtra(res.data.isExtra);
                    setGstMode(prevState => ({...prevState, isExclusive: res.data.isExclusive}))
                    setInsights(prevState => ({...prevState, isEnable: res.data.isInsights}))
                    setSpecific(prevState => ({...prevState, isEnable: res.data.isSpecific}))
                    setOptDelete(prevState => ({...prevState, canDelete: res.data.canDelete}))
                    setExtraBed(prevState => ({...prevState, isDay: res.data.extraCalc}))
                    setGrcHandler(prevState => ({...prevState, isGrcEnabled: res.data.grcPreview}));
                    setMultipleLogin(prevState => ({...prevState, isEnabled: res.data.multipleLogins}));
                    setInvoiceConfig(prevState => ({...prevState, removePan: res.data.removePan, 
                      printManager: res.data.printManager, validateInvoiceDetails: res.data.validateInvoiceDetails}))
                    setRefundTracker(prevState => ({...prevState, isEnabled: res.data.refundTracker}))
                    updateRedirectTo("redirectTo", res.data.redirectTo);
                    updateUniversalMessage('message', res.data.universalMessage)
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
                    console.log(res.data.message);
                } else {
                    setLoader(false);
                    console.log(res.data.message);
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
    function handleExtra(){
        setIsExtra(!isExtra);
    }

    // Change Matrix config data!
    function changeMatrix() {
        const redirectToFieldData = getFieldData(redirect);
        const universalMessageFieldData = getFieldData(universalMessage);
        universalMessageFieldData['show'] = true
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
            refundTracker: refundTracker.isEnabled
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

    }

    // Getting the data before the DOM renders!
    useLayoutEffect(() => {
        showConfig();
    }, [])

    // Check the config collection when the DOM renders!
    useEffect(() => {
        checkConfig();
        checkMatrix();
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
                                                                <Feed name={item.config} id={item._id} onDelete={(id) => onDelete(id)} />
                                                            )
                                                        })
                                                    }
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
                                    <Error error={error} errorText={errorText} />
                                ) : (
                                    <div>
                                    </div>
                                )
                            }
                            <div class="card" style={{ width: "50vh", height: '50vh' }}>
                                <div class="card-header text-center" style={{ color: "black" }}>
                                    Config -  Matrix
                                </div>
                                <div class="card-body">
                                    <ConfigMatrix updatePrice = {updatePrice} isGst = {isGst} handleGST = {() => handleGST()} isHourly = {isHourly} handleHourly = {() => handleHourly()} 
                                    handleChannel = {() => handleChannel()} isChannel = {isChannel} handlePrice = {() => handlePrice()} isExtra = {isExtra} handleExtra = {() => handleExtra()}
                                    extraModel = {extraModel} gstMode = {gstMode} insights = {insights} specific = {specific} optDelete = {optDelete} 
                                    extraBed = {extraBed} grcHandler = {grcHandler} redirectTo = {redirect} updateRedirectTo = {setRedirect} multipleLogin = {multipleLogin}
                                    invoiceConfig = {invoiceConfig} universalMessage = {universalMessage} updateUniversalMessage = {setUniversalMessage} refundTracker = {refundTracker} />
                                    <br />
                                    <button className="btn btn-primary btn-center-config-matrix" onClick={() => changeMatrix()}>Update Changes</button>
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
                    </div>
                )
            }

        </div>
    )
}

export default Client