import connector from "../utils/connector";;
const Variables = require('../Variables');

class LogTableUtils {
  
  constructor(options){
    this.baseUrl = Variables.Variables.hostId + "/" + options.accId;
    this.userId = options.userId;
  };
  
  // Fetch log table data!
  async fetchLogTableData(){
    return await connector.get(`${this.baseUrl}/${this.userId}/getallentries`);
  };
  
};

export default LogTableUtils;