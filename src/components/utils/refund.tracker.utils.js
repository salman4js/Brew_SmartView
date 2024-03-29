const axios = require("axios");
const Variables = require("../Variables");

// Get all refund tracker data for the specific lodge!
export async function getRefundTrackerList(lodgeId, data){
  return await axios.post(`${Variables.Variables.hostId}/${lodgeId}/getrefundtracker`, data);
}

// Update refund percentage!
export async function updateRefundPercentage(lodgeId, data){
  return await axios.post(`${Variables.Variables.hostId}/${lodgeId}/updaterefundpercentage`, data);
}