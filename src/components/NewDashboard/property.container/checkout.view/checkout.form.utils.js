const axios = require('axios');
const Variables = require("../../../Variables");

class CheckoutUtils {
    
  constructor(options){
    this.baseUrl = Variables.Variables.hostId + "/" + options.accId;
  };
  
  // Fetch customer details!
  async fetchUserDetails(options){
    var data = {roomid: options.roomid, isHourly: options.isHourly, stayeddays: options.stayeddays}; // Corrected 'stayeddayes' to 'stayeddays'
    const result = await axios.post(`${this.baseUrl}/userroom`, data);
    return result;
  };
  
  // Fetch customer billing details!
  async fetchBillingDetails(options){
    var data = {roomtype: options.roomtype, 
      stayeddays: options.stayeddays, 
      roomid: options.roomid, lodgeid: options.lodgeid, 
      isHourly: options.isHourly, extraCalc: options.extraCalc};
    var result = await axios.post(`${this.baseUrl}/generatebill`, data);
    return result;
  };
  
  // Checkout API!
  async onCheckout(data){
    var result = await axios.post(`${this.baseUrl}/deleteuser`, data);
    return result;
  };
  
}

module.exports = CheckoutUtils;
