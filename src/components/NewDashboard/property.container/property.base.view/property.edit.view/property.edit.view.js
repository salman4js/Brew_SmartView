import {templateHelpers} from "./property.edit.template";
import PropertyBaseView from "../property.base.view";
import {extractQueryParams, nodeConvertor} from "../../../../common.functions/node.convertor";
import propertyBaseConstants from "../property.base.constants";

class PropertyEditView extends PropertyBaseView {
    constructor(props) {
        super(props);
        this.state = {
            data: undefined,
            isTemplateFieldOptionsPopulated: false,
            templateFieldOptions: []
        };
        this.templateHelpersData = {
            VIEW_HEADER: propertyBaseConstants.EDIT_VIEW_HEADER[this.props.data.selectedRoomConstant],
            height: this.props.height,
            isEditable: () => this.isEditableModel(),
            getPropertyErrMsg: () => this._getPropertyErrorMessage()
        };
    };

    populateTemplateFieldOptsObject(){
        this._updateComponentState({key: 'isTemplateFieldOptionsPopulated', value: true});
    };

    isEditableModel(){
        return extractQueryParams().isEditable === "true";
    };

    saveEditedModel(){
        // Get the metadataField values.
        var fieldData = nodeConvertor(this.state.data),
        // Get unique key and selected model from the url.
            selectedModelFromUrl = extractQueryParams();
        // Add mandatory data into the fieldData.
        this._addMandatoryFieldData(fieldData, {[selectedModelFromUrl.uniqueId]: selectedModelFromUrl.selectedModel, lodgeId: this.params.accIdAndName[0]});
        this.state.propertyDataCallBackFunc(fieldData).then((result) => {
            var modalOptions = this._prepareModalOptions(result);
            this._toggleComponentLoader(true);
            this._triggerCustomModal(modalOptions);
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