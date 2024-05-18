import _ from 'lodash';
import TableView from "../../../table.view/table.view";
import BusinessToolkitFieldConvertor from "../../business.toolkit.field.convertor";
import {arrangeObj, getCurrentUser} from "../../../../../common.functions/node.convertor";
import TableViewConstants from "../../../table.view/table.view.constants";
import lang from './custom.report.config.constants';

class CustomReportConfig extends TableView{
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            fieldCenterHeight: undefined
        };
        this.state.metadataTableState.tableLoader = true;
        this.options = this.props;
        this.businessToolKitConvertor = new BusinessToolkitFieldConvertor({configName: 'customConfigReport'});
    };

    addExtraParams(options){
        options.method = 'patch';
        options['selectedNodes'] = [this.options.configModel.stateOptions.adminAction.modelId];
        options.data['createdBy'] = getCurrentUser();
        options.data = {
            fields: [options.data]
        }
    };

    _removeFromTableCollection(nodes){
        this.options.configModel.stateOptions.fieldCenterTemplate.map((model) => {
            if(nodes.includes(model._id)){
                model.isSelected = false;
            }
        });
        this.options.configModel._updateStateTemplate({key: 'fieldCenterTemplate', updatedData: this.options.configModel.stateOptions.fieldCenterTemplate, action: 'REPLACE'});
    };

    _getFieldsToSelect(){
        const fieldsToSelect = [],
            defaultFields = this.businessToolKitConvertor._getDefaultFields();
        defaultFields.map((fields) => {
            if(!_.find(this.options.configModel.stateOptions.fieldCenterTemplate, {fieldName: fields.fieldName})){
                this.options.configModel.stateOptions.fieldCenterTemplate.push(fields);
            }
        })
        this.options.configModel.stateOptions.fieldCenterTemplate.map((options) => {
           fieldsToSelect.push(arrangeObj(options, TableViewConstants.PropertyStatusRequiredKey.customConfigReport));
        });
        return fieldsToSelect;
    };

    _getSelectedFieldsNodeId(){
        return _.map(_.filter(this.options.configModel.stateOptions.fieldCenterTemplate, {isSelected: true}), '_id');
    };

    onNewFieldsSelected(nodes){
        if(nodes.checkboxSelection.length > 0) {
            this._toggleTableLoader(true, true);
            this.onCloseCustomModal();
            const selectedFields = _.filter(this.options.configModel.stateOptions.fieldCenterTemplate, (model) => {
                if(nodes.checkboxSelection.includes(model['_id'])){
                    model['isSelected'] = true; model['isChanged'] = true;
                    return true;
                }
                return false;
            });
            this.isActionExecutedFromCommands = false;
            selectedFields.forEach((fields) => this.selectedFields.push(fields));
            setTimeout(() => {
                this._toggleTableLoader(false);
            }, 100);
        }
    };

    prepareTemplateHelpersData() {
        super.prepareTemplateHelpersData();
        this.templateHelpersData.options['disabledCheckboxIndex'] = this._getSelectedFieldsNodeId();
        this.templateHelpersData.options['selectedModelHeader'] = lang.selectFieldsModalHeader;
        this.templateHelpersData.options.eventHelpers['extraParams'] = (options) => this.addExtraParams(options);
        this.templateHelpersData.options.eventHelpers.getTableCollection = () => this._getFieldsToSelect();
        this.templateHelpersData.options.eventHelpers['onChangesApply'] = (statusNodes) => this.onNewFieldsSelected(statusNodes);
        this.templateHelpersData.options.eventHelpers.removeFromTableCollection = (nodes) => this._removeFromTableCollection(nodes);
        this.templateHelpersData.options.allowGoBack = false;
        this.templateHelpersData.options.allowCreateMode = true;
        this.templateHelpersData.options.allowTableHeader = false;
    };

    setExpandedTableView(){
        this.roomConstant = 'customConfigReport';
        this.selectedFields = _.filter(this.options.configModel.stateOptions.fieldCenterTemplate, {isSelected: true});
        return this.selectedFields;
    };
}

export default CustomReportConfig;