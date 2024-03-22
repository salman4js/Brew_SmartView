import React from 'react';
import './block.action.template.css';
import { templateHelpers } from './block.actions.template';

class BlockActions extends React.Component {

  constructor(props) {
    super(props);
    this.options = props.options;
  }
  
  templateHelpers(){
    return templateHelpers(this.options);
  };
  
  render(){
    return this.templateHelpers();
  };
};

export default BlockActions;