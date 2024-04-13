import {getStorage} from "../../Controller/Storage/Storage";
import {getParsedUrl} from "./node.convertor";
const brewDate = require("brew-date");
const storage = require("../../Controller/Storage/Storage")

// get current lodgeId!
export function getLodgeId(){
  var lodgeId = storage.getStorage("loggedInID");
  return lodgeId.split('-')[0];
}

// Get GST mode, If its inclusive it will return false else true.
export function getIsExclusive(){
  return JSON.parse(getStorage('isExclusive'));
};

// Convert date into server readable format!
export function convertServerFormat(date){
  try{
    const result = date.split("/");
    return `${result[2]}/${result[1]}/${result[0]}`
  } catch(err){
    return date;
  }
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

// Check for secure connections.
export function _checkForSecureConnections(){
  var localServer = 'localhost';
  return getParsedUrl().hostname === localServer;
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