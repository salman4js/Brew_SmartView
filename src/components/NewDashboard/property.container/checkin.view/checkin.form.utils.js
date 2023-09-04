const axios = require('axios');
const Variables = require("../../../Variables");

// Checkin form values!
export async function checkInFormValue(data){
  const result = await axios.post(`${Variables.Variables.hostId}/${data.lodgeId}/adduserrooms`, data);
  return result;
};
