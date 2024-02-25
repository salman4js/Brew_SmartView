import React from 'react';
import sidepanelConstants from "./sidepanel.container.constants";
import CollectionView from "../../SidePanelView/collection.view/collection.view";
import CollectionInstance from "../../../global.collection/widgettile.collection/widgettile.collection";
import PanelItemView from "../../SidePanelView/panel.item/panel.item.view";
import _ from "lodash";
import CustomModal from "../../CustomModal/custom.modal.view";
import MetadataFields from "../../fields/metadata.fields.view";
import {activityLoader} from "../../common.functions/common.functions.view";
import {nodeConvertor, validateFieldData} from "../../common.functions/node.convertor";
import {addVouchersList} from "../../vouchers/vouchers.utils";
import {_updateWidgetTileCount} from "../dashboard.utils.helper/form.utils.helper";

class SidepanelContainerVoucherTrackerView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            selectedItem: [],
            customModal: {
                // Values will be populated when new voucher model action is being triggered.
            },
            metadataFields: [
                {
                    value: undefined,
                    placeholder: sidepanelConstants.ADD_VOUCHER.dialogOptions.placeholder,
                    label: sidepanelConstants.ADD_VOUCHER.dialogOptions.label,
                    name: 'voucherName',
                    attribute: 'textField',
                    isRequired: true,
                    inlineToast: {
                        isShow: false,
                        inlineMessage: sidepanelConstants.ADD_VOUCHER.dialogOptions.alertMessage
                    }
                }
            ]
        };
        this.params = this.props.options.params;
    };

    _updateComponentState(options){
      this.setState({[options.key]: options.value}, () => {
          _.isFunction(options.nextFunc) && options.nextFunc();
      });
    };

    getVoucherModelFromCollection(){
        this.vouchersModel = CollectionInstance.getModel('widgetTileCollections', 'voucherModelList');
    };

    _updateVoucherInCollection(){
      CollectionInstance.updateModel('widgetTileCollections', 'voucherModelList', this.vouchersModel);
      _updateWidgetTileCount('voucherTracker', 'INC'); // Increment the count of the widgetTileModel.
    };

    async onCreateNewVoucherModel(){
        const isValid = await validateFieldData(this.state.metadataFields,
        (updatedData) => this._updateComponentState({key: 'metadataFields', value: updatedData}));
        if(isValid.length === 0){
            let fieldData = nodeConvertor(this.state.metadataFields);
            this._updateComponentState({key: 'isLoading', value: true, nextFunc: () => this.onCloseCustomModal()});
            var result = await addVouchersList(this.params.accIdAndName[0], fieldData);
            if(result.data.success){
                this.vouchersModel.push(result.data.voucher); // Add newly created voucher into the model.
                this._updateVoucherInCollection();
                this._updateComponentState({key: 'isLoading', value: false});
            }
        }
    };

    _createNewVoucherModel(){
        this.dialogOptions = {};
        this.dialogOptions.show = true;
        this.dialogOptions.onHide = () => this.onCloseCustomModal();
        this.dialogOptions.modalSize = "medium";
        this.dialogOptions.header = sidepanelConstants.ADD_VOUCHER.dialogOptions.header;
        this.dialogOptions.showBodyItemView = () => this.showBodyItemView();
        this.dialogOptions.restrictBody = false;
        this.dialogOptions.footerEnabled = true;
        this.dialogOptions.footerButtons = [
            {
                btnId: sidepanelConstants.ADD_VOUCHER.footerButtons.primaryBtn,
                variant: "success",
                onClick: () => this.onCreateNewVoucherModel()
            },
            {
                btnId: sidepanelConstants.ADD_VOUCHER.footerButtons.cancelBtn,
                variant: "secondary",
                onClick: () => this.onCloseCustomModal()
            }
        ]
        this._updateComponentState({key: 'customModal', value: this.dialogOptions});
    };

    showBodyItemView(){
        return <MetadataFields data = {this.state.metadataFields}
        updateData = {(updatedData) => this._updateComponentState({key: 'metadataFields', value: updatedData})} />
    };

    _renderCustomModal(){
        return <CustomModal modalData = {this.state.customModal} />
    };

    onCloseCustomModal(){
        this.state.customModal.show = false;
        this._updateComponentState({key: 'customModal', value: this.state.customModal});
    };

    panelItemOnClick(uId){
        // Update the selectedItem state.
        this.state.selectedItem.push(uId);
        var options = {key: 'selectedItem', value: this.state.selectedItem};
        this._updateComponentState(options);
        this.props.options.dashboardController({isVouchersModelSelectionUpdated: true, vouchersModelId: uId});
    };

    getSelectedItem(){
        return this.state.selectedItem.length > 0 ? this.state.selectedItem : ([this.props.options.lastSelectedVoucherId || this.vouchersModel[0]._id]);
    };

    voucherTrackerParentStruct(){
        let voucherListPanelCollectionView = Object.keys(sidepanelConstants.voucherListParentCollection);
        return voucherListPanelCollectionView.map((voucherCollection) => {
            return(
                <CollectionView data = {sidepanelConstants.voucherListParentCollection[voucherCollection].value} ignoreTreePref = {true}
                options = {{isExpanded: true, showInlineMenu: true, inlineAction: () => this._createNewVoucherModel()}}
                 showCollectionChildView = {() => this._renderPanelItemViewVoucherCollection(voucherCollection)}/>
            )
        });
    };

    _renderPanelItemViewVoucherCollection(voucherCollection){
        this.getVoucherModelFromCollection();
        if(sidepanelConstants.voucherListParentCollection[voucherCollection].data === sidepanelConstants.SIDE_PANEL_MODES.voucherList){;
            // Always the table data will show the first voucher tracker data's in the table so in the sidepanel first voucher tracker has to be selected.
            return this.vouchersModel.map((options) => {
                return(
                    <PanelItemView data = {options.voucherName} _id = {options._id} showIndentationArrow = {true} selectedItem = {this.getSelectedItem()}
                    onClick = {(uId) => this.panelItemOnClick(uId)} />
                )
            })
        } else {
            return this.props.options.roomTreeView();
        }
    };

    templateHelpers(){
      if(this.state.isLoading){
          var opts = { color: "black", marginTop: (this.props.options.height / 4) + "px", textCenter: true}
          return activityLoader(opts);
      } else {
          return this.voucherTrackerParentStruct();
      }
    };

    render(){
        return(
            <>
                {this.state.customModal?.show && this._renderCustomModal()}
                {this.templateHelpers()}
            </>
        )
    };
}

export default SidepanelContainerVoucherTrackerView;