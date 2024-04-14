import React from 'react';
import {useNavigate} from 'react-router-dom';
import './app.startup.css';
import Variables from "../Variables";
import connector from "../utils/connector";
import _ from 'lodash';
import AppStartupUtils from "../utils/app.startup.utils";
import MetadataFields from "../fields/metadata.fields.view";
import AppStartupConstants from "./app.startup.constants";
import MetadataFieldTemplateState from "../fields/metadata.field.templatestate";
import {appStartupTemplate} from "./app.startup.template";
import {nodeConvertor, validateFieldData} from "../common.functions/node.convertor";
import CustomModal from "../fields/customModalField/custom.modal.view";
import BlockActions from "../fields/block.actions.view/block.actions.view";
import {_checkForSecureConnections} from "../common.functions/common.functions";

class AppStartup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            formView: undefined,
            customModal: {
                show: false,
                onHide: () => this._triggerCustomModal({}),
                header: undefined,
                centered: false,
                restrictBody: true,
                enableFooter: false
            }
        };
        this.formFields = [{
            placeholder: AppStartupConstants.fieldValue.username.placeholder,
            name: AppStartupConstants.fieldValue.username.name,
            width: AppStartupConstants.fieldValue.username.width,
            inlineToast: {
                inlineToastColor: AppStartupConstants.fieldValue.username.inlineToastColor
            }
        }, {
            placeholder: AppStartupConstants.fieldValue.password.placeholder,
            name: AppStartupConstants.fieldValue.password.name,
            width: AppStartupConstants.fieldValue.password.width,
            type: AppStartupConstants.fieldValue.password.type,
            inlineToast: {
                inlineToastColor: AppStartupConstants.fieldValue.username.inlineToastColor
            }
        }];
    };

    templateHelpers(){
        this._prepareTemplateEventHelpers();
        if(!this.state.isLoading){
            return appStartupTemplate(this.templateEventHelpers);
        } else {
            return <BlockActions options = {{message: AppStartupConstants.blockActionsMessage, defaultTemplate: true}} />
        }
    };

    _prepareTemplateEventHelpers(){
        this.templateEventHelpers = {
            formView: () => this._renderFormView()
        }
    };

    _setUpFormView(){
        const formFieldTemplate = [];
        this.formFields.map((fields) => {
            var field = _.clone(MetadataFieldTemplateState.textField);
            field.name = fields.name;
            field.label = fields.label;
            field.placeholder = fields.placeholder;
            field.width = fields.width;
            field.type = fields.type;
            if(fields.inlineToast){
                Object.keys(fields.inlineToast).forEach((inlineToast) => {
                   field.inlineToast[inlineToast] = fields.inlineToast[inlineToast];
                });
            }
            formFieldTemplate.push(field);
        });
        var signInField = _.clone(MetadataFieldTemplateState.buttonField);
        signInField.btnValue = AppStartupConstants.fieldValue.singIn.value;
        signInField.onClick = () => this.onSignIn();
        signInField.customClass = 'sign-in-button';
        formFieldTemplate.push(signInField);
        this.setState({formView: formFieldTemplate});
    };

    _openPerspective(options){
        if(options['multipleLogins'] && options['multipleLogin'].length > 0){
            this.props.options.navigate(`/${options.hostId}-${options.username}/choose-login`, {replace: true});
        } else {
            this.props.options.navigate(`/${options.hostId}-${options.username}/dashboard-container`, {replace: true});
        }
    };

    signInUser(result){
        return new Promise((resolve, reject) => {
            connector.post(`${Variables.hostId}/login-lodge`, result).then((res) => {
                if(res.data.success){
                    resolve({success: res.data.success, isLocked: res.data['isLocked'], lockedMessage: res.data['lockedMessage'],
                        hostId: res.data.hostId, token: res.data.token});
                } else {
                    resolve({isLocked: false, message: res.data.message});
                }
            }).catch(() => {
                reject();
            });
        })
    };

    _setCookies(name, value){
        document.cookie = name + "=" + value + "" + "; path=/";
    };

    _fetchConfigData(){
      return new Promise((resolve, reject) => {
          this.appStartUpUtils.fetchConfig().then((result) => {
            resolve(result);
          }).catch((err) => {
              reject(err);
          });
      });
    };

    _triggerCustomModal(options){
        this.state.customModal.show = options.show;
        this.state.customModal.header = options.header;
        this.state.customModal.centered = options.centered;
        this.setState({customModal: this.state.customModal});
    };

    onSignIn(){
        validateFieldData(this.state.formView, (result) => this.setState({formView: result})).then((result) => {
           if(result.length === 0){
                this.setState({isLoading: true});
                var fieldData = nodeConvertor(this.state.formView);
                this.signInUser(fieldData).then((res) => {
                    if(res.success && !res.isLocked){
                        this.appStartUpUtils = new AppStartupUtils({accId: res.hostId});
                        this._fetchConfigData().then((result) => {
                            this._setCookies('livixius-cookies', res.token);
                            result['hostId'] = res.hostId;
                            this._openPerspective(result);
                        }).catch(() => {
                            this.setState({isLoading: false});
                            this._triggerCustomModal({header: AppStartupConstants.configFetchError, centered: false, show: true});
                        });
                    } else if(res.isLocked){
                        this.setState({isLoading: false});
                        this._triggerCustomModal({header: res.lockedMessage, centered: false, show: true});
                    } else {
                        this.setState({isLoading: false});
                        this._triggerCustomModal({header: res.message, centered: false, show: true});
                    }
                });
           }
        });
    };

    _renderFormView(){
        return <MetadataFields data = {this.state.formView} updateData = {(updatedData) => this.setState({formView: updatedData})} />
    };

    _renderCustomModal(){
        return <CustomModal modalData = {this.state.customModal}/>
    };

    componentDidMount() {
      this._setUpFormView();
    };

    render(){
        return(
            <>
                {this.state.customModal.show && this._renderCustomModal()}
                {this.templateHelpers()}
            </>
        )
    };

    componentDidUpdate() {
        if(_checkForSecureConnections()){
            this.props.options.navigate('/rejected', {replace: true});
        }
    }
}

function AppStartUpWrapper(){
    var navigate = useNavigate();
    return <AppStartup options = {{navigate: navigate}}/>
};

export default AppStartUpWrapper;