import CollectionInstance from '../../../../global.collection/widgettile.collection/widgettile.collection';
import { checkoutFormValue } from "../checkin.view/checkin.form.utils";
import { filterKeysInArr } from '../../../common.functions/node.convertor';
const axios = require('axios');
const Variables = require("../../../Variables");
const _ = require('lodash');

class CheckoutUtils {
    
  constructor(options){
    this.options = options;
    this.baseUrl = Variables.Variables.hostId + "/" + options.accId;
  };

  // Get dynamic HTML content.
  _getHTMLContent(options) {
    var filePath = options.filepath !== undefined ? options.filepath : 'DynamicHTMLContent';
    return fetch(`${this.baseUrl}/${filePath}/${options.filename}`)
        .then(response => {
          if (!response.ok) {
            // Check for HTTP errors (status code outside the range 200-299)
            return false;
          }
          return response.text();
        });
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