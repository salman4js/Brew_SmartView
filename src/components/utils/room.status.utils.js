import connector from "../utils/connector";
const Variables = require("../Variables");

// Move the room status to the next state!
export async function moveToNextState(data){
  return await connector.post(`${Variables.Variables.hostId}/${data.lodgeId}/movetonextstate`, data)
}

// Get all the room state for the particular lodge!
export async function getRoomStatus(lodgeId){
  return await connector.get(`${Variables.Variables.hostId}/${lodgeId}/getallroomstatus`)
}

// Add new room state!
export async function addRoomStatus(data){
  return await connector.post(`${Variables.Variables.hostId}/${data.lodgeId}/addroomstatus`, data)
}