import MetadataFieldsView from "../../../fields/metadata.fields.view";
import './business.toolkit.template.css';

class BusinessToolkitWrapperTemplate {
    constructor(options) {
        this.options = options;
    };

    _renderFieldControlCenter(){
        return (
            <div className = 'business-toolkit-fieldcenter-wrapper'>
                <div className='business-toolkit-fieldcenter'>
                    <MetadataFieldsView data={this.options.stateOptions.fieldCenterTemplate}
                    updateData={(updatedData) => this.options.stateUpdateOptions(updatedData, 'fieldCenterTemplate')}/>
                </div>
            </div>
        )
    };

    _renderBusinessToolKitFields() {
        return (
            <div className = 'business-toolkit-container' style = {{height: this.options.height + "px"}}>
                <div className='business-toolkit-controlcenter'>
                    <MetadataFieldsView data={this.options.stateOptions.controlCenterTemplate}
                    updateData = {(updatedData) => this.options.stateUpdateOptions(updatedData, 'controlCenterTemplate')} />
                </div>
                {this._renderFieldControlCenter()}
            </div>
        )
    };
}

export default BusinessToolkitWrapperTemplate;