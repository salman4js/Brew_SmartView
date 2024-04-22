import React from 'react';
import _ from "lodash";
import CustomModal from "../../fields/customModalField/custom.modal.view";
import PanelItemView from "../../SidePanelView/panel.item/panel.item.view";
import CollectionView from "../../SidePanelView/collection.view/collection.view";
import CommonUtils from "../common.crud.controller/common.crud.controller";
import CollectionInstance from "../../../global.collection/widgettile.collection/widgettile.collection";
import sidepanelConstants from "./sidepanel.container.constants";
import MetadataFieldTemplateState from "../../fields/metadata.field.templatestate";
import MetadataFields from "../../fields/metadata.fields.view";
import dialogCreateOptions from "../dialogs/table.create.action/table.create.action.settings.dialog.options";
import {nodeConvertor, validateFieldData} from "../../common.functions/node.convertor";
import {activityLoader} from "../../common.functions/common.functions.view";
import dialogEditOptions from "../dialogs/table.edit.action/table.edit.action.settings.dialog.options";

class SidepanelContainerRoomListView extends React.Component {
    constructor(props) {
        super(props);
        this.options = this.props.options;
        this.state = {
            customModal: undefined,
            isLoading: false,
            selectedItem: [],
            metadataFields: []
        }
    };

    _updateComponentState(options){
      this.setState({[options.key]: options.value});
    };

    getSelectedItem(){
        return this.state.selectedItem.length > 0 ? this.state.selectedItem : ([this.props.options.adminAction?.roomTypeModelId || this.collection[0]._id]);
    };

    _getRoomListCollection(){
        this.collection = CollectionInstance.getCollections('roomTypes').data;
    };

    onCloseCustomModal(){
        this.state.customModal.show = false;
        this._updateComponentState({key: 'customModal', value: this.state.customModal});
    };

    _toggleLoader(val){
      this.state.isLoading = val;
      this._updateComponentState({key: 'isLoading', value: this.state.isLoading});
    };

    onCreateNewTypeModel(){
        validateFieldData(this.state.metadataFields, (updatedData) => this._updateComponentState({key:'metadataFields', value: updatedData})).then((isValid) => {
            if(isValid.length === 0){
                this.onCloseCustomModal();
                this._toggleLoader(true);
                var fieldData = {
                    data: nodeConvertor(this.state.metadataFields),
                    accInfo: this.options.params.accIdAndName,
                    widgetName: 'roomTypeAction',
                    method: 'post'
                };
                CommonUtils.dispatchRequest(fieldData).then((res) => {
                   if(res.data.statusCode === 201 && res.data.success){
                       this.collection.push(res.data.result);
                       CollectionInstance.addToCollections('roomTypes', res.data.result);
                       this._toggleLoader(false);
                   }
                }).catch((err) => {
                    console.warn('Error occurred while creating new room type model', err);
                })
            }
        });
    };

    onEditRoomTypeModel(model){
        this._toggleLoader(true);
        this.onCloseCustomModal();
        var options = {
            data: nodeConvertor(this.state.metadataFields),
            widgetName: 'roomTypeAction',
            selectedNodes: model._id,
            accInfo: this.options.params.accIdAndName,
            method: 'patch'
        };
        CommonUtils.dispatchRequest(options).then((result) => {
            if(result.data.statusCode === 200 && result.data.success){
                var indexToUpdate = _.findIndex(this.collection, (model) => {
                   return model._id === options.selectedNodes;
                });
                if(indexToUpdate !== -1){
                    _.assign(this.collection[indexToUpdate], result.data.result);
                    CollectionInstance.updateCollections('roomTypes', this.collection);
                }
            }

            this._toggleLoader(false);
        }).catch((err) => {
            console.warn('Error occurred while updating the room type collections', err);
        });
    };

    populateCreateNewTypeMetadataFields(){
        var fields = dialogCreateOptions['roomTypeAction']();
        this._updateComponentState({key: 'metadataFields', value: fields});
    };

