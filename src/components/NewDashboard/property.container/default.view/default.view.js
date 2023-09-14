import React from 'react';
import BlockActions from '../../../fields/block.actions.view/block.actions.view';
import { templateHelpers } from './default.view.template';
import { commonLabel } from '../../../common.functions/common.functions.view';


class DefaultView extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      data: props.data,
      params: props.params,
      height: props.height,
      propertyStatusDetails: {
        afterCheckedout: 0,
        afterCleaned: 0,
        inCleaning: 0,
        afterCheckin: 0,
        others: 0
      },
      isComputed: false
    };
  };
  
  // Template helpers!
  templateHelpers(){
    if(this.state.data.isFetched && this.state.isComputed){
      return templateHelpers(this.state);
    } else {
      return <BlockActions />
    }
  };
  
  _toggleComputedState(value){
    this.setState(prevState => ({...prevState, isComputed: value}));
  };
  
  // Update the property details state count!
  _updatePropertyStateCount(stateName, value) {
    // Always clone the nested object within the state!
    this.setState(prevState => ({
      ...prevState,
        propertyStatusDetails: {
        ...prevState.propertyStatusDetails, // Clone the nested object
        [stateName]: value // Update the specific property
      }
    }));
  };
  
  // Update the count of the property details in the state!
  updateStateCollection(model){
    var currentStateValue = this.state.propertyStatusDetails[model.roomStatusConstant];
    this._updatePropertyStateCount(model.roomStatusConstant, currentStateValue + 1);
  };
  
  // Compute collection state details!
  computeCollectionStateDetails(){
    var roomCollection = this.state.data.roomCollection;
    if(roomCollection !== undefined){
      roomCollection.map((model) => {
        this.updateStateCollection(model);
      });
      this._toggleComputedState(true);
    };
  };
  
  // Update state data everytime when the props changes!
  _updateStateData() {
    this.setState(prevState => ({
      ...prevState,
      data: this.props.data
    }), () => {
      this.computeCollectionStateDetails();
    });
  };
  
  // On update component lifecycle method!
  componentDidUpdate(prevProps, prevState){
    if(prevProps !== this.props){
      this._toggleComputedState(false);
      this._updateStateData();
    };
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