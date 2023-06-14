const axios = require("axios");
const Variables = require("../Variables")

// Get vouchers list
async function getVouchersList(lodgeId){
  const vouchersList = await axios.get(`${Variables.Variables.hostId}/${lodgeId}/getvouchers`);
  return vouchersList;
}

module.exports = {
  getVouchersList
}