import React from 'react';

class LabelField extends React.Component {
  
  constructor(props){
    super(props);
    this.state = props.data;
  }

  render(){
    return(
      <div className = 'modal-gap'>
        <label style = {{color: 'black'}}> {this.state.label} </label>
        <label style = {{color: 'black'}}> {this.state.labelData} </label>
      </div>
    )
  }
}

export default LabelField;