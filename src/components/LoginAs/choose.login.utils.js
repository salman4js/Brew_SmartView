const axios = require("axios");
const Variables = require("../Variables")


// Multiple loginAs call!
export async function loginAs(fieldData){
  const result = await axios.post(`${Variables.Variables.hostId}/${fieldData.lodge}/loginas`, fieldData);
  return result;
}