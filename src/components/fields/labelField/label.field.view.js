import React from 'react';

class LabelField extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
        labelData: this.props.data
    };
  };

  _updateStateComponent(options){
      this.setState({[options.key]: options.value});
  };

  render(){
    return(
      <div className = 'modal-gap'>
        <div>
          <label style={this.props.data?.customStyle?.label || {color: 'black'}}> {this.state.labelData.label} </label>
        </div>
          {this.state.labelData.value && (
              <div>
                  <label style={this.props.data?.customStyle?.value || {color: 'black'}}> {this.state.labelData.value} </label>
              </div>
          )}
      </div>
    )
  };

    componentDidUpdate() {
        if (this.state.labelData !== this.props.data) {
            this._updateStateComponent({key: 'labelData', value: this.props.data});
      }
  };
}

export default LabelField;