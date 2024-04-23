import React from 'react';
import _ from "lodash";
import SidepanelContainerBusinessToolkitTemplate from "./sidepanel.container.business.toolkit.template";
import BusinessToolkitAvailableConfigList from "./business.toolkit.available.config.list";
import {activityLoader} from "../../../common.functions/common.functions.view";
import CollectionView from "../../../SidePanelView/collection.view/collection.view";
import CommonUtils from "../../common.crud.controller/common.crud.controller";
import PanelItemView from "../../../SidePanelView/panel.item/panel.item.view";

class SidepanelContainerBusinessToolkit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isChildLoading: true,
            selectedItem: [],
            configLists: []
        }
        this.options = this.props.options;
    };

    _updateComponentState(options){
      this.setState({[options.key]: options.value}, () => {
          _.isFunction(options.nextFunc) && options.nextFunc()
      })
    };

    _onNewConfigCreation(){

    };

    fetchConfigListForSelection(configName){
        this.currentConfigName = configName;
        this.selectedConfigListFetching = true;
        CommonUtils.dispatchRequest({accInfo: this.options.params.accIdAndName,
            widgetName: configName, query: {fields: 'configName'}, method: 'get'}).then((res) => {
            if(res.data.success){
                this.state.configLists.push({value: configName, result: res.data.result});
                this.pushIntoSelectedItems(res.data.result[0]._id);
                this._updateComponentState({key: 'configLists', value: this.state.configLists});
                this._updateComponentState({key: 'isChildLoading', value: false});
                this.options.dashboardController({isAdminAction: true, adminAction: {configName: configName,
                modelId: res.data.result[0]._id}, queryParams: [{key: 'method', value: 'admin-action-patch-custom-calc'}]});
            }
        });
    };

    pushIntoSelectedItems(id){
        this.state.selectedItem.push(id);
        this._updateComponentState({key: 'selectedItem', value: this.state.selectedItem});
    };

    onPanelItemClick(id) {
        this.pushIntoSelectedItems(id);
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
            {configName: configName, onClickInlineMenu: () => this._onNewConfigCreation()});
        return sidePanelBusinessHelperTemplate._renderInlineAction();
    };

    componentDidMount() {
      this._getAvailableCustomConfigLists();
    };

    render(){
      return this.templateHelpers();
    };
}

export default SidepanelContainerBusinessToolkit;