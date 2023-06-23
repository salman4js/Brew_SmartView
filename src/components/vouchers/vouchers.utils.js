const axios = require("axios");
const Variables = require("../Variables")

// Get vouchers list!
export async function getVouchersList(lodgeId){
  const vouchersList = await axios.get(`${Variables.Variables.hostId}/${lodgeId}/getvouchers`);
  return vouchersList;
}

// Add vouchers list!
export async function addVouchersList(lodgeId, data){
  data["lodge"] = lodgeId; // Adding lodge id to the field data.
  const result = await axios.post(`${Variables.Variables.hostId}/${lodgeId}/addvouchers`, data);
  return result
}

// get voucher model list1
export async function getVoucherModelList(lodgeId, data){
  const result = await axios.post(`${Variables.Variables.hostId}/${lodgeId}/getvouchermodel`, data) 
  return result;
}

// add voucher model list!
export async function addVoucherModelList(lodgeId, data){
  const result = await axios.post(`${Variables.Variables.hostId}/${lodgeId}/addvouchermodel`, data)
  return result;
}

// Get voucher model result based on the filter query!
export async function getFilteredModel(lodgeId, data){
  const result = await axios.post(`${Variables.Variables.hostId}/${lodgeId}/cheatcodefilter`, data)
  return result;
}

