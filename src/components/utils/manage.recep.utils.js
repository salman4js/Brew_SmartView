const axios = require("axios");
const Variables = require("../Variables");

// Get account details!
export async function getAccountDetails(options){
  return await axios.get(`${Variables.Variables.hostId}/${options.accId}/getlogins`);
}

// Add new account details!
export async function addAccount(data){
  return await axios.post(`${Variables.Variables.hostId}/${data.lodge}/addmultiplelogin`, data);
}

// Delete multiple logins at once!
export async function deleteMultiple(data){
  return await axios.post(`${Variables.Variables.hostId}/${data.lodge}/multiplelogindelete`, data);
}

// Edit single logins!
export async function editLogins(data){
  return await axios.post(`${Variables.Variables.hostId}/${data.lodge}/editlogins`, data);
}