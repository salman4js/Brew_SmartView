import React from 'react';
import _ from "lodash";
import './app.header.view.css';
import baseCommandsSetup from "../commands/base.commands.setup";
import AppHeaderTemplate from "./app.header.template";
import AppHeaderConstants from "./app.header.constants";
import MetadataFields from "../../fields/metadata.fields.view";

class AppHeaderView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            appHeaderCommands: undefined,
            stepperWizard: {
                show: false,
                header: undefined,
                enableFooter: true,
                additionalParams: [],
                passingProps: 'additionalParams',
                footerView: this._renderStepperWizardFooterView.bind(this),
                onHide: this._toggleStepperWizard.bind(this)
            },
            bodyView: undefined,
            customState: undefined
        };
        this.params = this.props.params;
    };
    
    _prepareTemplateEventHelpers(){
        this.state.isLoading && this._setUpAppHeaderCommands();
        this.templateEventHelpers = {
            appHeaderCommands: this.state.appHeaderCommands,
            stepperWizard: this.state.stepperWizard,
            stepperWizardBodyView: () => this._renderStepperWizardBodyView()
        }
    };

    _getAppHeaderCommands(){
        var appHeaderCommands = [];
        this.appHeaderCommands = baseCommandsSetup({roomConstantKey: AppHeaderConstants.appHeaderConstantKey,
            params: this.params, state: this.state, _setState: (options) => this.updateStateComponent(options),
            goToLocation: (options) => this.props.goToLocation(options),
            dialogReady: () => this._toggleStepperWizard(true), refreshState: () => this.props.refreshState()});
        this.appHeaderCommands.defaults.map((commands) => {
            if(!commands.disabled){
                appHeaderCommands.push(commands);
            }
        });
        return appHeaderCommands;
    };

    _setUpAppHeaderCommands() {
        var appHeaderCommands = this._getAppHeaderCommands();
        this.updateStateComponent({
            key: 'appHeaderCommands',
            value: appHeaderCommands,
            nextFunc: () => this._toggleLoader(false)
        });
    };

    _toggleStepperWizard(val){
        this.state.stepperWizard.show = val;
        if(!val){
            this.state.stepperWizard.header = undefined;
            this.state.bodyView = undefined;
            this.state.customState = undefined;
        }
        this.updateStateComponent({key: 'stepperWizard', value: this.state.stepperWizard});
    };

    _toggleLoader(val){
      this.updateStateComponent({key: 'isLoading', value: val});
    };

    _renderStepperWizardFooterView(){
      return(
          <div className = 'app-header-footer'>
              <MetadataFields data = {this.state.customState} updateData = {(updatedData) => this.setState({customState: updatedData})}/>
          </div>
      )
    };

    _renderStepperWizardBodyView(){
        return this.state.bodyView;
    };

    updateStateComponent(options){
      this.setState({[options.key]: options.value}, () => {
         _.isFunction(options.nextFunc) && options.nextFunc();
      });
    };

    templateHelpers(){
        this._prepareTemplateEventHelpers();
        if(!this.state.isLoading){
            const appHeaderTemplate = new AppHeaderTemplate(this.templateEventHelpers);
            return appHeaderTemplate._renderAppHeaderTemplate();
        }
    };

    render(){
      return this.templateHelpers();
    };
}

export default AppHeaderView;