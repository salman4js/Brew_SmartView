import TableView from "../table.view/table.view";
import voucherTableWrapperConstants from "./voucher.table.wrapper.constants";
import CollectionInstance from "../../../../global.collection/widgettile.collection/widgettile.collection";
import {getVoucherModelList} from "../../../vouchers/vouchers.utils";

class VoucherTableWrapper extends TableView {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            metadataTableState: {
                cellValues: undefined,
                headerValue: undefined,
                infoMessage: voucherTableWrapperConstants.tableInfoMessage.ZERO_STATE_MESSAGE,
                tableLoader: true,
                selectedRoomId: undefined,
                isCheckboxSelected: false,
                enableCheckbox: false,
                checkbox: [
                    {
                        select: (value, checkBoxIndex) => this._updateCheckboxSelection(value, checkBoxIndex),
                        value: false,
                        attribute: "checkBoxField",
                        enableCellCheckbox: true,
                        enableHeaderCheckbox: true,
                        selectedCheckboxIndex: []
                    }
                ],
                tableCellWidth : "590px",
                showPanelField: false
            },
        }
        this.voucherModelFetched = false;
        this.params = this.props.params;
    };

    getFirstVoucherModelDetails(){
      var voucherModels = CollectionInstance.getModel('widgetTileCollections', 'voucherModelList');
      return voucherModels[0];
    };

    getTableHeaders() {
      this._getRoomConstantKey();
      this.state.metadataTableState.headerValue = this.voucherTableHeaders;
    };

    async fetchVoucherDetails(modelDetails){
        var result = await getVoucherModelList({lodgeId: this.params.accIdAndName[0], voucherId: modelDetails._id});
        if(result.data.success){
            this.currentVoucherDetails = result.data.message;
            this.voucherTableHeaders = result.data.tableHeaders;
            this.voucherModelFetched = true;
        }
    };

    async setExpandedTableView(){
      // Get the first voucher model id from the collection instance,
      // Load the table view part of the voucher model.
      var firstVoucherModel = this.getFirstVoucherModelDetails();
      !this.voucherModelFetched && await this.fetchVoucherDetails(firstVoucherModel);
      return this.currentVoucherDetails;
    };
}

export default VoucherTableWrapper;