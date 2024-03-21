const axios = require("axios");
const Variables = require("../../Variables");
const userUtils = require("../../common.functions/common.functions");

// Get account details!
export async function getAccountDetails(data){
  const result = await axios.get(`${Variables.Variables.hostId}/${data.lodge}/getlogins`, data)
  return result;
}

// Add new account details!
export async function addAccount(data){
  const result = await axios.post(`${Variables.Variables.hostId}/${data.lodge}/addmultiplelogin`, data);
  return result;
}

// Delete multiple logins at once!
export async function deleteMultiple(data){
  const result = await axios.post(`${Variables.Variables.hostId}/${data.lodge}/multiplelogindelete`, data);
  return result;
}

// Edit single logins!
export async function editLogins(data){
  const result = await axios.post(`${Variables.Variables.hostId}/${data.lodge}/editlogins`, data);
  return result;
}