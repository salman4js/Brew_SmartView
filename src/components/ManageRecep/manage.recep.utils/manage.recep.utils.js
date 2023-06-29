const axios = require("axios");
const Variables = require("../../Variables")

// Get account details!
export async function getAccountDetails(data){
  const result = await axios.get(`${Variables.Variables.hostId}/${data.lodge}/getlogins`, data)
  return result;
}