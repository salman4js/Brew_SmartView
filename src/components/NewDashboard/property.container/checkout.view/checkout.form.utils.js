import CollectionInstance from '../../../../global.collection/widgettile.collection/widgettile.collection';
import { filterKeysInArr } from '../../../common.functions/node.convertor';
const axios = require('axios');
const Variables = require("../../../Variables");
const _ = require('lodash');

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
    // First check if the data is in the collectionInstance of upcomingCheckout, If yes, remove the model!
    var userModel = CollectionInstance.getCollections('widgetTileCollections');
    var userModelExists = _.find(userModel.data.upcomingCheckout, function(obj){
      return obj._id === data.userid;
    });
    if(userModelExists){
      CollectionInstance.removeCollections('widgetTileCollections', userModelExists, 'upcomingCheckout');
    }
    var result = await axios.post(`${this.baseUrl}/deleteuser`, data);
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