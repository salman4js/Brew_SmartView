const axios = require('axios');
const Variables = require("../../../Variables");
const _ = require('lodash');

class LogTableUtils {
  
  constructor(options){
    this.baseUrl = Variables.Variables.hostId + "/" + options.accId;
    this.userId = options.userId;
  };
  
  // Fetch log table data!
  async fetchLogTableData(){
    var result = await axios.get(`${this.baseUrl}/${this.userId}/getallentries`);
    return result;
  };
  
};

export default LogTableUtils;