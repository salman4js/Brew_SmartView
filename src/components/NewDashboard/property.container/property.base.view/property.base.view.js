import React from 'react';
import _ from 'lodash';
import {activityLoader} from "../../../common.functions/common.functions.view";
import propertyBaseConstants from "./property.base.constants";
import lang from '../../commands/commands.constants'
import {extractQueryParams, getParsedUrl} from "../../../common.functions/node.convertor";
import CommandsConnector from "../../commands/commands.connector";


// This class will be holding on the methods which will be commonly used by property read and property edit.
class PropertyBaseView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            propertyDataCallBackFunc: undefined
        }
        this.params = this.props.params;
        this.isStateRouterNotified = false;
        this.routerController = this.props.routerController;
        this._updateCustomModal = this.props.modalOptions;
        this.model = undefined; // This model will be holding the current selected model entire state data.
    };

    templateHelpers(){
      // Those who are using this base class, Override this templateHelpers to show their corresponding view
    };

    _triggerActivityLoader(){
        var opts = {
            color: "black",
            marginTop: (this.props.height / 2.5) + "px",
            textCenter: true
        };
        return activityLoader(opts);
    };

    _getPerspectiveConstant(){
        return propertyBaseConstants.PERSPECTIVE_CONSTANT;
    };

    _prepareModalOptions(options){
        var modalOptions = _.clone(propertyBaseConstants.PROPERTY_SAVE_MODAL_OPTS[this.model.selectedRoomConstant]),
        // Get response model key.
            urlStates = extractQueryParams();
        modalOptions.onHideOptions[urlStates.clientModelKey] = options.data[urlStates.serverModelKey];
        modalOptions.header = options.data.message;
        modalOptions.onHide = () => this._updateCustomModal({show: false}, () => this.props.dashboardController(modalOptions.onHideOptions));
        return modalOptions;
    };

    _triggerCustomModal(options){
        this._updateCustomModal(options);
    };

    _getCurrentViewMode(){
        return propertyBaseConstants.VIEW_CONSTANT;
    };

    _getPropertyErrorMessage(){
      return propertyBaseConstants.PROPERTY_ERROR_MSG[this.model.selectedRoomConstant];
    };

    _addMandatoryFieldData(fieldData, additionalData){
        Object.keys(additionalData).forEach((key) => {
            fieldData[key] = additionalData[key];
        });
        return fieldData;
    };

    // Notify the state router when the perspective is ready!
    _notifyStateRouter(){
        var opts = {
            routerOptions: {
                currentRouter: this._getPerspectiveConstant(),
                currentTableMode: this._getCurrentViewMode(),
                currentDashboardMode: this.props.data.dashboardMode,
                action: 'ADD'
            }
        };
        this.routerController()._notifyStateRouter(opts);
        this.isStateRouterNotified = true;
    };

    fetchHtmlContent(){
        var options = {
            accId: this.params.accIdAndName[0],
            filename: this.customTemplateFileName,
            templateName: this.roomConstantKey
        };
        return CommandsConnector.fetchCustomHTMLConfiguredTemplate(options).then((result) => {
            return result;
        });
    };

    setPropertyDataCallBackFunc(callBackFunc){
      this._updateComponentState({key: 'propertyDataCallBackFunc', value: callBackFunc}, () => {
          this._toggleComponentLoader(false);
          this.saveEditedModel && this.saveEditedModel();
      })
    };

    _toggleComponentLoader(val){
        this.state.isTemplateFieldOptionsPopulated = val;
        this.setState({isTemplateFieldOptionsPopulated: val})
    };

    _updateComponentState(state, nextFunction){
        this.setState({[state.key]: state.value}, async () => {
            _.isFunction(nextFunction) && await nextFunction();
        })
    };

    render(){
        !this.isStateRouterNotified && this._notifyStateRouter();
        return this.templateHelpers();
    };

    componentDidUpdate(prevProps, prevState){
        if(this.props.data.propertyData !== this.state?.data){
            this.model = this.props.data;
            this._updateComponentState({key: 'data', value: this.props.data.propertyData}, this.populateTemplateFieldOptsObject.bind(this));
        };

        // Listen for save event.
        if(this.props.data.propertyDataCallBackFunc !== this.state?.propertyDataCallBackFunc){
          this.setPropertyDataCallBackFunc && this.setPropertyDataCallBackFunc(this.props.data.propertyDataCallBackFunc);
        };
    };

}

export default PropertyBaseView;