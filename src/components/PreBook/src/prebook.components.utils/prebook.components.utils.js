const axios = require("axios");
const Variables = require("../../../Variables");

// Add refund amount into the refundTracker!
export async function addRefundTracker(data){
  const result = axios.post(`${Variables.Variables.hostId}/${data.lodge}/addrefundtracker`, data);
  return result;
}