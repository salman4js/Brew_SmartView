const axios = require("axios");
const Variables = require("../Variables");

// Move the room status to the next state!
export async function moveToNextState(data){
  const result = await axios.post(`${Variables.Variables.hostId}/${data.lodgeId}/movetonextstate`, data);
  return result
}

// Get all the room state for the particular lodge!
export async function getRoomStatus(lodgeId){
  const result = await axios.get(`${Variables.Variables.hostId}/${lodgeId}/getallroomstatus`);
  return result
}

// Add new room state!
export async function addRoomStatus(data){
  const result = await axios.post(`${Variables.Variables.hostId}/${data.lodgeId}/addroomstatus`, data);
  return result
}