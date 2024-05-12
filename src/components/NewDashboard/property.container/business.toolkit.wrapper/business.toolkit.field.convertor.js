import _ from "lodash";
import lang from './business.toolkit.constants';
import MetadataFieldTemplateState from "../../../fields/metadata.field.templatestate";

let fieldModule = function () {
    const me = {};
    me._getTemplateValue = function(fieldOptions, configName){
        const fieldOptionsKey = Object.keys(fieldOptions);
        fieldOptionsKey.forEach((field) => {
            if(me[configName].fieldCenterTemplateValues.includes(field)){
                if(!fieldOptions.fields) fieldOptions.fields = [];
                fieldOptions.fields.push({
                    fieldName: field,
                    fieldCustomFormula: fieldOptions[field]
                });
                delete fieldOptions[field];
            }
        });
        return fieldOptions;
    }
    me.customConfigCalc = {
        fieldCenterTemplateValues: ['totalAmount', 'extraBedPrice', 'discount', 'advance', 'gstPrice'],
        _getTemplate: function(options, configName){
            const template = {
                controlCenterTemplate: [{
                    name: 'configName', placeholder: 'Enter Configuration Name', label: 'Configuration Name', attribute: 'textField'
                }, {
                    name: 'isSelectedConfig', label: 'Select as a default configuration', attribute: 'checkBoxField', customStyle: {
                        color: 'black',
                        border: '1px solid grey',
                        backgroundColor: '#EDEADE',
                        padding: '5px 5px 5px 5px',
                        borderRadius: '5px',
                        marginTop: '10px',
                        width: '500px',
                        marginBottom: '10px'
                    }
                }],
                fieldCenterTemplate: lang[configName].fieldControlCenter
            };
            return template[options.panel];
        },
        _convertResponseIntoFields: function(fieldOptions){
            const parsedFields = {};
            fieldOptions.map((options) => {
                parsedFields['configName'] = options['configName'];
                parsedFields['isSelectedConfig'] = options['isSelectedConfig'];
                options.fields.map((opts) => {
                    parsedFields[opts.fieldName] = opts['fieldCustomFormula'];
                });
            });
            return parsedFields;
        },
        _getFieldIcon: function(){
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="30" fill="black"
                     className="bi bi-info-circle-fill" viewBox="0 0 16 1">
                    <path
                        d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>
                </svg>
            )
        },
        _getToolTipMessage: function(){
            return(
                <pre style = {{color: 'white'}}>
                    {lang.customConfigCalc.infoMessageForCustomFormula}
                </pre>
            )
        },
        _parseResults: function(formulaFields){
            const customFormula = {};
            customFormula.isSelectedConfig = formulaFields.isSelectedConfig;
            formulaFields.fields.map((opts) => {
                customFormula[opts.fieldName] = opts.fieldCustomFormula;
            });
            return customFormula;
        }
    };
    me.customConfigReport = {
        fieldCenterTemplateValues: ['fieldName', 'fieldCustomFormula'],
        _convertResponseIntoFields: function(fieldOptions){
            const parsedFields = {};
            parsedFields.fields = [];
            fieldOptions.map((options) => {
                parsedFields['configName'] = options['configName'];
                options.fields.map((opts) => {
                    const fieldsObj = {};
                    fieldsObj['name'] = opts['fieldName'];
                    fieldsObj['customFormula'] = opts['fieldCustomFormula'];
                    fieldsObj['isCustomField'] = opts['isCustomField'] || false;
                    fieldsObj['isSelected'] = opts['isSelected'] || false;
                    parsedFields.fields.push(fieldsObj);
                });
            });
            return parsedFields;
        },
        _getTemplate: function(options, configName){
            const template = {
                controlCenterTemplate: [{
                    name: 'configName', placeholder: 'Enter configuration name', label: 'Configuration Name', attribute: 'textField'
                }],
                fieldCenterTemplate: lang[configName].fieldControlCenter
            }
            if(options.panel === 'fieldCenterTemplate'){
                template.fieldCenterTemplate.map((fieldCenterTemplate) => {
                    fieldCenterTemplate['customStyle'] = {
                        color: 'black',
                        border: '1px solid grey',
                        backgroundColor: '#EDEADE',
                        padding: '5px 5px 5px 5px',
                        borderRadius: '5px',
                        marginTop: '10px',
                        width: '500px',
                        marginBottom: '10px'
                    }
                })
                options.fieldData.fields.map((opts) => {
                    // Check if any of the default field has been selected...
                    const indexToBeChecked = _.findIndex(template.fieldCenterTemplate, {name: opts.name});
                    if(indexToBeChecked !== -1){
                        delete template.fieldCenterTemplate[indexToBeChecked];
                    }
                    const fieldCenter = {};
                    fieldCenter['name'] = opts.name;
                    fieldCenter['value'] = opts.isSelected || false;
                    fieldCenter['label'] = opts.name;
                    fieldCenter['isCustomField'] = opts.isCustomField || false;
                    fieldCenter['attribute'] = 'checkBoxField';
                    fieldCenter['customStyle'] = {
                        color: 'black',
                        border: '1px solid grey',
                        backgroundColor: '#EDEADE',
                        padding: '5px 5px 5px 5px',
                        borderRadius: '5px',
                        marginTop: '10px',
                        width: '500px',
                        marginBottom: '10px'
                    }
                    template.fieldCenterTemplate.push(fieldCenter);
                });
            }
            return template[options.panel];
        },
        _getCustomFieldTemplateValue(fieldOptions){
           const fieldValue = {};
           fieldValue.fields = [];
           fieldValue.fields.push(fieldOptions);
           return fieldValue;
        }
    }
    return me;
}();


