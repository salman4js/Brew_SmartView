import React from "react";
import _ from "lodash";
import lang from '../commands.constants';
import baseCommandsSetup from "../base.commands.setup";
import AppHeaderConstants from "../../app.header/app.header.constants";
import MetadataFieldTemplateState from "../../../fields/metadata.field.templatestate";
import UserPreferenceSelection from "../../app.header/user.preference.selection/user.preference.selection";
import FacetsItemsFieldView from "../../../fields/facetItemsField/facets.items.field.view";
import {getStorage} from "../../../../Controller/Storage/Storage";

class CommandsUserSettings {
    constructor(signatureOptions) {
        this.status = signatureOptions;
        this.isDisabled = !this.enabled();
        this.defaults = {
            icon: () => this._getUserSettingsIcon(),
            disabled: this.isDisabled,
            onClick: () => this.execute(),
            signature: 'Command-UserSettings'
        }
    };

    enabled(){
        return lang.isCommandsEnabled.userSettings.includes(this.status.roomConstantKey);
    };

    isLoggedInRecep(){
        return JSON.parse(getStorage('loggedInAsRecep'));
    };

    isMultipleLoginEnabled(){
        return JSON.parse(getStorage('multipleLogin'));
    };

    getLoggedInUser(){
        return getStorage('loggedInUser');
    };

    execute(){
        const userPreferenceViewAction = this._setUpUserSettingsBodyView();
        this.status._setState && this.status._setState({key: 'bodyView', value: userPreferenceViewAction});
        const userSettingsBaseCommands = this._getBaseCommandsForUserSettings();
        this.status._setState && this.status._setState({key: 'customState', value: userSettingsBaseCommands});
        this._setUpStepperWizardState();
        this.status.dialogReady();
    };

    _setUpStepperWizardState(){
        this.status.state.stepperWizard.header = lang.USER_SETTINGS.header;
        this.status._setState({key: 'stepperWizard', value: this.status.state.stepperWizard});
    }

    _getBaseCommandsForUserSettings(){
        const userSettingsCommands = [];
        this.baseCommands = baseCommandsSetup({roomConstantKey: lang.USER_SETTINGS.constantKey, params: this.status.params});
        this.baseCommands.defaults.map((commands) => {
            const metadataButtonField = _.clone(MetadataFieldTemplateState.buttonField);
            if(!commands.disabled){
                metadataButtonField.btnValue = commands.value;
                metadataButtonField.onClick = commands.onClick;
                userSettingsCommands.push(metadataButtonField);
            }
        });
        return userSettingsCommands;
    };

    _setUpUserPreferenceSettingsView(){
        var userPreferenceFacetOption = [{
            name: AppHeaderConstants.facetHeader.userPreference,
            facetPosition: 'body',
            view: () => {
                return(
                    <div className = 'app-header-userpreference-selection'>
                        <UserPreferenceSelection params = {this.status.params} refreshState = {() => this.status.refreshState()}/>
                    </div>
                )
            }
        }];
        return <FacetsItemsFieldView options = {{bodyOptions: userPreferenceFacetOption, height: window.innerHeight - 100}}/>
    };

    _setUpUserSettingsBodyView(){
        return(
            <>
                <div className='user-profile-region'>
                    <div className='user-identifier'>
                        <div className='user-profile'>
                            <span>{this.isLoggedInRecep() ? 'R' : 'M'}</span>
                        </div>
                    </div>
                    <div className='user-letter'>
                        {this.isMultipleLoginEnabled() ? this.getLoggedInUser() : 'Manager'}
                    </div>
                </div>
                {this._setUpUserPreferenceSettingsView()}
            </>
        )
    };

    _getUserSettingsIcon(){
      return (
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="white"
               className="bi bi-person-circle" viewBox="0 0 16 16">
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
              <path fill-rule="evenodd"
                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
          </svg>
      )
    };
}

export default CommandsUserSettings;