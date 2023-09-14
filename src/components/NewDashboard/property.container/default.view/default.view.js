import React from 'react';
import { templateHelpers } from './default.view.template';


class DefaultView extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      data: props.data,
      params: props.params
    };
  };
  
  // Template helpers!
  templateHelpers(){
    return templateHelpers(this.state);
  };
  
  render(){
    return(
      <div className = 'default-widget-tile-view'>
        {this.templateHelpers()}
      </div>
    )
  };
};

export default DefaultView;