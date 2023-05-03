import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Variables from '../Variables';
import Navbar from '../Navbar';
import Loading from '../Loading';
import Modals from '../Modals';
import HomeRoom from '../HomeRoom';
import brewDate from 'brew-date';
import changeScreen from '../Action';
import { getStorage, clearStorage } from '../../Controller/Storage/Storage';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Link, useParams } from "react-router-dom";


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
  
  // Loader state handler!
  const [loader, setLoader] = useState({
    isLoading: false,
    isLoaded: false,
    message: undefined
  })
  
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
    omitObjectId: undefined,
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
  
  // Date picker state handler!
  const [picker, setPicker] = useState({
    checkinDateTime : undefined,
    checkoutDateTime: undefined
  })
  
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
  
  // Get available rooms for prebooking!
  function getAvailableRooms(){

    enableLoader(searchFetchMessage, true);
        
    // Time Values
    const checkinTime = brewDate.timeFormat(new Date(picker.checkinDateTime).toLocaleTimeString());
    const checkoutTime = brewDate.timeFormat(new Date(picker.checkoutDateTime).toLocaleTimeString())
    
    // Date Values
    const checkinDate = brewDate.format(picker.checkinDateTime, "yyyy/mm/dd");
    const checkoutDate = brewDate.format(picker.checkoutDateTime, "yyyy/mm/dd");
    
    const data = {
      dateofCheckin : checkinDate,
      dateofCheckout: checkoutDate,
      checkinTime: checkinTime,
      checkoutTime: checkoutTime
    }
    
    axios.post(`${Variables.hostId}/${splitedIds[0]}/getnonprebook`, data)
      .then(res => {
        if(res.data.success){
           setRoom(prevState => ({...prevState, omitObjectId: res.data.nonAvailableRoomId }));
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
  }, [])
  
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
              <DatePicker style={{ color: "black" }} className="form-control" selected = {picker.checkinDateTime !== undefined ? picker.checkinDateTime : Date.now()} showTimeSelect dateFormat='y-MM-dd' onChange={(e) => setPicker(prevState => ({...prevState, checkinDateTime: e}))} isClearable />
            </div>
            <div className = "col-5">
              <DatePicker style={{ color: "black" }} className="form-control" selected = {picker.checkoutDateTime !== undefined ? picker.checkoutDateTime : Date.now()} showTimeSelect dateFormat='y-MM-dd' onChange={(e) => setPicker(prevState => ({...prevState, checkoutDateTime: e}))} isClearable />
            </div> 
            <div className = {getClassName()} onClick = {() => getAvailableRooms()}>
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
                        if(!room.omitObjectId.includes(item._id)){
                          return(
                            <HomeRoom edit = {false} lodgeName = {splitedIds[1]} extraBedPrice={item.extraBedPrice} extraBeds={item.extraCount} 
                            roomno={item.roomno} engaged={item.isOccupied} roomtype={item.suiteName} bedcount={item.bedCount}
                            roomid={item._id} id={id} lodgeid={splitedIds[0]} price={item.price}
                            prebook={item.preBooked} prevalid={item.preValid} isPrebook = {false} prebookconfig={true} discount={item.discount} 
                            isGstEnabled={isGstEnabled}
                            isHourly={isHourly} channel={channel} options={options} updatePriceWizard={updatePriceWizard} />
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
            <div className = "container text-center heading-top topic-off prebookcheckin">
                Search for available rooms by providing date and time!
            </div>
          </div>
        )
      }
    </div>
  )
}

export default PrebookCheckin;