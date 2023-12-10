import TableView from "../table.view/table.view";
import lang from './payment.tracker.wrapper.constants';
import {getPaymentTracker} from "../../../paymentTracker/payment.tracker.utils/payment.tracker.utils";

class PaymentTrackerWrapper extends TableView {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            metadataTableState: {
                cellValues: undefined,
                headerValue: undefined,
                infoMessage: lang.tableInfoMessage.ZERO_FILTER_MESSAGE,
                tableLoader: true,
                selectedRoomId: undefined,
                isCheckboxSelected: false,
                enableCheckbox: false,
                tableCellWidth : "590px",
                showPanelField: false,
            }
        };
        this.shouldFetch = true;
        this.params = this.props.params;
    };

    // This method handles extended functions from the table.view.
    async setExpandedTableView(){
        this.roomConstant = lang.tableInfoMessage.PROPERTY_STATUS_KEY; // this will be used when we're getting the required table data.
        // from the table.view.constants.
        this._prepareTableHeaderState();
        await this._prepareTableCellState();
        return this.paymentTrackerData;
    };

    // Prepare the metadata table header state!
    // Even though, getPaymentTracker method returns tableHeaders, We are aligning with table.view code alignment since we extended it for paymentTrackerView.
    _prepareTableHeaderState(){
      var tableHeaders = this.propertyStatusTableHeader[lang.tableInfoMessage.PROPERTY_STATUS_KEY];
      this.state.metadataTableState.headerValue = tableHeaders;
    };

    // Prepare the metadata table cell state!
    async _prepareTableCellState(){
      this.shouldFetch && await this.fetchPaymentTrackerData();
    };

    // Payment Tracker data has to be fetched from the server everytime the paymentTrackerView loads!
    async fetchPaymentTrackerData(){
        var paymentTrackerData = await getPaymentTracker(this.params.accIdAndName[0], {isPrebook: false, room: this.state.data.roomModel._id});
        // Even though, getPaymentTracker returns tableHeaders, We are aligning with table.view code alignment since we extended it for paymentTrackerView.
        if(paymentTrackerData.data.success){
            this.paymentTrackerData = paymentTrackerData.data.message;
            this._toggleTableLoader(false);
            this.shouldFetch = false;
        }
    };
}

export default PaymentTrackerWrapper;