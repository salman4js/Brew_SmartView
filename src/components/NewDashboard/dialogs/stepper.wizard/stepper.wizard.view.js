import React from 'react';
import _ from 'lodash';
import MetadataFieldsView from "../../../fields/metadata.fields.view";
import { templateHelpers } from './stepper.wizard.template';
import './stepper.wizard.view.css';
import {nodeConvertor, validateFieldData} from "../../../common.functions/node.convertor";

class StepperWizard extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      data: props.data,
      bodyView: props.bodyView,
      stepId: 0
    };
    this.isStepViews = false;
    this.footerViewRef = React.createRef()
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
      callFooter: this.renderPassedFooter.bind(this),
      callBodyView: this.renderBodyView.bind(this),
      bodyViewHeight: window.innerHeight - (this.footerViewRef?.current?.offsetHeight + 40)
    };
  };
  
  // Onclick close stepper wizard!
  closeWizardOnClick(event){
    event.preventDefault();
    event.stopPropagation();
    if(_.isFunction(this.state.data.onHide)){
      this.state.data.onHide()
    } else {
      this.state.data.show = false;
      this._updateStateValue({key: 'data', value: this.state.data});
    }
  };

  _updateWizardStepBodyView(value, stepId){
      this.state.bodyView[stepId || this.state.stepId] = value;
      this._updateStateValue({key: 'bodyView', value: this.state.bodyView});
  };

  // Render passed body view!
  renderBodyView(){
      const passingProps = this.state.data.passingProps;
      if(!_.isArray(this.state.bodyView)){
            return this.state.bodyView ? this.state.bodyView(this.state.data[passingProps]) : this.state.data.bodyView();
      } else {
            this.isStepViews = true;
            return(
                <div className = 'stepper-wizards-view-steps'>
                  <MetadataFieldsView data = {this.state.bodyView[this.state.stepId]} updateData = {(updatedValue) => this._updateWizardStepBodyView(updatedValue)}/>
                </div>
            )
      }
  };

  nextStep(stepId){
      validateFieldData(this.state.bodyView[this.state.stepId], (updatedData) => this._updateWizardStepBodyView(updatedData)).then((misMatchFields) => {
          if(misMatchFields.length === 0){
            const currentStepFieldData = nodeConvertor(this.state.bodyView[this.state.stepId]);
            if(_.isFunction(this.state.data.callBackBeforeNextStep[stepId].callBackMethod)){
                const nextStepFieldUpdate = this.state.data.callBackBeforeNextStep[stepId].callBackMethod({currentStepFieldData: currentStepFieldData, nextStepId: this.state.stepId + 1});
                if(nextStepFieldUpdate.updateNextStepFieldValue){
                    this._updateWizardStepBodyView(nextStepFieldUpdate.value, this.state.stepId + 1);
                }
            }
            this._updateStateValue({key: 'stepId', value: this.state.stepId + 1});
          }
      });
  };

  prevStep(){
      this._updateStateValue({key: 'stepId', value: this.state.stepId - 1});
  };

  _setUpNextStepHandlers(){
      if(this.isStepViews && this.state.data.footerAttribute === 'buttonField'){
          this.state.data.footerView[this.state.stepId].map((footerAttr) => {
              if(this.state.data.nextStep.includes(footerAttr.id)){
                  footerAttr.onClick = () => this.nextStep(footerAttr.id);
              }
              if(this.state.data.prevStep.includes(footerAttr.id)){
                  footerAttr.onClick = () => this.prevStep();
              }
          });
      }
  };
  
  // Render passed footer view!
  renderPassedFooter(){
      this.state.data.enableFooter && !this.state.isFooterViewRendered && this.setState({isFooterViewRendered: true});
      if(this.state.data.enableFooter){
          if(!_.isArray(this.state.data.footerView)){
              return(
                  <div ref = {this.footerViewRef}>
                    {this.state.data.footerView()}
                  </div>
              )
          } else {
              this._setUpNextStepHandlers();
              return(
                  <div className = 'text-center' ref = {this.footerViewRef}>
                      <MetadataFieldsView data = {this.state.data.footerView[this.state.stepId]} />
                  </div>
              )
          }
      }
  };
  
  // Update the state value if the parent props changes!
  _updateStateValue(options){
    this.setState({[options.key]: options.value});
  };
  
  componentDidUpdate(prevProps){
    if(!_.isEqual(this.state.data, this.props.data)){
      this._updateStateValue({key: 'data', value: this.props.data});
    }
  };
  
  render(){
    return this.state.data.show && this.templateHelpers();
  };
};

export default StepperWizard;
