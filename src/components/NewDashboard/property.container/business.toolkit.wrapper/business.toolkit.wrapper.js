import _ from "lodash";
import CollectionInstance from "../../../../global.collection/widgettile.collection/widgettile.collection";
import PropertyBaseView from "../property.base.view/property.base.view";
import BusinessToolkitWrapperTemplate from "./business.toolkit.wrapper.template";
import BusinessToolkitFieldConvertor from "./business.toolkit.field.convertor";
import CommonUtils from "../../common.crud.controller/common.crud.controller";
import {activityLoader} from "../../../common.functions/common.functions.view";
import {nodeConvertor} from "../../../common.functions/node.convertor";
import BusinessToolKitConstants from "./business.toolkit.constants";

class BusinessToolkitWrapper extends PropertyBaseView {
    constructor(props) {
        super(props);
        this.state = {
            isTemplateFieldOptionsPopulated: true,
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
            if(this.state.fieldCenterTemplate && this.state.isTemplateFieldOptionsPopulated){
                return this._renderBusinessToolKitTemplate();
            } else {
                return this._renderNoConfigTemplate();
            }
        }
    };

    _updateFieldCenterValue(options){
        options.value.map((opts) => {
           const indexToUpdated = _.findIndex(this.state[options.key], {name: opts.name});
           this.state[options.key][indexToUpdated] = _.find(options.value, {name: opts.name});
        });
        this._updateComponentState({key: options.key, value: this.state[options.key]});
    };

    _renderNoConfigTemplate(){
        return <div className='text-center' style = {{marginTop: this.props.height / 2.5 + 'px', color: 'black'}}>{BusinessToolKitConstants.noConfigTemplate}</div>
    };

    _renderBusinessToolKitTemplate(){
        return <BusinessToolkitWrapperTemplate data = {{stateOptions: this.state, makeFirstItemSelected: true, tableData: this.options.data,
        stateRouter: this.options.stateRouter, showInfo: (this.state.adminAction ? BusinessToolKitConstants[this.state.adminAction?.configName].showInfo : null),
        routerController: (opts) => this.options.routerController(opts), _addMandatoryValues: (fieldOptions, additionalValues) => this._addMandatoryFieldData(fieldOptions, additionalValues),
        params: this.options.params, height: this.options.height, modalOptions: (modalOpts) => this.options.modalOptions(modalOpts),
        stateUpdateOptions: (updatedData, templateName) => this._updateFieldCenterValue({key: templateName, value: updatedData})}}/>
    };

    _updateControlCenterTemplate(){
        _.forEach(this.templates, (template) => {
            let templateFields = this.fieldConvertor._prepareFields({panel: template, fieldData: this.fieldOptions});
            this._updateComponentState({key: template, value: templateFields});
        });
    };

    _convertResponseIntoFields(fieldOptions){
        this.fieldOptions = this.fieldConvertor._convertResponseIntoFields(fieldOptions);
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
        return new Promise((resolve, reject) => {
            const fieldData = {};
            fieldData.data = this.fieldConvertor._prepareFieldValues(nodeConvertor(this._getFieldData(), [], {onlyChanged: true}));
            _.isEmpty(fieldData.data) && delete fieldData.data;
            if(!_.isEmpty(fieldData)){
                this._addMandatoryFieldData(fieldData, {selectedNodes: [this.state.adminAction.modelId],
                    accInfo: this.options.params.accIdAndName, method: 'patch', widgetName: this.state.adminAction.configName});
                this.state.propertyDataCallBackFunc(fieldData).then((result) => {
                    this.propertyDataCallSuccess(result);
                    this._updateCollectionInstance(result.data.result);
                    resolve();
                }).catch((err) => {
                    reject(err);
                });
            }
        });
    };

    _updateCollectionInstance(result){
        if(result?.isSelectedConfig || this.fieldOptions.isSelectedConfig){
            const parsedResult = this.fieldConvertor.parseResults(result);
            if(CollectionInstance.getCollections(this.state.adminAction.configName)?.data){
                CollectionInstance.updateCollections(this.state.adminAction.configName, parsedResult);
            } else {
                CollectionInstance.setCollections(this.state.adminAction.configName, parsedResult);
            }
        }
    };

    _fetchPropertyPage(){
        this.isPropertyPageFetching = true;
        this._toggleComponentLoader(false);
        CommonUtils.dispatchRequest({widgetName: this.state.adminAction.configName, accInfo: this.options.params.accIdAndName,
        query: {selectedNodes: encodeURIComponent(JSON.stringify([this.state.adminAction.modelId]))}, method: 'get'}).then((res) => {
            if(res.data.success){
                this.fieldConvertor = new BusinessToolkitFieldConvertor({configName: this.state.adminAction.configName});
                this._convertResponseIntoFields(res.data.result);
                this._updateControlCenterTemplate();
                this._toggleComponentLoader(true);
                this.isPropertyPageFetching = false;
            }
        })
    };
    
    componentDidUpdate() {
        this._listenTo();
        this.model.selectedRoomConstant = 'business-toolkit';
        if(this.props.data.adminAction !== undefined && (this.state.adminAction !== this.props.data.adminAction)){
            this._updateComponentState({key: 'adminAction', value: this.props.data.adminAction}, () => {
                !this.isPropertyPageFetching && this._fetchPropertyPage();
            });
        }
    };
}

export default BusinessToolkitWrapper;