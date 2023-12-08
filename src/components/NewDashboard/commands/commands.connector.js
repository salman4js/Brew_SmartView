const axios = require('axios');
const Variables = require('../../Variables')

class CommandsConnector {
    constructor() {
        // All those methods here would be static methods.
    };

    // Export to excel connector.
    static async onExportToExcel(options){
        var result = await axios.post(`${Variables.Variables.hostId}/${options.lodgeId}/exporttocsv`, options);
        return result;
    };
};

export default CommandsConnector;