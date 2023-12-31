import {getStorage} from "../../Controller/Storage/Storage";

const brewDate = require("brew-date");
const axios = require("axios");
const Variables = require("../Variables");
const storage = require("../../Controller/Storage/Storage")

// Handle checkin time format!
export function handleTimeFormat(time) {
    return brewDate.timeFormat(time);
}

// get current lodgeId!
export function getLodgeId(){
  return storage.getStorage("loggedInID");
}

// Get GST mode, If its inclusive it will return false else true.
export function getIsExclusive(){
  return JSON.parse(getStorage('isExclusive'));
};

// Convert mm/dd/yyy intp dd/mm/yyyy
export function convertFormat(date){
  try{
    const result = date.split("/");
    return `${result[0]}/${result[1]}/${result[2]}`
  } catch(err){
    return date;
  }
}

// Convert date into server readable format!
export function convertServerFormat(date){
  try{
    const result = date.split("/");
    return `${result[2]}/${result[0]}/${result[1]}`
  } catch(err){
    return date;
  }
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

// Get custom style based on the state value!
export function getStyle(status){
  return{
    width: status?.width,
    marginBottom: status?.marginBottom,
    marginRight: status?.marginRight,
    paddingRight: status?.paddingRight,
    paddingLeft: status?.paddingLeft,
    paddingTop: status?.paddingTop,
    paddingBottom: status?.paddingBottom,
    color: status?.color,
    fontSize: status?.fontSize,
    border: status?.border,
    backgroundColor: status?.backgroundColor,
    cursor: status?.cursor,
    float: status?.float,
    zIndex: status?.zIndex
  }
}

// Get time and date for the current date!
export function getTimeDate(){
  const current = new Date();
  const getDate = `${current.getFullYear()}/${current.getMonth() + 1}/${current.getDate()}`;
  const getTime = brewDate.timeFormat(current.getHours() + ":" + current.getMinutes());
  return {getTime, getDate}
}

// Convert date into custom format!
export function formatDateToCustomFormat(date){
  return brewDate.formatDateToCustomFormat(date)
}

// Convert custom format into date format!
export function formatCustomIntoDateFormat(date, time){
  return brewDate.formatCustomDateToDateFormat(date, time)
};

// Default constants of status color code!
export function getStatusCodeColor(currentStatusCode){
  var statusCode = {
    'afterCheckedout' : 'red',
    'inCleaning': 'blue',
    'afterCleaned': 'black',
    'afterCheckin': 'green'
  };
  
  return statusCode[currentStatusCode];
};

// Default room status constants!
export function getRoomStatusConstants(){
  return ['afterCheckedout', 'inCleaning', 'afterCleaned', 'afterCheckin'];
}

// Format date!
export function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('/');
};

// Determine GST!
export function determineGSTPercent(price){
  return price > 7500 ? 0.18 : 0.12;
};

// Get greetings!
export function getGreetings(){
  // Get the current date and time
  const now = new Date();
  const hour = now.getHours();

  // Determine if it's morning or evening
  if (hour >= 0 && hour < 12) {
    return 'Good morning'
  } else if (hour >= 12 && hour < 17) {
    return 'Good afternoon'
  } else {
    return 'Good evening'
  }
};

// Refresh the page!
export function refreshPage(){
  window.location.reload();
};