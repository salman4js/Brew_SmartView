import TableView from "../table.view/table.view";
import voucherTableWrapperConstants from "./voucher.table.wrapper.constants";
import CollectionInstance from "../../../../global.collection/widgettile.collection/widgettile.collection";
import {getVoucherModelList} from "../../../vouchers/vouchers.utils";

class VoucherTableWrapper extends TableView {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                vouchersModelId: undefined
            },
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
            customModal: {
                show: false,
                onHide: this.onCloseCustomModal.bind(this),
                header: undefined,
                centered: true,
                restrictBody: true,
                customComponent: undefined,
                showBodyItemView: undefined,
                modalSize: "medium",
                footerEnabled: false,
                footerButtons: undefined
            },
        }
        this.voucherModelFetchStarted = false;
        this.params = this.props.params;
        this.getPaginationCountFromCurrentCollection = true;
    };

    getFirstVoucherModelsId(){
      var voucherModels = CollectionInstance.getModel('widgetTileCollections', 'voucherModelList');
      return voucherModels[0]._id;
    };

    getTableHeaders() {
      this._getRoomConstantKey();
      this.state.metadataTableState.headerValue = this.voucherTableHeaders;
    };

    async fetchVoucherDetails(voucherModelId){
        this.voucherModelFetchStarted = true;
        if(!voucherModelId){
            this.currentVoucherDetails = [];
            this.voucherTableHeaders = [];
        } else {
            const result = await getVoucherModelList({lodgeId: this.params.accIdAndName[0], voucherId: voucherModelId});
            if(result.data.success){
                this.templateHelpersData.options.eventHelpers.dashboardController({queryParams: [{key: 'widgetObjectId', value: voucherModelId}]});
                this.currentVoucherDetails = result.data.message;
                this.voucherTableHeaders = result.data.tableHeaders;
                this._toggleTableLoader(false);
            }
        }
    };

    async setExpandedTableView(){
      // Get the first voucher model id from the collection instance,
      // Load the table view part of the voucher model.
      var voucherModelId = this.state.data?.vouchersModelId;
      if(!voucherModelId){
          voucherModelId = this.getFirstVoucherModelsId();
      }
      !this.voucherModelFetchStarted && await this.fetchVoucherDetails(voucherModelId);
      return this.currentVoucherDetails;
    };

    // Update the component state with newly added value!
    _updateStateValue(updatedValue){
        this.setState({data: updatedValue}, () => {
            this._toggleTableLoader(true, true);
            this.voucherModelFetchStarted = false;
        });
    };

    componentDidUpdate(){
        if(this.state.data.vouchersModelId !== this.props.data.vouchersModelId){
            this._updateStateValue({vouchersModelId: this.props.data.vouchersModelId});
        }
    };
}

export default VoucherTableWrapper;