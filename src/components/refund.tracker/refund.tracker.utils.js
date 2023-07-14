const axios = require("axios");
const Variables = require("../Variables");

// Get all refund tracker data for the specific lodge!
export async function getRefundTrackerList(lodgeId, data){
  const refundTracker = await axios.post(`${Variables.Variables.hostId}/${lodgeId}/getrefundtracker`, data)
  return refundTracker;
}