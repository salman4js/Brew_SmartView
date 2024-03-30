import React from "react";
import AppHeader from '../../../Assets/logo512.png';
import StepperWizard from "../dialogs/stepper.wizard/stepper.wizard.view";

class AppHeaderTemplate {
    constructor(options) {
        this.options = options;
    };

    _renderStepperWizardBody(){
      return this.options.stepperWizardBodyView();
    };

    _renderStepperWizard(){
        return <StepperWizard data = {this.options.stepperWizard} bodyView = {(data) => this._renderStepperWizardBody(data)}/>
    };

    _renderAppHeaderTemplate(){
        return(
            <nav className="navbar sticky-top navbar-expand-lg navbar-dark navbar-bg">
                <a className="navbar-brand metadata-navbar-leftside">
                    <img src={AppHeader} width="300" height="30" className="d-inline-block align-top" alt="" />
                </a>
                <div className="metadata-navbar-rightside brew-cursor" onClick = {() => this.options.onUserSettingsIconClick()}>
                    {this.options.stepperWizard.show && this._renderStepperWizard()}
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="white"
                         className="bi bi-person-circle" viewBox="0 0 16 16">
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                        <path fill-rule="evenodd"
                              d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                    </svg>
                </div>
            </nav>
        )
    }
}

export default AppHeaderTemplate;