import React from 'react';
import InlineToast from '../../InlineToast/Inline.toast.view'

class TextField extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  };

  // Check input limit!
  checkLimit(event){
    const limit = this.props.data.limitValue !== undefined ? this.props.data.limitValue : 0; // By default limit value would be zero!
    var isGreater = event.target.value > limit;

    if(this.props.data.limitValue !== undefined){
      this.handleLimit(isGreater, event);
    } else {
      this.props.handleInputChange(this.props.index, event, this.props.data.attribute)
    }
  };

  // Handle input event separately!
  handleEvents(event){
    this.props.data.eventKeyRequired && this.props.handleInputChange(this.props.index, event, this.props.data.attribute);
  };

  // Handle limit value from the field data!
  handleLimit(isGreater, event){
    if(!isGreater){
      this.props.handleInputChange(this.props.index, event, this.props.data.attribute)
    } else {
      this.props.toggleButtonValue()
    }
  };

  // Text Field inline toast message!
  _showInlineToast(){
    return(
        this.props.data.inlineToast.isShow && (
            <InlineToast message = {this.props.data.inlineToast.inlineMessage} />
        )
    )
  };

  // Get value for the input field!
  getValue(){
    if(this.props.data.value !== undefined){
      return this.props.data.value;
    } else if(this.props.data.defaultValue !== undefined){
      return  this.props.data.defaultValue;
    } else {
      return ''; // Showing here as empty string, which will not be considered in nodeConvertor function, so its safe.
    }
  };

  // Get value for the placeholder!
  getValueForPlaceholder(){
    return this.props.data.placeholder;
  };

  // Get type of the input fields based on the data!
  getType(){
    return this.props.data.type !== undefined ? this.props.data.type : "text"; // Setting the default type as 'text'
  };

  render(){
    return(
        <div className="modal-gap" style = {{width: this.props.data.width, padding: this.props.data.padding}}>
          {this.props.data.label && (
              <label style={{ color: "black" }}> {this.props.data.label} </label>
          )}
          <input type={this.getType()} className="form-control" aria-describedby="input-field" value = {this.getValue()}
                 placeholder={this.getValueForPlaceholder()} onKeyDown = {(event) => this.handleEvents(event)} onChange = {(event) => this.checkLimit(event)} />
          {this.props.data?.inlineToast !== undefined && (
              this._showInlineToast()
          )}
        </div>
    )
  };
};

export default TextField;