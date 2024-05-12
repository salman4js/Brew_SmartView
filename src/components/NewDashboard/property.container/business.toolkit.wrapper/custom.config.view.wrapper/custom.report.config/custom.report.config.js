import React from 'react';
import _ from "lodash";
import CustomConfigViewWrapper from "../custom.config.view.wrapper";
import MetadataFieldsView from "../../../../../fields/metadata.fields.view";
import {extractStateValue} from "../../../../../common.functions/node.convertor";
import {activityLoader} from "../../../../../common.functions/common.functions.view";
import lang from "../../business.toolkit.constants";

class CustomReportConfig extends CustomConfigViewWrapper{
    constructor(options) {
        super(options);
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
        this.view = React.createRef();
        this.fieldCenterRef = React.createRef();
    };

    _updateStateComponent(updatedData){
          this.updateStateComponent({key: 'createFieldState', value: updatedData});
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

        });
    };

    _createCustomFieldsView(){
        return <MetadataFieldsView data = {this.state.createFieldState} updateData = {(updatedData) => this._updateStateComponent(updatedData)}/>
    };

    templateHelpers(){
        if(this.state.isLoading){
            const opts = {
                color: 'black',
                textCenter: true,
                marginTop: (this.view?.current?.offsetHeight / 2) + 'px',
                marginBottom: (this.view?.current?.offsetHeight / 2) + 'px'
            }
            return activityLoader(opts);
        } else {
            return(
                <div className='business-toolkit-fieldcenter-wrapper' ref = {this.view}>
                    <div className='business-toolkit-fieldcenter' style = {{height: this.state.fieldCenterHeight}} ref = {this.fieldCenterRef}>
                        <div
                            className='business-toolkit-fieldcenter-header text-center brew-cursor'>{lang[this.options.stateOptions.adminAction.configName].fieldControlTemplateHeader}</div>
                        <MetadataFieldsView data={this.options.stateOptions.fieldCenterTemplate}/>
                    </div>
                    <div className='business-toolkit-field-control-center-wrapper'>
                        <div className='business-toolkit-field-control-center'>
                            <div
                                className='business-toolkit-fieldcenter-header text-center brew-cursor'>{lang[this.options.stateOptions.adminAction.configName].customFieldCreationHeader}</div>
                            {this._createCustomFieldsView()}
                        </div>
                    </div>
                </div>
            )
        }
    };
}

export default CustomReportConfig;