import _ from 'lodash';
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
        return new Promise((resolve, reject) => {
            // Get the metadataField values.
            var fieldData = nodeConvertor(this.state.data),
                // Get unique key and selected model from the url.
                urlStates = extractQueryParams();
            // Add mandatory data into the fieldData.
            this._addMandatoryFieldData(fieldData, {[urlStates.uniqueId]: urlStates.selectedModel, accInfo: this.params.accIdAndName});
            this.state.propertyDataCallBackFunc(fieldData).then((result) => {
                this.propertyDataCallSuccess(result);
                resolve();
            }).catch((err) => {
               reject(err);
            });
        });
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