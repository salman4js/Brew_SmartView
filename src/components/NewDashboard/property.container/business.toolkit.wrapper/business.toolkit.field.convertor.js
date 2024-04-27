import _ from "lodash";
import lang from './business.toolkit.constants';
import MetadataFieldTemplateState from "../../../fields/metadata.field.templatestate";

let fieldModule = function () {
    const me = {};
    me.customConfigCalc = {
        fieldCenterTemplateValues: ['totalAmount', 'extraBedPrice', 'discount', 'advance', 'gstPrice'],
        _getTemplate: function(panelName){
            const template = {
                controlCenterTemplate: [{
                    name: 'configName', placeholder: 'Enter Configuration Name', label: 'Configuration Name', attribute: 'textField'
                }, {
                    name: 'isSelectedConfig', label: 'Select as a default configuration', customStyle: {
                        color: 'black',
                        border: '1px solid grey',
                        backgroundColor: '#EDEADE',
                        padding: '5px 5px 5px 5px',
                        borderRadius: '5px',
                        marginTop: '10px',
                        width: '500px',
                        marginBottom: '10px'
                    }, attribute: 'checkBoxField'
                }],
                fieldCenterTemplate: [{
                    name: 'advance', placeholder: 'Enter custom formula advance',
                    label: 'Formula Customization', attribute: 'textField', clientName: 'Advance',
                    customFieldIconWithToolTip: true
                }, {
                    name: 'discount', placeholder: 'Enter custom formula discount',
                    label: 'Formula Customization', attribute: 'textField', clientName: 'Discount',
                    customFieldIconWithToolTip: true
                }, {
                    name: 'extraBedPrice', placeholder: 'Enter custom formula extra bed price',
                    label: 'Formula Customization', attribute: 'textField', clientName: 'Extra Bed Price',
                    customFieldIconWithToolTip: true
                },{
                    name: 'gstPrice', placeholder: "Enter custom formula for GST calculation",
                    label: 'Formula Customization', attribute: 'textField', clientName: 'GST',
                    customFieldIconWithToolTip: true
                },{
                    name: 'totalAmount', placeholder: 'Enter custom formula for total amount',
                    label: 'Formula Customization', attribute: 'textField', clientName: 'Total Amount',
                    customFieldIconWithToolTip: true
                }]
            };
            return template[panelName];
        },
        _getTemplateValue: function(fieldOptions){
            const fieldOptionsKey = Object.keys(fieldOptions);
            fieldOptionsKey.forEach((field) => {
                if(this.fieldCenterTemplateValues.includes(field)){
                    if(!fieldOptions.fields) fieldOptions.fields = [];
                    fieldOptions.fields.push({
                        fieldName: field,
                        fieldCustomFormula: fieldOptions[field]
                    });
                    delete fieldOptions[field];
                }
            });
            return fieldOptions;
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
            fields = fieldModuleInstance._getTemplate(options.panel),
            metadataFields = [];
        fields.map((f) => {
           const fieldTemplate = _.clone(MetadataFieldTemplateState[f.attribute]);
           fieldTemplate.name = f.name;
           if(fieldModuleInstance.fieldCenterTemplateValues.includes(f.name)) fieldTemplate.width = '100%';
           fieldTemplate.value = options.fieldData[f.name];
           fieldTemplate.placeholder = f.placeholder;
           fieldTemplate.label = f.label;
           fieldTemplate['clientName'] = f.clientName;
           if(f.customStyle){
               fieldTemplate.customStyle = f.customStyle;
           }
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
        return fieldModule[this.options.configName]._getTemplateValue(fieldOptions);
    };

    _convertResponseIntoFields(fieldOptions) {
        return fieldModule[this.options.configName]._convertResponseIntoFields(fieldOptions);
    };
}

export default BusinessToolkitFieldConvertor;