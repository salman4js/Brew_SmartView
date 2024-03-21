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
export async function getVoucherModelList(options){
  const result = await axios.get(`${Variables.Variables.hostId}/${options.lodgeId}/${options.voucherId}/getvouchermodel`);
  return result;
}

// add voucher model list!
export async function addVoucherModelList(options){
  const result = await axios.post(`${Variables.Variables.hostId}/${options.lodgeId}/addvouchermodel`, options.data);
  return result;
}

// Edit voucher model list!
export async function editVoucherModelList(options){
  const result = await axios.put(`${Variables.Variables.hostId}/${options.lodgeId}/editvouchermodel`, options.data);
  return result;
}

// Get previous voucher model!
export async function getPrevVoucherModel(lodgeId, data){
  const result = await axios.post(`${Variables.Variables.hostId}/${lodgeId}/getprevvouchermodel`, data);
  return result;
}

// Delete voucher model list!
export async function deleteVoucherModelList(lodgeId, data){
  const result = await axios.post(`${Variables.Variables.hostId}/${lodgeId}/deletevouchermodel`, data);
  return result;
}

// Get voucher model result based on the filter query!
export async function getFilteredModel(lodgeId, data){
  const result = await axios.post(`${Variables.Variables.hostId}/${lodgeId}/cheatcodefilter`, data);
  return result;
};

// Get net profit preview!
export async function getNetProfitPreview(data){
  const result = await axios.get(`${Variables.Variables.hostId}/${data.lodgeId}/${data.date}/getnetprofitpreview`, data);
  return result;
}

