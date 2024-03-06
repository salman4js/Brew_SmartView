import React from 'react';

class PropertyAlertContainer extends React.Component {
  
  constructor(props){
    super(props);
    this.state = props.data || {};
    this.viewRef = React.createRef();
    this.viewRefHeight = props.viewRefHeight;
  };
  
  getClassName(status){
    return status === 'success' ? 'property-success-container' : 'property-error-container';
  };
  
  getLogo(status){
    return status === 'success' ? this._successView() : this._errorView();
  };
  
  _errorView(){
    return(
      <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill="red" d="M2.93 17.07A10 10 0 1 1 17.07 2.93A10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 5h2v6H9V5zm0 8h2v2H9v-2z"/>
      </svg>
    )
  };
  
  _successView(){
    return(
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="green" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
      </svg>
    )
  };
  
  renderAlertContainer(){
    return this.state.map((options) => {
      return(
        <div className = {this.getClassName(options.status)}>
          <span className = "property-alert-container-logo">
            {this.getLogo(options.status)}
          </span>
          <span className = "property-alert-container-message">
            {options.message}
          </span>
        </div>
      )
    })
  };

  // Update the height in the parent component!
  sendViewHeightToParentView(){
    // Add extra +5 in the clientHeight for better view.
    this.viewRefHeight && this.viewRefHeight((this.viewRef.current.clientHeight) + 5);
  };

  componentDidMount() {
    this.sendViewHeightToParentView();
  };

  render(){
    return (
        <div ref = {this.viewRef}>
          {this.renderAlertContainer()}
        </div>
    )
  }
};

export default PropertyAlertContainer;