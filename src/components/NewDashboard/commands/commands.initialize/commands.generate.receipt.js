import axios from 'axios';
import lang from '../commands.constants';
import {getBaseUrl, formQueryParams, convertObjectValue} from "../../../common.functions/node.convertor";
import CollectionInstance from "../../../../global.collection/widgettile.collection/widgettile.collection";
import TableViewConstants from "../../property.container/table.view/table.view.constants";
const Variables = require('../../../Variables').default;

class CommandsGenerateReceipt {
    constructor(signatureOptions) {
      this.status = signatureOptions;
      this.isDisabled = this.enabled();
      this.defaults = {
        value: lang.GENERATE_RECEIPT.generateReceipt,
        disabled: this.isDisabled,
        onClick: () => this.execute()
      };
      this.baseUrl = {
          clientSide: getBaseUrl(),
          serverSide: Variables.hostId + "/" + this.status.params.accIdAndName[0]
      };
      this.receiptOptions = {};
    };

    enabled(){
        return !lang.isCommandsEnabled.generateReceipt.includes(this.status.roomConstantKey);
    };

    execute(){
        this.status.eventHelpers.triggerTableLoader(true, true);
        this.status.eventHelpers.updateCheckboxSelection(); // This will empty the checkboxSelection so when loader comes, commands will be disabled.
        this._fetchPaymentTrackerDetails().then(() => {
            // Open a new window for printing functionality!
            this._prepareQueryParamsOptions();
            this.windowPrint();
            this.status.eventHelpers.triggerTableLoader(false);
        });
    };

    // Prepare query params options!
    _prepareQueryParamsOptions(){
      var cellValues = '';
      this.receiptOptions.cellValues.map((val) => {
          cellValues += (JSON.stringify(val) + '--');
      });
      this.queryParamsOptions = {
          isQueryParams: true,
          isReceipt: true,
          tableCellWidth: '290px',
          customername: this.receiptOptions.customerDetails.customername || this.receiptOptions.customerDetails.username,
          phonenumber: this.receiptOptions.customerDetails.phonenumber,
          headerValue: this.receiptOptions.headerValue,
          cellValues: cellValues,
          totalAmount: this.receiptOptions.totalAmount
      };
    };

    // Window print for invoice and bill!
    windowPrint(){
        var queryParams = formQueryParams(this.queryParamsOptions);
        window.open(this.baseUrl.clientSide + '/windowprint' + "?" + queryParams); // This will open a new tab along with the all the data's
        // necessary for print the data in the url.
    };

    // Review server state data - this method will change the server data to the UI standard data. (For Example, Boolean values)
    _reviewServerData(serverData){
        var objRules = {
            true: 'Yes',
            false: 'No'
        };
        var convertedData = convertObjectValue(serverData, ['isPaid'], objRules);
        this.receiptOptions['cellValues'] = convertedData;
    };

    // Fetch payment tracker invoice details for selected nodes.
    _fetchPaymentTrackerDetails(){
       return new Promise((resolve, reject) => {
           this.fetchDataForNodes().then((result) => {
               if(result.data.status){
                   this._reviewServerData(result.data.cellValues);
                   this.receiptOptions['totalAmount'] = result.data.totalAmount;
                   this._getTableHeadersAndCustomerDetails(result.data);
                   resolve();
               }
           }).catch((err) => {
               // Fetching payment details for selected nodes fails
               reject();
           });
       });
    };

    // As of now, Fetch the table headers from the client side, later when the column customization introduced.
    // Get the table headers from the server side.
    _getTableHeadersAndCustomerDetails(result){
        this.receiptOptions['headerValue'] = TableViewConstants.PropertyStatusTableHeader[this.status.roomConstantKey];
        // Get the customer details through the userId only if the customerDetails is not present in the response.
        if(!result.customerDetails){
            // Get the userId from the cellValues and then get the customer details from the collection instance.
            var userId = result.cellValues[0].userId;
            this.receiptOptions['customerDetails'] = CollectionInstance.whereInCollections('userCollections',undefined, '_id', userId)[0];
        } else {
            this.receiptOptions['customerDetails'] = result.customerDetails;
        }
    };

    // Fetch data for selected nodes!
    async fetchDataForNodes(){
        var options = {nodes: this.status.nodes, widgetValue: this.status.roomConstantKey}
        var result = await axios.post(`${this.baseUrl.serverSide}/generatereceipt`, options);
        return result;
    };
}

export default CommandsGenerateReceipt;