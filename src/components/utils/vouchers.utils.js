const axios = require("axios");
const Variables = require("../Variables")

// Get vouchers list!
export async function getVouchersList(lodgeId){
  return await axios.get(`${Variables.Variables.hostId}/${lodgeId}/getvouchers`);
}

// Add vouchers list!
export async function addVouchersList(lodgeId, data){
  data["lodge"] = lodgeId; // Adding lodge id to the field data.
  return await axios.post(`${Variables.Variables.hostId}/${lodgeId}/addvouchers`, data)
}

// get voucher model list1
export async function getVoucherModelList(options){
  return await axios.get(`${Variables.Variables.hostId}/${options.lodgeId}/${options.voucherId}/getvouchermodel`);
}

// add voucher model list!
export async function addVoucherModelList(options){
  return await axios.post(`${Variables.Variables.hostId}/${options.lodgeId}/addvouchermodel`, options.data);
}

// Edit voucher model list!
export async function editVoucherModelList(options){
  return await axios.put(`${Variables.Variables.hostId}/${options.lodgeId}/editvouchermodel`, options.data);
}

// Get previous voucher model!
export async function getPrevVoucherModel(lodgeId, data){
  return await axios.post(`${Variables.Variables.hostId}/${lodgeId}/getprevvouchermodel`, data);
}

// Delete voucher model list!
export async function deleteVoucherModelList(lodgeId, data){
  return await axios.post(`${Variables.Variables.hostId}/${lodgeId}/deletevouchermodel`, data);
}

// Get voucher model result based on the filter query!
export async function getFilteredModel(lodgeId, data){
  return await axios.post(`${Variables.Variables.hostId}/${lodgeId}/cheatcodefilter`, data);
};

// Get net profit preview!
export async function getNetProfitPreview(data){
  return await axios.get(`${Variables.Variables.hostId}/${data.lodgeId}/${data.date}/getnetprofitpreview`, data);
}