class BusinessToolkitFieldConvertor {
    constructor(options) {
        this.options = options;
    };

    _prepareFields(options){
        const fieldModuleInstance = fieldModule[this.options.configName],
            fields = fieldModuleInstance._getTemplate(options, this.options.configName),
            metadataFields = [];
        fields.map((f) => {
           const fieldTemplate = _.clone(MetadataFieldTemplateState[f.attribute]);
           fieldTemplate.name = f.name;
           if(fieldModuleInstance.fieldCenterTemplateValues.includes(f.name)) fieldTemplate.width = '100%';
           fieldTemplate.value = f.value || options.fieldData[f.name];
           fieldTemplate.placeholder = f.placeholder;
           fieldTemplate.label = f.label;
           fieldTemplate['clientName'] = f.clientName;
           if(f.customStyle) fieldTemplate.customStyle = f.customStyle;
           if(f.isCustomField) fieldTemplate['isCustomField'] = f.isCustomField;
           if(f.isLabelFirst !== undefined) fieldTemplate.isLabelFirst = f.isLabelFirst;
           if(f.customFieldIconWithToolTip){
               fieldTemplate.customFieldIconWithToolTip = f.customFieldIconWithToolTip;
               fieldTemplate.customFieldIconToolTip = fieldModuleInstance._getToolTipMessage();
               fieldTemplate.showCustomFieldIcon = function(){
                   return fieldModuleInstance._getFieldIcon();
               }
           }
            metadataFields.push(fieldTemplate);
        });
        return metadataFields;
    };

    _prepareFieldValues(fieldOptions) {
        return fieldModule._getTemplateValue(fieldOptions, this.options.configName);
    };

    _getCustomFieldTemplateValue(fieldOptions){
        return fieldModule[this.options.configName]._getCustomFieldTemplateValue(fieldOptions);
    };

    _convertResponseIntoFields(fieldOptions) {
        return fieldModule[this.options.configName]._convertResponseIntoFields(fieldOptions);
    };

    parseResults(formulaFields){
        return fieldModule[this.options.configName]._parseResults(formulaFields);
    };
}

export default BusinessToolkitFieldConvertor;