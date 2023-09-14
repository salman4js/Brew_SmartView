import React from 'react';
import { templateHelpers } from './block.actions.template';

class BlockActions extends React.Component {
  
  templateHelpers(){
    return templateHelpers();
  };
  
  render(){
    return this.templateHelpers();
  };
};

export default BlockActions;