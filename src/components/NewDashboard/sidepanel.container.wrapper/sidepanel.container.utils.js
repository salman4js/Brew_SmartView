const axios = require('axios');
const Variables = require("../../Variables");

// Get available room types!
export async function getAvailableRoomTypes(lodgeId){
  const result = await axios.post(`${Variables.Variables.hostId}/${lodgeId}/allroomtype`);
  return result;
};