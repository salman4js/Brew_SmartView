import CollectionInstance from '../../../global.collection/widgettile.collection/widgettile.collection';
const axios = require("axios");
const brewDate = require('brew-date');
const Variables = require("../../Variables");

// Check if the widget tile collections are already fetched!
export async function fetchWidgetTilePref(options){
  
};

// Get rooms list!
export async function getRoomList(lodgeId, options){
  var fetchedCollection;
  // Default access token params!
  var params = {
    headers: {
        "x-access-token": localStorage.getItem("token"),
    }
  };
  var resultData = await axios.post(`${Variables.Variables.hostId}/${lodgeId}/false/roomlodge`, params);
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