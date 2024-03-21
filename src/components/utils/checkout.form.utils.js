import CollectionInstance from "../../global.collection/widgettile.collection/widgettile.collection";
import {checkoutFormValue} from "./checkin.form.utils";
import {filterKeysInArr} from "../common.functions/node.convertor";
import CommandsConnector from "../NewDashboard/commands/commands.connector";
const axios = require('axios');
const Variables = require("../Variables");

class CheckoutUtils {
    
  constructor(options){
    this.options = options;
    this.baseUrl = Variables.Variables.hostId + "/" + options.accId;
  };

  // Get dynamic HTML content.
  _getHTMLContent(options) {
    return CommandsConnector.fetchCustomHTMLConfiguredTemplate(options).then((result) => {
      return result;
    });
  };

  // Fetch customer details!
  async fetchUserDetails(options){
    var data = {roomid: options.roomid, isHourly: options.isHourly, stayeddays: options.stayeddays}; // Corrected 'stayeddayes' to 'stayeddays'
    return await axios.post(`${this.baseUrl}/userroom`, data);
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
    data.lodgeId = this.options.accId;
    var result = await checkoutFormValue(data);
    return result;
  };
  
  // Add new log entry!
  async addNewLog(options){
    var result = await axios.post(`${this.baseUrl}/addnewentry`, options);
    return result;
  };
  
  // Fetch user defined maintainance log type!
  async fetchMaintainanceLogType(){
    var result = await axios.get(`${this.baseUrl}/getmaintainancelogtype`);
    if(result.data.status){
      var filteredKeys = filterKeysInArr(result.data.data, ['value']);
      CollectionInstance.setCollections('maintainanceLogType', filteredKeys);
      return filteredKeys;
    };
  };
  
};

export default CheckoutUtils