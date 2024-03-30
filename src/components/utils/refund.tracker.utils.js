import connector from "../utils/connector";
const Variables = require("../Variables");

// Get all refund tracker data for the specific lodge!
export async function getRefundTrackerList(lodgeId, data){
  return await connector.post(`${Variables.Variables.hostId}/${lodgeId}/getrefundtracker`, data);
}

// Update refund percentage!
export async function updateRefundPercentage(lodgeId, data){
  return await connector.post(`${Variables.Variables.hostId}/${lodgeId}/updaterefundpercentage`, data);
}