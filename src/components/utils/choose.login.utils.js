import connector from "../utils/connector";
const Variables = require("../Variables")


// Multiple loginAs call!
export async function loginAs(fieldData){
  return await connector.post(`${Variables.Variables.hostId}/${fieldData.lodge}/loginas`, fieldData);
}