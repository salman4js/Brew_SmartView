import CustomConfigViewWrapper from "../custom.config.view.wrapper";
import MetadataFieldsView from "../../../../../fields/metadata.fields.view";
import lang from "../../business.toolkit.constants";

class CustomReportConfig extends CustomConfigViewWrapper{
    constructor(options) {
        super(options);
        this.state = {
            ...this.state,
            createFieldState: [{
                name: 'fieldName',
                attribute: 'textField',
                width: '100%',
                placeholder: lang.customConfigReport.createFieldOptions.fieldName.placeholder,
                label: lang.customConfigReport.createFieldOptions.fieldName.label
            }, {
                name: 'fieldCustomFormula',
                attribute: 'textField',
                width: '100%',
                placeholder: lang.customConfigReport.createFieldOptions.fieldCustomFormula.placeholder,
                label: lang.customConfigReport.createFieldOptions.fieldCustomFormula.label
            }, {
                btnValue: lang.customConfigReport.createFieldOptions.createField.btnValue,
                onClick: () => {

                },
                isDark: false,
                occupyFullSpace: false,
                customClass: 'float-right',
                attribute: 'buttonField'
            }, {
                btnValue: lang.customConfigReport.createFieldOptions.resetFields.btnValue,
                onClick: () => {

                },
                isDark: false,
                occupyFullSpace: false,
                customClass: 'float-right',
                attribute: 'buttonField'
            }]
        }
    };

    _updateStateComponent(updatedData){
          this.updateStateComponent({key: 'createFieldState', value: updatedData});
    };

    _createCustomFieldsView(){
        return <MetadataFieldsView data = {this.state.createFieldState} updateData = {(updatedData) => this._updateStateComponent(updatedData)}/>
    };

    templateHelpers(){
        return(
            <div className='business-toolkit-fieldcenter-wrapper'>
                <div className='business-toolkit-fieldcenter'>
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
    };
}

export default CustomReportConfig;