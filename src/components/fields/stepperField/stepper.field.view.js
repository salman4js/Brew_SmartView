import React from 'react';
import './stepper.field.style.css';
import { templateHelpers } from './stepper.field.template';

class StepperField extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      count: props.data.value
    };
    this.options = props.data;
    this.metadataIndex = props.index
  };
  
  // template helpers!
  template(){
    return templateHelpers(this);
  };
  
  // Increase count!!
  incrementValue(){
    this.setState((prevState) => ({
      count: prevState.count + 1
    }), () => {
      this.props.handleInputChange(this.metadataIndex, this.state.count, this.options.attribute)
    });
  };
  
  // Decrement count!
  decrementValue(){
    var currentCount = this.state.count;
    if(currentCount > 0){
      this.setState((prevState) => ({
        count: prevState.count - 1
      }), () => {
        this.props.handleInputChange(this.metadataIndex, this.state.count, this.options.attribute)
      });
    };
  };
  
  render(){
    return this.template();
  };
}; 

export default StepperField;