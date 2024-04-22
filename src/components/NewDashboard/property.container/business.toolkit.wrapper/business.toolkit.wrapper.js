import _ from "lodash";
import PropertyBaseView from "../property.base.view/property.base.view";
import BusinessToolkitWrapperTemplate from "./business.toolkit.wrapper.template";
import BusinessToolkitFieldConvertor from "./business.toolkit.field.convertor";
import {activityLoader} from "../../../common.functions/common.functions.view";
import CommonUtils from "../../common.crud.controller/common.crud.controller";
import {nodeConvertor} from "../../../common.functions/node.convertor";

class BusinessToolkitWrapper extends PropertyBaseView {
    constructor(props) {
        super(props);
        this.state = {
            isTemplateFieldOptionsPopulated: false,
            adminAction: undefined,
            controlCenterTemplate: undefined,
            fieldCenterTemplate: undefined
        };
        this.options = this.props;
        this.templates = ['controlCenterTemplate', 'fieldCenterTemplate'];
    };

    templateHelpers(){
        if(!this.state.isTemplateFieldOptionsPopulated){
            return activityLoader({color: 'black', textCenter: true, marginTop: this.options.height / 2.2 + "px"});
        } else {
            return this._renderBusinessToolKitTemplate();
        }
    };

    _renderBusinessToolKitTemplate(){
        var ToolKitTemplate = new BusinessToolkitWrapperTemplate({stateOptions: this.state,
        height: this.options.height, stateUpdateOptions: (updatedData, templateName) => this._updateComponentState({key: templateName, value: updatedData})});
        return ToolKitTemplate._renderBusinessToolKitFields();
    };

    _updateControlCenterTemplate(){
        _.forEach(this.templates, (template) => {
            this.fieldConvertor = new BusinessToolkitFieldConvertor({configName: this.state.adminAction.configName,
            panel: template, fieldData: this.fieldOptions});
            let templateFields = this.fieldConvertor._prepareFields();
            this._updateComponentState({key: template, value: templateFields});
        });
    };

    _convertResponseIntoFields(fieldOptions){
        this.fieldOptions = {};
        fieldOptions.map((options) => {
            this.fieldOptions['configName'] = options['configName'];
            this.fieldOptions['isSelectedConfig'] = options['isSelectedConfig'];
            options.fields.map((opts) => {
               this.fieldOptions[opts.fieldName] = opts['fieldCustomFormula'];
            });
        });
    };

    _getFieldData(){
        const state = [];
        this.state.controlCenterTemplate.forEach((template) => {
            state.push(template);
        });
        this.state.fieldCenterTemplate.forEach((template) => {
            state.push(template);
        });
        return state;
    };

    saveEditedModel(){
        const fieldData = {};
        fieldData.data = this.fieldConvertor._prepareFieldValues(nodeConvertor(this._getFieldData(), [], {onlyChanged: true}));
        if(!_.isEmpty(fieldData)){
            this._addMandatoryFieldData(fieldData, {selectedNodes: [this.state.adminAction.modelId],
                accInfo: this.options.params.accIdAndName, method: 'patch', widgetName: this.state.adminAction.configName});
            this.state.propertyDataCallBackFunc(fieldData).then((result) => {
               this.propertyDataCallSuccess(result);
            });
        }
    };

    _fetchPropertyPage(){
        this.isPropertyPageFetching = true;
        this._toggleComponentLoader(false);
        CommonUtils.dispatchRequest({widgetName: this.state.adminAction.configName, accInfo: this.options.params.accIdAndName,
        query: {selectedNodes: encodeURIComponent(JSON.stringify([this.state.adminAction.modelId]))}, method: 'get'}).then((res) => {
            if(res.data.success){
                this._convertResponseIntoFields(res.data.result);
                this._updateControlCenterTemplate();
                this._toggleComponentLoader(true);
            }
        })
    };
    
    componentDidUpdate() {
        this._listenTo();
        this.model.selectedRoomConstant = 'business-toolkit';
        if(this.state.adminAction !== this.props.data.adminAction){
            this._updateComponentState({key: 'adminAction', value: this.props.data.adminAction}, () => {
                !this.isPropertyPageFetching && this._fetchPropertyPage();
            });
        }
    };
}

export default BusinessToolkitWrapper;