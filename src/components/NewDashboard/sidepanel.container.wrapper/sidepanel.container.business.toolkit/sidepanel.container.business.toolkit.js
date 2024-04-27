import React from 'react';
import _ from "lodash";
import PanelItemView from "../../../SidePanelView/panel.item/panel.item.view";
import CollectionView from "../../../SidePanelView/collection.view/collection.view";
import MetadataFieldsView from "../../../fields/metadata.fields.view";
import CustomModal from "../../../fields/customModalField/custom.modal.view";
import {activityLoader} from "../../../common.functions/common.functions.view";
import CommonUtils from "../../common.crud.controller/common.crud.controller";
import MetadataFieldTemplateState from "../../../fields/metadata.field.templatestate";
import SidepanelContainerBusinessToolkitTemplate from "./sidepanel.container.business.toolkit.template";
import BusinessToolkitConstants from "./business.toolkit.constants";
import BusinessToolkitAvailableConfigList from "./business.toolkit.available.config.list";
import {nodeConvertor, validateFieldData} from "../../../common.functions/node.convertor";

class SidepanelContainerBusinessToolkit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isChildLoading: true,
            selectedItem: [],
            configLists: [],
            customModal: {
                show: false,
                centered: false,
                restrictBody: true,
                onHide: () => this._onCancelCustomModal()
            },
            metadataFields: undefined
        }
        this.options = this.props.options;
    };

    _updateComponentState(options){
      this.setState({[options.key]: options.value}, () => {
          _.isFunction(options.nextFunc) && options.nextFunc()
      })
    };

    _triggerCustomModal(options){
        this._updateComponentState({key: 'customModal', value: {...this.state.customModal, ...options}});
    };

    _createNewCustomConfig(){
        validateFieldData(this.state.metadataFields,
        (updatedData) => this._updateComponentState({key: 'metadataFields', value: updatedData})).then((isValid) => {
           if(isValid.length === 0){
               this._updateComponentState({key:'isChildLoading', value: true});
               this._triggerCustomModal({show: false})
               const fieldData = nodeConvertor(this.state.metadataFields);
               CommonUtils.dispatchRequest({
                   widgetName: this.currentConfigName,
                   accInfo: this.options.params.accIdAndName,
                   method: 'post',
                   data: fieldData
               }).then((response) => {
                   if(response.data.success){
                       this.state.configLists.push({value: this.currentConfigName,
                           result: [{configName: response.data?.result?.configName, _id: response.data?.result?._id}]});
                       this._triggerCustomModal({show: true, restrictBody: true, footerEnabled: false, centered: false,
                           header: BusinessToolkitConstants.modalOptions[this.currentConfigName].creationSuccess})
                   }
               }).catch((err) => {
                   this._triggerCustomModal({show: true, restrictBody: true, footerEnabled: false, centered: false,
                       header: err.response.data.message || BusinessToolkitConstants.modalOptions[this.currentConfigName].creationFailure});
               }).finally(() => {
                   this._updateComponentState({key:'isChildLoading', value: false});
               })
           }
        });
    };

    _onCancelCustomModal(){
        this.state.customModal.show = false;
        this._triggerCustomModal(this.state.customModal);
    };

    _showCustomModalBodyView(){
        return <MetadataFieldsView data = {this.state.metadataFields}
        updateData = {(updatedData) => this._updateComponentState({key: 'metadataFields', value: updatedData})}/>
    };

    _prepareCustomModalForConfigCreation(){
        const customModalTemplate = _.clone(MetadataFieldTemplateState.customModal),
            modalOptions = BusinessToolkitConstants.modalOptions[this.currentConfigName];
        customModalTemplate.show = true;
        customModalTemplate.header = modalOptions.header;
        customModalTemplate.showBodyItemView = () => this._showCustomModalBodyView();
        customModalTemplate.centered = modalOptions.centered;
        customModalTemplate.footerEnabled = true;
        customModalTemplate.footerButtons = modalOptions.footerButtons;
        customModalTemplate.footerButtons.map((buttons) => {
            buttons.onClick = () => this._createNewCustomConfig()
        });
        this._triggerCustomModal(customModalTemplate);
    };

    _metadataFieldsForConfigCreation(){
          this._updateComponentState({key: 'metadataFields', value: BusinessToolkitConstants.fieldOptions[this.currentConfigName]});
    };

    _triggerConfigCreationDialog(){
        this._prepareCustomModalForConfigCreation();
        this._metadataFieldsForConfigCreation();
    };

    fetchConfigListForSelection(configName){
        this.currentConfigName = configName;
        this.selectedConfigListFetching = true;
        CommonUtils.dispatchRequest({accInfo: this.options.params.accIdAndName,
            widgetName: configName, query: {fields: 'configName'}, method: 'get'}).then((res) => {
            if(res.data.success){
                if(res.data.result.length > 0){
                    this.state.configLists.push({value: configName, result: res.data.result});
                    this.pushIntoSelectedItems(res.data.result[0]._id);
                    this._updateComponentState({key: 'configLists', value: this.state.configLists});
                    this._informDashboardController(res.data.result[0]._id, configName);
                }
                this._updateComponentState({key: 'isChildLoading', value: false});
            }
        });
    };

    _informDashboardController(id, configName){
        this.options.dashboardController({isAdminAction: true, adminAction: {configName: configName,
        modelId: id}, queryParams: [{key: 'method', value: BusinessToolkitAvailableConfigList[configName].method}]});
    };

    pushIntoSelectedItems(id){
        this.state.selectedItem.push(id);
        this._updateComponentState({key: 'selectedItem', value: this.state.selectedItem});
    };

    onPanelItemClick(id) {
        this.pushIntoSelectedItems(id);
        this._informDashboardController(id, this.currentConfigName);
    };

    getSelectedItem(){
      return this.state.selectedItem;
    };

    _renderConfigNameLists(collection){
        return collection.map((model) => {
           return <PanelItemView data = {model['configName']} _id = {model._id} showIndentationArrow = {true}
           onClick = {(id) => this.onPanelItemClick(id)} selectedItem = {this.getSelectedItem()}/>
        });
    };

    _showSelectedConfigLists(){
      if(this.state.isChildLoading){
          return activityLoader({color: 'black', textCenter: true});
      } else {
        return this.state.configLists.map((configLists) => {
            if(configLists.value === this.currentConfigName){
               return this._renderConfigNameLists(configLists.result);
            }
        })
      }
    };

    _renderSelectedConfigLists(configName){
        !this.selectedConfigListFetching && this.fetchConfigListForSelection(configName);
        return this._showSelectedConfigLists();
    };

    _renderAvailableConfigLists(){
        return this.availableConfigList.map((configListName) => {
            return(
                <CollectionView data = {BusinessToolkitAvailableConfigList[configListName].value} ignoreTreePref = {true}
                options = {{isExpanded: true, customInlineMenu:true, showInlineMenu: true, onMouseOverInlineAction: true,
                inlineAction: () => this._renderCreationInlineAction(configListName)}}
                showCollectionChildView = {() => this._renderSelectedConfigLists(BusinessToolkitAvailableConfigList[configListName].data)}/>
            )
        });
    };

    _getAvailableCustomConfigLists(){
        this.availableConfigList = [];
        Object.keys(BusinessToolkitAvailableConfigList).forEach((availableAction) => {
            if(!availableAction.restrictShow){
              this.availableConfigList.push(availableAction);
            }
        });
        this._updateComponentState({key: 'isLoading', value: false});
    };

    templateHelpers(){
        if(this.state.isLoading){
            return activityLoader({color: "black", marginTop: (this.props.options.height / 4) + "px", textCenter: true});
        } else {
            return this._renderAvailableConfigLists();
        }
    };

    _renderCreationInlineAction(configName){
        const sidePanelBusinessHelperTemplate = new SidepanelContainerBusinessToolkitTemplate(
            {configName: configName, onClickInlineMenu: () => this._triggerConfigCreationDialog()});
        return sidePanelBusinessHelperTemplate._renderInlineAction();
    };

    _renderCustomModal(){
        return <CustomModal modalData = {this.state.customModal}/>
    };

    componentDidMount() {
      this._getAvailableCustomConfigLists();
    };

    render(){
        return(
            <>
                {this.state.customModal.show && this._renderCustomModal()}
                {this.templateHelpers()}
            </>
        )
    };
}

export default SidepanelContainerBusinessToolkit;