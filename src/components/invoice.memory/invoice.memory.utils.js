const axios = require("axios");
const Variables = require("../Variables")


export async function getInvoiceMemory(lodgeId){
  const result = await axios.get(`${Variables.Variables.hostId}/${lodgeId}/getinvoicememory`)
  return result
}