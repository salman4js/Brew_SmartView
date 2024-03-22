const axios = require("axios");
const Variables = require("../Variables")


// Multiple loginAs call!
export async function loginAs(fieldData){
  return await axios.post(`${Variables.Variables.hostId}/${fieldData.lodge}/loginas`, fieldData);
}