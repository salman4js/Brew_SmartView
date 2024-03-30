import React from 'react';
import _ from 'lodash';
import './app.header.view.css';
import MetadataFields from "../../fields/metadata.fields.view";
import MetadataFieldTemplateState from "../../fields/metadata.field.templatestate";
import baseCommandsSetup from "../commands/base.commands.setup";
import AppHeaderTemplate from "./app.header.template";
import AppHeaderConstants from "./app.header.constants";
import {getStorage} from "../../../Controller/Storage/Storage";
import UserPreferenceSelection from "./user.preference.selection/user.preference.selection";

class AppHeaderView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stepperWizard: {
                show: false,
                header: AppHeaderConstants.userPreferenceConstants.header,
                enableFooter: true,
                footerView: this._renderStepperWizardFooter.bind(this),
                onHide: this._toggleStepperWizard.bind(this)
            },
            footerFields: undefined
        };
        this.params = this.props.params;
    };

    _getBaseCommands(){
        var footerFields = [];
        this.baseCommands = baseCommandsSetup({roomConstantKey: AppHeaderConstants.constantKey, params: this.params});
        this.baseCommands.defaults.map((commands) => {
            var metadataButtonField = _.clone(MetadataFieldTemplateState.buttonField);
            if(!commands.disabled){
                metadataButtonField.btnValue = commands.value;
                metadataButtonField.onClick = commands.onClick;
                footerFields.push(metadataButtonField);
            }
        });
        return footerFields;
    };

    _setUpStepperWizardFooter(){
        var baseCommands = this._getBaseCommands();
        this.setState({footerFields: baseCommands});
    };

    _prepareTemplateEventHelpers(){
      this.templateEventHelpers = {
          stepperWizard: this.state.stepperWizard,
          stepperWizardBodyView: () => this._renderUserPreferenceView(),
          onUserSettingsIconClick: () => this.onUserSettingsClick()
      }
    };

    onUserSettingsClick(){
        this._toggleStepperWizard(true);
    };

    _toggleStepperWizard(val){
        this.state.stepperWizard.show = val;
        this.setState({stepperWizard: this.state.stepperWizard});
    };

    _renderStepperWizardFooter(){
        return (
            <div className = 'app-header-footer'>
                <MetadataFields data = {this.state.footerFields}/>
            </div>
        )
    };

    _renderUserPreferenceView(){
        return(
            <div className = 'app-header-userpreference-selection'>
                <UserPreferenceSelection params = {this.props.params} refreshState = {() => this.props.refreshState()}/>
            </div>
        )
    };

    templateHelpers(){
        this._prepareTemplateEventHelpers();
        var appHeaderTemplate = new AppHeaderTemplate(this.templateEventHelpers);
        return appHeaderTemplate._renderAppHeaderTemplate();
    };

    componentDidMount() {
        this._setUpStepperWizardFooter();
    };

    render(){
      return(
          <>
              {this.templateHelpers()}
          </>
      )
    };
}

export default AppHeaderView;