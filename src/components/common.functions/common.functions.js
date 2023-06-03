const brewDate = require("brew-date");
const axios = require("axios");
const Variables = require("../Variables")

// Handle checkin time format!
export function handleTimeFormat(time) {
    return brewDate.timeFormat(time);
}

// Get the current operating system!
export function getCurrentOS(){
  const platform = window.navigator.platform;
  return platform;
}

// Convert time from 12 hour format to 24 hour format!
export function convert12to24(timestart){
  try{
    var hrs = Number(timestart.match(/^(\d+)/)[1]);
    var mnts = Number(timestart.match(/:(\d+)/)[1]);
    var format = timestart.match(/\s(.*)$/)[1];
    if (format == "PM" && hrs < 12) hrs = hrs + 12;
    if (format == "AM" && hrs == 12) hrs = hrs - 12;
    var hours = hrs.toString();
    var minutes = mnts.toString();
    if (hrs < 10) hours = "0" + hours;
    if (mnts < 10) minutes = "0" + minutes;
    var timeend = hours + ":" + minutes
    return timeend;
  } catch(err){
    console.log("For some dates, we dont have checkin time!");
  }
}

// Compare two times! --> Always returns the bigger one!
export function compareTime(time1, time2){
  if(time1 > time2){
    return false;
  } else if(time2 > time1){
    return true;
  } else if(time2 === time1) {
    return true;
  } else {
    return undefined;
  }
}

// get today's date in date object!
export function loadDate(){
  return new Date();
}


// Get number of days stayed based on the current data!
export function getStayedDays(checkinDate, checkoutDate){
  const date1 = new Date(checkinDate);
  const date2 = new Date(checkoutDate);
  
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  if(diffDays == 0) {
    return diffDays;  
  } else {
    return diffDays;
  }
}

// Get extra bed price for the specific room type!
export async function getExtraBedPrice(roomType, lodgeId){
  var roomTypePrice;
  const values = {
      suitename: roomType
  }
  await axios.post(`${Variables.Variables.hostId}/${lodgeId}/getprice`, values)
    .then(res => {
      if(res.data.success){
        res.data.message.map((options, key) => {
          roomTypePrice = options.extraBedPrice
        })
      } else {
        return false;
      }
    })
    
  return roomTypePrice;
}

// Get className based on the model input!
export function getClassName(variant){
  if(variant === "secondary"){
    return "btn btn-secondary";
  } else if(variant === "primary"){
    return "btn btn-primary"
  } else if(variant === "dark") {
    return "btn btn-dark"
  } else if(variant === "info"){
    return "btn btn-info"
  } else if(variant === "success") {
    return "btn btn-success"
  } else {
    return "btn btn-danger"
  }
}


// Refresh the page!
export function refreshPage(){
  window.location.reload();
}