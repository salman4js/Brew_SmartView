import React from 'react';
import { templateHelpers } from './stepper.wizard.template';
import './stepper.wizard.view.css';

class StepperWizard extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      data: props.data
    };
  };
  
  // Template helpers!
  templateHelpers(){
    this.prepareTemplateHelperOptions();
    return templateHelpers(this.templateHelpersOptions);
  };
  
  // Prepare template helpers options!
  prepareTemplateHelperOptions(){
    this.templateHelpersOptions = {
      propsData: this.state.data,
      closeWizard: this.closeWizardOnClick.bind(this),
      callFooter: this.renderPassedFooter.bind(this)
    };
  };
  
  // Onclick close stepper wizard!
  closeWizardOnClick(){
    this.state.data.onHide();
  };
  
  // Render passed footer view!
  renderPassedFooter(){
    return this.state.data.footerView()
  };
  
  render(){
    return this.templateHelpers();
  };
};

export default StepperWizard;
