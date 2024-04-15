import TableView from "../table.view/table.view";
import voucherTableWrapperConstants from "./voucher.table.wrapper.constants";
import CollectionInstance from "../../../../global.collection/widgettile.collection/widgettile.collection";
import {getVoucherModelList} from "../../../utils/vouchers.utils";
import _ from "lodash";
import tableViewConstants from "../table.view/table.view.constants";

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
                enableCheckbox: true,
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
        this.params = this.props.params;
        this.getPaginationCountFromCurrentCollection = true;
    };

    getFirstVoucherModelsId(){
      var voucherModels = CollectionInstance.getModel('widgetTileCollections', 'voucherModelList');
      if(voucherModels[0] !== undefined){
          return voucherModels[0]._id;
      }
    };

    // Check if the current table mode is enabled for create operation.
    checkForTableCreateMode(){
        var voucherModelId = this.getFirstVoucherModelsId();
        return this.roomConstant && voucherModelId && tableViewConstants.tableCreateMode.tableCreateModeAllowedKeys.includes(this.roomConstant);
    };

    getTableHeaders() {
      this._getRoomConstantKey();
      this.state.metadataTableState.headerValue = this.voucherTableHeaders;
      return this.state.metadataTableState.headerValue;
    };

    async fetchVoucherDetails(voucherModelId){
        this.voucherModelFetchStarted = true;
        if(!voucherModelId){
            this.currentVoucherCollections = [];
            this.voucherTableHeaders = [];
        } else {
            const result = await getVoucherModelList({lodgeId: this.params.accIdAndName[0], voucherId: voucherModelId});
            if(result.data.success){
                this.templateHelpersData.options.eventHelpers.dashboardController({queryParams: [{key: 'widgetObjectId', value: voucherModelId}]});
                this.currentVoucherCollections = result.data.message;
                this.voucherTableHeaders = result.data.tableHeaders;
                this._toggleTableLoader(false);
            }
        }
    };

    addIntoTableCollection(locallyCreatedModel) {
      const isCreatedModelAlreadyExists = _.filter(this.currentVoucherCollections, function(model){
          return model._id === locallyCreatedModel._id;
      });
      if(isCreatedModelAlreadyExists.length === 0){
          this.currentVoucherCollections.push(locallyCreatedModel);
      }
    };

    removeFromTableCollection(selectedVoucherModelIds) {
        _.remove(this.currentVoucherCollections, function(model){
           return selectedVoucherModelIds.includes(model._id);
        });
    };

    updateModelFromTableCollection(updatedVoucherModel){
        var indexToUpdate = _.findIndex(this.currentVoucherCollections, function(model){
           return model._id === updatedVoucherModel._id;
        });
        if(indexToUpdate !== -1){
            _.assign(this.currentVoucherCollections[indexToUpdate], updatedVoucherModel);
        }
    };

    _getVoucherModelId(){
        var voucherModelId = this.state.data?.vouchersModelId || this.props.data?.vouchersModelId;
        if(!voucherModelId){
            voucherModelId = this.getFirstVoucherModelsId();
        }
        return voucherModelId;
    };

    async setExpandedTableView(){
      // Get the first voucher model id from the collection instance,
      // Load the table view part of the voucher model.
      var voucherModelId = this._getVoucherModelId();
      !this.voucherModelFetchStarted && await this.fetchVoucherDetails(voucherModelId);
      return this.currentVoucherCollections;
    };

    addExtraParams(options){
        options.data['voucherId'] = this._getVoucherModelId();
    };

    prepareTemplateHelpersData() {
        super.prepareTemplateHelpersData();
        this.templateHelpersData.options.eventHelpers['extraParams'] = (options) => this.addExtraParams(options);
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