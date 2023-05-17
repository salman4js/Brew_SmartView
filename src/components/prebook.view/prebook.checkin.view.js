import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Variables from '../Variables';
import Navbar from '../Navbar';
import Loading from '../Loading';
import Modals from '../Modals';
import HomeRoom from '../HomeRoom';
import brewDate from 'brew-date';
import changeScreen from '../Action';
import { getStorage, clearStorage, defaultStorage } from '../../Controller/Storage/Storage';
import { getCurrentOS } from '../common.functions/common.functions';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Link, useParams } from "react-router-dom";
import Success from '../ToastHandler/Success.js';


const PrebookCheckin = () => {
  //Check the ID and token of the application!
  const { id } = useParams();
  const splitedIds = id.split(/[-]/);
  
  // Messages for the loader!
  var roomFetchMessage = "Gathering available rooms...";
  var searchFetchMessage = "Fetching all the prebook available rooms...";
    
  // Channel Manager Handler!
  const [channel, setChannel] = useState(JSON.parse(getStorage("isChannel")));
  
  // Update Price Wizard!
  const [updatePriceWizard, setUpdatePriceWizard] = useState(JSON.parse(getStorage("updatePrice")));
  
  // Is Hourly configuration!
  const [isHourly, setIsHourly] = useState(JSON.parse(getStorage("isHourly")));
  
  // Is GST enabled configuration!
  const [isGstEnabled, setIsGstEnabled] = useState(JSON.parse(getStorage("isGstEnabled")));
  
  // Channel options state handler!
  const [options, setOptions] = useState(false);
  
  // Form the className for the search button!
  function getClassName(){
    return loader.isLoading ? "col btn btn-primary disabled" : "col btn btn-primary"
  }
  
  // Reload state handler!
  const [reload, setReload] = useState(false);
  
  // Toast State Handler!
  const [toastMessage, setToastMessage] = useState({
    show: false,
    text: undefined
  })
  
  // Loader state handler!
  const [loader, setLoader] = useState({
    isLoading: false,
    isLoaded: false,
    message: undefined
  })
  
  // Define the times to exclude
  const [time, setTime] = useState({
    omitTimes: undefined,
    minHour: undefined,
    maxHour: undefined,
    checkinDate: undefined,
    checkoutDate: undefined,
    checkinTime: undefined,
    checkoutTime: undefined
  })
  
  // Get excludeTimes!
  function excludeTimes(selectedDate, selectedRoom){
    // Add Code!
  }
  
  // Stop the loader!
  function stopLoader(loadedValue){
    // Stop the loader!
    setLoader(prevState => ({...prevState, isLoading: false, isLoaded: loadedValue, message: undefined}))
  }
  
  // Start the loader!
  function enableLoader(message, loader){
    setLoader(prevState => ({...prevState, isLoading: !loader.isLoading, isLoaded: loader, message: message}))
  }
  
  // Prebook data model handler!
  const [room, setRoom] = useState({
    omitObjectId: [],
    dateTime: undefined,
    allRooms: undefined
  })
  
  // Error handler!
  const [errorHandler, setErrorHandler] = useState({
    show: false,
    message: false,
    header: false,
    headerText: undefined,
  })
  
  // Change the state of the error handler!
  const handleShow = () => {
    setErrorHandler({
      ...errorHandler,
      show: false,
      message: undefined,
      header: false,
      headerText: undefined
    })
  }
  
  // Hide the toast message!
  function _hideToast(){
    setToastMessage({show: false})
  }
  
  // Date picker state handler!
  const [picker, setPicker] = useState({
    checkinDateTime : undefined,
    checkinTime: undefined,
    checkoutDateTime: undefined,
    checkoutTime: undefined
  })
  
  // Set checkin, checkout date and time!
  function dateTimeSetup(value, constants){
    if(constants === "Check-In"){
      const checkTime = brewDate.timeFormat(new Date(value).toLocaleTimeString());
      setPicker(prevState => ({...prevState, checkinDateTime: value, checkinTime: checkTime}))
    } else {
      const checkTime = brewDate.timeFormat(new Date(value).toLocaleTimeString());
      setPicker(prevState => ({...prevState, checkoutDateTime: value, checkoutTime: checkTime}))
    }
  }
  
  // Fetch all rooms!
  function getAllRooms(){
    // Enable the loader!
    enableLoader(roomFetchMessage, false);
    
    const token = localStorage.getItem("token");
    if (!token) {
        clearStorage(); // clear storage and navigate back to login page!
        changeScreen();
    } else {
        axios.post(`${Variables.hostId}/${splitedIds[0]}/false/roomlodge`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            }
        })
            .then(res => {
                if (res.data.success) {
                    setRoom(prevState => ({...prevState, allRooms: res.data.message}));
                    setOptions(res.data.channels);
                    stopLoader(false);
                } else {
                  stopLoader(false);
                  setErrorHandler({
                    show: true,
                    message: "Error occured in fetching all the available rooms...",
                    header: false,
                    headerText: false
                  })
                }
            })
    }
  }
  
  // Reload component!
  function _triggerReload(value){
    setReload(value)
  }
  
  // Check to see if the checkout date is actually less than the checkin date!
  function _initiateSearch(){
    enableLoader(searchFetchMessage, true);
    if(picker.checkinDateTime > picker.checkoutDateTime){
      setErrorHandler({
        show: true,
        message: "Check in date cannot be greater than the checkout date!",
        header: false,
        headerText: false
      })
      stopLoader(false);
    } else {
      getAvailableRooms();
    }
  }
  
  // Get available rooms for prebooking!
  function getAvailableRooms(){
    
    var operatingSystem = getCurrentOS();
    
    var options = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    
    if(operatingSystem.search("Linux") !== -1){ // AM and PM format changes based on OS, cause of toLocaleTimeString() method!
      // Time Values
      var checkinTime = brewDate.timeFormat(new Date(picker.checkinDateTime).toLocaleTimeString());
      var checkoutTime = brewDate.timeFormat(new Date(picker.checkoutDateTime).toLocaleTimeString());
    } else {
      // Time Values
      var checkinTime = brewDate.timeFormat(new Date(picker.checkinDateTime).toLocaleTimeString('en-US', options));
      var checkoutTime = brewDate.timeFormat(new Date(picker.checkoutDateTime).toLocaleTimeString('en-US', options));
    }
            
  
    // Date Values
    const checkinDate = brewDate.format(picker.checkinDateTime, "yyyy/mm/dd");
    const checkoutDate = brewDate.format(picker.checkoutDateTime, "yyyy/mm/dd");
    
    const data = {
      dateofCheckin : checkinDate,
      dateofCheckout: checkoutDate,
      checkinTime: checkinTime,
      checkoutTime: checkoutTime
    }
    
    console.warn(data); // Remove later after find out the root cause of am and pm mismatching!
        
    axios.post(`${Variables.hostId}/${splitedIds[0]}/getnonprebook`, data)
      .then(res => {
        if(res.data.success){
           const dateTime = {
             "dateTime": JSON.stringify(res.data.dateTime)
           }
           
           defaultStorage(dateTime); // Putting it in the localStorage as the state updates very slowly! for excludeTime function.
           setTime(prevState => ({...prevState, checkinDate: res.data.checkinDate, checkoutDate: res.data.checkoutDate, checkinTime: res.data.checkinTime, checkoutTime: res.data.checkoutTime}))
           setRoom(prevState => ({...prevState, omitObjectId: res.data.nonAvailableRoomId}));
           stopLoader(true);
        } else {
          stopLoader(true);
          setErrorHandler({
            show: true,
            message: res.data.message,
            header: false,
            headerText: false
          })
        }
      })
      .catch(err => {
        setErrorHandler({
          show: true,
          message: "Some internal error occured",
          header: false,
          headerText: false
        })
      })  
  }
  
  // Constructor to load all rooms data when the page loads!
  useEffect(() => {
     getAllRooms();
     if(reload){
       setToastMessage(prevState => ({...prevState, show: reload, text: "Customer has been prebooked!"}))
     }
  }, [reload])
  
  return(
    <div>
      <div>
        <Navbar id={id} name={splitedIds[1]} className="sticky" />
      </div>
      <div className = "container text-center">
        <div>
          <h3 className = "heading-top topic-off">
            Pre-Book Native Channel
          </h3>
        </div>
      </div>
      <div className = "grid-system-search">
        <div className = "container">
          <div className = "row">
            <div className = "col-5">
              <DatePicker style={{ color: "black" }} className="form-control" selected = {picker.checkinDateTime !== undefined ? picker.checkinDateTime : Date.now()} minDate = {Date.now()} showTimeSelect onChange={(e) => dateTimeSetup(e, "Check-In")} dateFormat="MMMM d, yyyy h:mm aa"
 isClearable />
            </div>
            <div className = "col-5">
              <DatePicker style={{ color: "black" }} className="form-control" selected = {picker.checkoutDateTime !== undefined ? picker.checkoutDateTime : Date.now()} minDate = {Date.now()} showTimeSelect onChange={(e) => dateTimeSetup(e, "Check-Out")} dateFormat="MMMM d, yyyy h:mm aa" isClearable />
            </div> 
            <div className = {getClassName()} onClick = {() => _initiateSearch()}>
                Search
            </div>            
          </div>
        </div>
      </div>
      {
        loader.isLoaded === true ? (
          loader.isLoading ? (
            <div>
              <div className = "container text-center heading-top topic-off prebookcheckin">
                  {loader.message}
              </div>
            </div>
          ) : (
              errorHandler.show ? (
                <Modals options = {errorHandler} setShow = {(data) => handleShow(data)} />
              ) : (
                <div className = "container">
                  <div className = "row top-gun">
                    {
                      room.allRooms.map((item,key) => {
                        if(!room.omitObjectId.includes(item.roomno)){
                          return(
                            <HomeRoom edit = {false} lodgeName = {splitedIds[1]} extraBedPrice={item.extraBedPrice} extraBeds={item.extraCount} 
                            roomno={item.roomno} engaged={item.isOccupied} roomtype={item.suiteName} bedcount={item.bedCount}
                            roomid={item._id} id={id} lodgeid={splitedIds[0]} price={item.price}
                            prebook={item.preBooked} prevalid={item.preValid} isPrebook = {true} prebookconfig={true} discount={item.discount} 
                            isGstEnabled={isGstEnabled} excludeTime = {time} load = {(value) => _triggerReload(value)} reloadValue = {reload}
                            isHourly={isHourly} channel={channel} options={options} updatePriceWizard={updatePriceWizard} timeModel = {time} />
                          )
                        }
                      })
                    }
                  </div>
                </div>
              )
          )
        ) : (
          <div>
            {errorHandler.show ? (
              <Modals options = {errorHandler} setShow = {(data) => handleShow(data)} />
            ): (
              <div className = "container text-center heading-top topic-off prebookcheckin">
                  Search for available rooms by providing date and time!
              </div>
            )}
          </div>
        )
      }
      {toastMessage.show && (
        <Success show = {toastMessage.show} text = {toastMessage.text} handleClose = {() => _hideToast()} />
      )}
    </div>
  )
}

export default PrebookCheckin;