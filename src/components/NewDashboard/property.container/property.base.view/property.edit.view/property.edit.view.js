import {templateHelpers} from "./property.edit.template";
import PropertyBaseView from "../property.base.view";
import propertyEditViewConstants from "./property.edit.view.constants";
import {extractQueryParams, nodeConvertor} from "../../../../common.functions/node.convertor";

class PropertyEditView extends PropertyBaseView {
    constructor(props) {
        super(props);
        this.state = {
            data: undefined,
            isTemplateFieldOptionsPopulated: false,
            templateFieldOptions: []
        };
        this.templateHelpersData = {
            VIEW_HEADER: propertyEditViewConstants.VIEW_HEADER,
            height: this.props.height,
            isEditable: () => this.isEditableModel(),
            getPropertyErrMsg: () => this._getPropertyErrorMessage()
        }
    };

    populateTemplateFieldOptsObject(){
        this._updateComponentState({key: 'isTemplateFieldOptionsPopulated', value: true});
    };

    isEditableModel(){
        return extractQueryParams().isEditable === "true";
    };

    saveEditedModel(){
        // Get the metadataField values.
        var fieldData = nodeConvertor(this.state.data);
        // Add mandatory data into the fieldData.
        this._addMandatoryFieldData(fieldData, {roomId: extractQueryParams().selectedModel, lodgeId: this.params.accIdAndName[0]});
        this.state.propertyDataCallBackFunc(fieldData).then(() => {
            this._toggleComponentLoader(true);
        })
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