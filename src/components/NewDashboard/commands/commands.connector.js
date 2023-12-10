import CheckoutUtils from "../property.container/checkout.view/checkout.form.utils";
const axios = require('axios');
const Variables = require('../../Variables');

class CommandsConnector {
    constructor() {
        // All those methods here would be static methods.
    };

    // Export to excel connector.
    static async onExportToExcel(options){
        return await axios.post(`${Variables.Variables.hostId}/${options.lodgeId}/exporttocsv`, options);
    };

    static async _getCustomHTMLContent(options){
        var checkoutUtils = new CheckoutUtils(options);
        return await checkoutUtils._getHTMLContent(options);
    };
};

export default CommandsConnector;