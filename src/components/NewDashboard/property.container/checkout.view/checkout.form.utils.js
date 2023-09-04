const axios = require('axios');
const Variables = require("../../../Variables");

class CheckoutUtils {
    
  constructor(options){
    this.baseUrl = Variables.Variables.hostId + "/" + options.accId;
  };
  
  async fetchUserDetails(options){
    var data = {roomid: options.roomid, isHourly: options.isHourly, stayeddays: options.stayeddays}; // Corrected 'stayeddayes' to 'stayeddays'
    const result = await axios.post(`${this.baseUrl}/userroom`, data);
    return result;
  };
  
  async fetchBillingDetails(options){
    var data = {roomtype: options.roomtype, 
      stayeddays: options.stayeddays, 
      roomid: options.roomid, lodgeid: options.lodgeid, 
      isHourly: options.isHourly, extraCalc: options.extraCalc};
    var result = await axios.post(`${this.baseUrl}/generatebill`, data);
    return result;
  };
  
}

module.exports = CheckoutUtils;
