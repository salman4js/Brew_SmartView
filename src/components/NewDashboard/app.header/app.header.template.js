import React from "react";
import AppHeader from '../../../Assets/logo512.png';
import StepperWizard from "../dialogs/stepper.wizard/stepper.wizard.view";

class AppHeaderTemplate {
    constructor(options) {
        this.options = options;
    };

    _renderStepperWizard() {
        return <StepperWizard data={this.options.stepperWizard} bodyView={(data) => this.options.stepperWizardBodyView(data)}/>
    };

    _renderAppHeaderCommands(){
        return this.options.appHeaderCommands.map((options) => {
            return(
                <span className = 'app-header-actions' onClick = {() => options.onClick()}>
                    {options.icon ? options.icon() : options.value}
                </span>
            )
        });
    };

    _renderAppHeaderTemplate(){
        return(
            <nav className="navbar sticky-top navbar-expand-lg navbar-dark navbar-bg">
                <a className="navbar-brand metadata-navbar-leftside">
                    <img src={AppHeader} width="300" height="30" className="d-inline-block align-top" alt="" />
                </a>
                <div className="metadata-navbar-rightside brew-cursor">
                    {this.options.stepperWizard.show && this._renderStepperWizard()}
                    {this._renderAppHeaderCommands()}
                </div>
            </nav>
        )
    }
}

export default AppHeaderTemplate;