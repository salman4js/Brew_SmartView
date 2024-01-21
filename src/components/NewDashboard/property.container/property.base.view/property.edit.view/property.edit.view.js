import {templateHelpers} from "./property.edit.template";
import PropertyBaseView from "../property.base.view";
import propertyEditViewConstants from "./property.edit.view.constants";

class PropertyEditView extends PropertyBaseView {
    constructor(props) {
        super(props);
        this.state = {
            data: undefined,
            isTemplateFieldOptionsPopulated: false,
            templateFieldOptions: []
        };
        this.params = this.props.params;
        this.templateHelpersData = {
            VIEW_HEADER: propertyEditViewConstants.VIEW_HEADER,
            height: this.props.height
        }
    };

    populateTemplateFieldOptsObject(){
        this._updateComponentState({key: 'isTemplateFieldOptionsPopulated', value: true});
    };

    templateHelpers(){
        if(this.state.isTemplateFieldOptionsPopulated){
            return templateHelpers(this.state.data, this._updateComponentState.bind(this), this.templateHelpersData);
        } else {
            return this._triggerActivityLoader();
        }
    };
}

export default PropertyEditView;