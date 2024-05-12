import React from 'react';
import _ from "lodash";
import BusinessToolkitFieldConvertor from "../business.toolkit.field.convertor";
import {extractQueryParams, nodeConvertor, validateFieldData} from "../../../../common.functions/node.convertor";
import {serverQueryUtils} from "../../../dashboard.utils.helper/server.query.utils";
import lang from '../business.toolkit.constants'

class CustomConfigViewWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.options = props.options.options;
        this.state = {
            currentFieldData: undefined,
            selectedPanelItem: [],
            isLoading: false
        };
    };

    templateHelpers(){
        return;
    };

    updateStateComponent(options){
        this.setState({[options.key]: options.value}, () => {
            _.isFunction(options.nextFunc) && options.nextFunc();
        });
    };

    prepareFieldValues(fieldOption){
        const businessToolKitFieldConvertor = new BusinessToolkitFieldConvertor({configName: this.options.stateOptions.adminAction.configName})  ;
        return businessToolKitFieldConvertor._getCustomFieldTemplateValue(fieldOption)
    };

    _toggleComponentLoader(val){
        this.setState({isLoading: val});
    };

    _validateAndCreateNewField(){
        return new Promise((resolve, reject) => {
            validateFieldData(this.state.createFieldState, (updatedData) => this._updateStateComponent(updatedData)).then((isNotValid) => {
                if(isNotValid.length === 0){
                    this._toggleComponentLoader(true);
                    const fieldData = {};
                    fieldData.data = this.prepareFieldValues(_.omitBy(nodeConvertor(this.state.createFieldState), _.isNil));
                    this.options._addMandatoryValues(fieldData, {selectedNodes: [this.options.stateOptions.adminAction.modelId],
                        accInfo: this.options.accInfo, method: 'patch', widgetName: this.options.stateOptions.adminAction.configName});
                    const funcMethodKey = extractQueryParams().method;
                    serverQueryUtils()[funcMethodKey](fieldData).then((resp) => {
                        this.options.modalOptions({show: true, restrictBody: true,
                            header: resp.data.statusCode === 200 ? lang[this.options.stateOptions.adminAction.configName].createFieldOptions.successMessage: resp.data.message,
                            centered: false, footerEnabled: false});
                        this._toggleComponentLoader(false);
                        resolve({serverResult: resp.data.result, fieldData: fieldData});
                    }).catch((err) => {
                        this.options.modalOptions({show: true, restrictBody: true,
                            header: lang[this.options.stateOptions.adminAction.configName].createFieldOptions.errorMessage,
                            centered: false, footerEnabled: false});
                        this._toggleComponentLoader(false);
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
          this.updateStateComponent({key: fieldState, value: this.state[fieldState]});
    };

    render(){
        return this.templateHelpers();
    }
}

export default CustomConfigViewWrapper;