import CollectionInstance from '../../../global.collection/widgettile.collection/widgettile.collection';
const axios = require("axios");
const brewDate = require('brew-date');
const Variables = require("../../Variables");

// Check if the widget tile collections are already fetched!
export async function fetchWidgetTilePref(lodgeId){
  // Get the options ready first!
  var datesBetweenCount = CollectionInstance.getModel('widgetTileCollections', 'datesBetweenCount');
  var options = {
    datesBetween: brewDate.getBetween(brewDate.getFullDate('yyyy/mm/dd'), brewDate.addDates(brewDate.getFullDate('yyyy/mm/dd'), datesBetweenCount))
  };
  // Check if the widget collection data already exists in collection instance!
  var widgetTileCollection = CollectionInstance.getCollections('widgetTileCollections');
  if(!widgetTileCollection){
    const result = await axios.post(`${Variables.Variables.hostId}/${lodgeId}/getwidgettilecol`, options);
    CollectionInstance.setCollections('widgetTileCollections', result.data.data);
  }
};

// Get rooms list!
export async function getRoomList(lodgeId, fetchPref){
  // Default access token params!
  var params = {
    headers: {
        "x-access-token": localStorage.getItem("token"),
    }
  };
  // Call the widget tile collection here!
  fetchPref && await fetchWidgetTilePref(lodgeId);
  var resultData = await axios.post(`${Variables.Variables.hostId}/${lodgeId}/false/roomlodge`, params);
  // Add the rooms list to the global collections!
  if(resultData.data.success){
    var roomListCollections = CollectionInstance.getCollections('roomsListCollection');
    if(!roomListCollections){
      CollectionInstance.setCollections('roomsListCollection', resultData.data.message);
    };
  };
  return resultData;
}

// Get payment tracker details for specific rooms!
export async function getPaymentTracker(lodgeId, data){
  const paymentTracker = await axios.post(`${Variables.Variables.hostId}/${lodgeId}/getpaymenttracker`, data);
  return paymentTracker;
}

// Get payment details for receipt generation!
export async function getPaymentDetails(lodgeId, data){
  const paymentDetails = await axios.post(`${Variables.Variables.hostId}/${lodgeId}/getpaymentdetails`, data);
  return paymentDetails;
}

// Delete single payment tracker instance!
export async function deletePaymentTracker(lodgeId, data){
  const paymentTracker = await axios.post(`${Variables.Variables.hostId}/${lodgeId}/deletesinglepayment`, data);
  return paymentTracker;
};

// Get all tha payment tracker regardless of the prebook and checkout status!
export async function getAllPaymentTracker(data){
  const paymentTracker = await axios.post(`${Variables.Variables.hostId}/${data.lodgeId}/getallpaymenttracker`, data);
  return paymentTracker;
}