    populateEditTypeMetadataFields(options){
      var fields = dialogEditOptions['roomTypeAction'](options);
      this._updateComponentState({key: 'metadataFields', value: fields});
    };

    populateCustomModal(options){
        const customModalProps = _.clone(MetadataFieldTemplateState.customModal);
        customModalProps.show = true;
        customModalProps.onHide = () => this.onCloseCustomModal();
        customModalProps.restrictBody = false;
        customModalProps.showBodyItemView = () => this.showBodyItemView();
        customModalProps.header = options.header;
        customModalProps.footerEnabled = true;
        customModalProps.footerButtons = options.footerButtons;
        this._updateComponentState({key: 'customModal', value: customModalProps});
    };

    _createNewType(){
        var customModalOptions = {
            header: sidepanelConstants.ROOM_TYPE_CREATION.dialogOptions.header,
            footerButtons:  [
                {
                    btnId: sidepanelConstants.ROOM_TYPE_CREATION.footerButtons.primaryBtn,
                    variant: 'success',
                    onClick: () => this.onCreateNewTypeModel()
                }
            ]
        }
        this.populateCustomModal(customModalOptions);
        this.populateCreateNewTypeMetadataFields();
    };

    onSelectType(id){
        this.state.selectedItem.push(id);
        this._updateComponentState({key: 'selectedItem', value: this.state.selectedItem});
        this.options.dashboardController({isAdminAction: true,
        adminAction: {roomTypeModelId: this.state.selectedItem[this.state.selectedItem.length - 1]}})
    };

    _renderRoomListView(){
        return this.collection.map((options) => {
            return (
                <PanelItemView data = {options.suiteType} _id = {options._id} showIndentationArrow = {true}
                showInlineMenu = {true} customInlineMenu = {true}
                onMouseOverInlineAction = {true}  onClick = {(id) => this.onSelectType(id)} selectedItem = {this.getSelectedItem()}
                _renderCustomInlineMenu = {() => this._renderCustomInlineMenu(options)}/>
            )
        });
    };

    onToggleInlineMenu(options, e){
        e && e.stopPropagation();
        var customModalOptions = {
            header: sidepanelConstants.ROOM_TYPE_UPDATE.dialogOptions.header,
            footerButtons:  [
                {
                    btnId: sidepanelConstants.ROOM_TYPE_UPDATE.footerButtons.primaryBtn,
                    variant: 'success',
                    onClick: () => this.onEditRoomTypeModel(options)
                }
            ]
        };
        this.populateCustomModal(customModalOptions);
        this.populateEditTypeMetadataFields(options);
    };

    _renderCustomInlineMenu(options){
        return (
            <span className = 'inline-menu' onClick = {(e) => this.onToggleInlineMenu(options, e)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        className="bi bi-pencil-square" viewBox="0 0 16 16">
                    <path
                        d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                    <path fill-rule="evenodd"
                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                </svg>
            </span>
        )
    };

    showBodyItemView() {
        return <MetadataFields data={this.state.metadataFields} updateData={(updatedData) => this._updateComponentState({key: 'metadataFields', value: updatedData})}/>
    };

    _renderRoomListCollectionPanel() {
        let roomActionListCollection = Object.keys(sidepanelConstants.roomActionCollection);
        if (!this.state.isLoading) {
            return roomActionListCollection.map((roomActionCollection) => {
                return (
                    <CollectionView data={sidepanelConstants.roomActionCollection[roomActionCollection].value} ignoreTreePref = {true}
                    options = {{isExpanded: true, showInlineMenu: true, onMouseOverInlineAction: true, inlineAction: () => this._createNewType()}}
                    showCollectionChildView = {() => this._renderRoomListView()}/>
                )
            });
        } else {
            var opts = {
                color: 'black',
                marginTop: this.options.height / 2,
                textCenter: true
            }
            return activityLoader(opts);
        }
    };

    _renderCustomModal(){
      return <CustomModal modalData = {this.state.customModal}/>
    };

    templateHelpers(){
        this._getRoomListCollection();
        return this._renderRoomListCollectionPanel();
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

export default SidepanelContainerRoomListView;