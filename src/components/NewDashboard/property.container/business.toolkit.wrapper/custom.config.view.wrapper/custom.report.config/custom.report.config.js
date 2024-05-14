import React from 'react';
import _ from 'lodash';
import TableView from "../../../table.view/table.view";
import MetadataFieldsView from "../../../../../fields/metadata.fields.view";
import {
    arrangeObj,
    createMetadataFieldsWithBaseObj, extractQueryParams,
    extractStateValue, nodeConvertor,
    validateFieldData
} from "../../../../../common.functions/node.convertor";
import BusinessToolkitFieldConvertor from "../../business.toolkit.field.convertor";
import MetadataFieldTemplateState from "../../../../../fields/metadata.field.templatestate";
import {serverQueryUtils} from "../../../../dashboard.utils.helper/server.query.utils";
import lang from "../../business.toolkit.constants";
import CommandsSelectedModel from "../../../../commands/commands.initialize/commands.selected.model";

class CustomReportConfig extends TableView{
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            fieldCenterHeight: undefined,
            createFieldState: [{
                name: 'fieldName',
                value: undefined,
                attribute: 'textField',
                width: '100%',
                placeholder: lang.customConfigReport.createFieldOptions.fieldName.placeholder,
                label: lang.customConfigReport.createFieldOptions.fieldName.label,
                isRequired: true,
                inlineToast: {
                    isShow: false,
                    inlineToastColor: 'red',
                    inlineMessage: lang.customConfigReport.createFieldOptions.fieldName.invalidArguments,
                }
            }, {
                name: 'fieldCustomFormula',
                value: undefined,
                attribute: 'textField',
                width: '100%',
                placeholder: lang.customConfigReport.createFieldOptions.fieldCustomFormula.placeholder,
                label: lang.customConfigReport.createFieldOptions.fieldCustomFormula.label,
                isRequired: true,
                inlineToast: {
                    isShow: false,
                    inlineToastColor: 'red',
                    inlineMessage: lang.customConfigReport.createFieldOptions.fieldCustomFormula.invalidArguments,
                }
            }, {
                btnValue: lang.customConfigReport.createFieldOptions.createField.btnValue,
                onClick: () => this._createNewField(),
                isDark: false,
                occupyFullSpace: false,
                customClass: 'float-right',
                attribute: 'buttonField'
            }, {
                btnValue: lang.customConfigReport.createFieldOptions.resetFields.btnValue,
                onClick: () => this.resetFormData('createFieldState'),
                isDark: false,
                occupyFullSpace: false,
                customClass: 'float-right',
                attribute: 'buttonField'
            }]
        };
        this.state.metadataTableState.tableLoader = true;
        this.options = this.props;
    };

    resetFormData(fieldState){
        if(this.isToastMessageVisible()){
            this.setState({fieldCenterHeight: this.fieldCenterRef.current.offsetHeight - 20});
        }
        this._resetFormData(fieldState);
    };

    isToastMessageVisible(){
        // Check if the error message for text field is still visible!
        let isToastVisible = false,
            stateValue = extractStateValue(this.state.createFieldState, 'inlineToast'),
            extractedState = Object.keys(stateValue);
        for (let i = 0; i <= extractedState.length; i++){
            if(stateValue[extractedState[i]] && stateValue[extractedState[i]].isShow){
                isToastVisible = true;
                break;
            }
        }
        return isToastVisible;
    };

    _createNewField(){
        let isToastVisible = this.isToastMessageVisible();
        !isToastVisible && this.setState({fieldCenterHeight: this.fieldCenterRef.current.offsetHeight + 20});
        this._validateAndCreateNewField().then((options) => {
            const locallyCreatedField = _.find(options.serverResult.fields, options.fieldData.data.fields[0]);
            // Convert the locally created field into checkBoxField template!
            const templateState = _.clone(MetadataFieldTemplateState.checkBoxField);
            console.log(createMetadataFieldsWithBaseObj(locallyCreatedField, {}, templateState));
        });
    };

    _createCustomFieldsView(){
        return <MetadataFieldsView data = {this.state.createFieldState} updateData = {(updatedData) => this._updateComponentState(updatedData)}/>
    };

    prepareFieldValues(fieldOption){
        const businessToolKitFieldConvertor = new BusinessToolkitFieldConvertor({configName: this.options.stateOptions.adminAction.configName})  ;
        return businessToolKitFieldConvertor._getCustomFieldTemplateValue(fieldOption)
    };
    
    _validateAndCreateNewField(){
        return new Promise((resolve, reject) => {
            validateFieldData(this.state.createFieldState, (updatedData) => this._updateComponentState(updatedData)).then((isNotValid) => {
                if(isNotValid.length === 0){
                    this._toggleTableLoader(true);
                    const fieldData = {};
                    fieldData.data = this.prepareFieldValues(_.omitBy(nodeConvertor(this.state.createFieldState), _.isNil));
                    this.options._addMandatoryValues(fieldData, {selectedNodes: [this.options.stateOptions.adminAction.modelId],
                        accInfo: this.options.params.accIdAndName, method: 'patch', widgetName: this.options.stateOptions.adminAction.configName});
                    const funcMethodKey = extractQueryParams().method;
                    serverQueryUtils()[funcMethodKey](fieldData).then((resp) => {
                        this.options.modalOptions({show: true, restrictBody: true,
                            header: resp.data.statusCode === 200 ? lang[this.options.stateOptions.adminAction.configName].createFieldOptions.successMessage: resp.data.message,
                            centered: false, footerEnabled: false});
                        this._toggleTableLoader(false);
                        resolve({serverResult: resp.data.result, fieldData: fieldData});
                    }).catch((err) => {
                        this.options.modalOptions({show: true, restrictBody: true,
                            header: lang[this.options.stateOptions.adminAction.configName].createFieldOptions.errorMessage,
                            centered: false, footerEnabled: false});
                        this._toggleTableLoader(false);
                        reject(err);
                    });
                }
            });
        })
    }

    _resetFormData(fieldState){
        this.state[fieldState].map((field) => {
            field.value = undefined;
            if(field?.inlineToast){
                field.inlineToast.isShow = false;
            }
        });
        this._updateComponentState({key: fieldState, value: this.state[fieldState]});
    };

    _getDefaultReportFields(){
          const defaultReportFields = [];
          lang.customConfigReport.fieldControlCenter.map((fieldName) => {
              const fields = {};
              fields['_id'] = '';
              fields['fieldName'] = fieldName;
              fields['fieldCustomFormula'] = '';
              fields['createdBy'] = lang.customConfigReport.defaultFieldsCreateBy;
              fields['enabledBy'] = '';
              fields['comments'] = '';
              defaultReportFields.push(fields);
          });
          return defaultReportFields;
    };

    getNodePickerTableCollection(){
        const defaultReportFields = this._getDefaultReportFields();
        this.options.configModel.stateOptions.fieldCenterTemplate.map((fieldCenter) => {
            const inSequenceOrder = arrangeObj(fieldCenter, lang.customConfigReport.fieldControlCenterSequence);
            defaultReportFields.push(inSequenceOrder);
        });
        return defaultReportFields;
    };

    onSelectNewFields(){
        console.log(this.commandSelectedModalView.statusNodes);
    };

    _getSelectFieldDialogFooterOptions(){
        return[{
            btnId: lang.customConfigReport.selectFieldOptions.dialog.btnValue,
            variant: 'secondary',
            onClick: () => this.onSelectNewFields()
        }]
    };

    onCreateModeTableIconClicked(){
        this.templateHelpersData.options.selectedModelHeader = lang.customConfigReport.selectFieldOptions.modalHeader;
        this.templateHelpersData.options.selectedModelFooterButtons = this._getSelectFieldDialogFooterOptions();
        this.commandSelectedModalView = new CommandsSelectedModel(this.templateHelpersData.options)
        return this.commandSelectedModalView.execute();
    };

    prepareTemplateHelpersData() {
        super.prepareTemplateHelpersData();
        this.templateHelpersData.options.eventHelpers.getTableCollection = () => this.getNodePickerTableCollection();
        this.templateHelpersData.options.allowGoBack = false;
        this.templateHelpersData.options.allowCreateMode = true;
        this.templateHelpersData.options.allowTableHeader = false;
    };

    setExpandedTableView(){
        this.roomConstant = 'customReport';
        return this.options.configModel.stateOptions.fieldCenterTemplate;
    };
}

export default CustomReportConfig;