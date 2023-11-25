const axios = require('axios');
const Variables = require('../../Variables');

class HistoryTableUtils {
    constructor(options) {
      this.baseUrl = Variables.Variables.hostId + '/' + options.accId;
    };

    async fetchHistoryRecord(options){
        return await axios.get(`${this.baseUrl}/userdb`, {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        });
    };
}

export default HistoryTableUtils;