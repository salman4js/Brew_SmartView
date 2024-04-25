import _ from "lodash";
import MetadataFieldTemplateState from "../../../fields/metadata.field.templatestate";

let fieldModule = function () {
    const me = {};
    me.customConfigCalc = {
        fieldCenterTemplateValues: ['totalAmount', 'extraBedPrice', 'discount', 'advance'],
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
                    label: 'Formula Customization', attribute: 'textField', clientName: 'Advance'
                },{
                    name: 'discount', placeholder: 'Enter custom formula discount',
                    label: 'Formula Customization', attribute: 'textField', clientName: 'Discount'
                },{
                    name: 'extraBedPrice', placeholder: 'Enter custom formula extra bed price',
                    label: 'Formula Customization', attribute: 'textField', clientName: 'Extra Bed Price'
                },{
                    name: 'totalAmount', placeholder: 'Enter custom formula for total amount',
                    label: 'Formula Customization', attribute: 'textField', clientName: 'Total Amount'
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
        }
    }
    return me;
}();


class BusinessToolkitFieldConvertor {
    constructor(options) {
        this.options = options;
    };

    _prepareFields(){
        const fields = fieldModule[this.options.configName]._getTemplate(this.options.panel);
        const metadataFields = [];
        fields.map((f) => {
           const fieldTemplate = _.clone(MetadataFieldTemplateState[f.attribute]);
           fieldTemplate.name = f.name;
           if(fieldModule[this.options.configName].fieldCenterTemplateValues.includes(f.name)) fieldTemplate.width = '100%';
           fieldTemplate.value = this.options.fieldData[f.name];
           fieldTemplate.placeholder = f.placeholder;
           fieldTemplate.label = f.label;
           fieldTemplate['clientName'] = f.clientName;
           if(f.customStyle){
               fieldTemplate.customStyle = f.customStyle;
           }
           metadataFields.push(fieldTemplate);
        });
        return metadataFields;
    };

    _prepareFieldValues(fieldOptions){
        return fieldModule[this.options.configName]._getTemplateValue(fieldOptions);
    };
}

export default BusinessToolkitFieldConvertor;