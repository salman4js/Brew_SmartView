import React from 'react';
import _ from 'lodash';
import CardView from '../../../CardView/card.view/card.view';
import { getRoomStatusConstants } from '../../../common.functions/common.functions';
import BlockActions from '../../../fields/block.actions.view/block.actions.view';
import { templateHelpers, widgetTileTemplateHelpers, widgetTileBodyTemplateHelpers } from './default.view.template';
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
      isComputed: false,
      userRoomStatus: [], // User preference room status!
      widgetTile: this.renderWidgetTile.bind(this)
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

  // Toggle computed state!
  _toggleComputedState(value){
    return new Promise((resolve) => {
      this.setState(prevState => ({
        ...prevState,
        isComputed: value
      }), () => resolve());
    });
  };

  // Get card view props!
  getCardViewProps(){
    return {
       header: undefined,
       customData: [],
       height: '250',
       childViewClass: 'text-center widget-tile-listitem-body',
      _showBodyChildView : function(){
        
      }
    }
  };

  showWidgetTiles(){
    return this.makeWidgetTile().map((state) => {
      return widgetTileTemplateHelpers(state);
    });
  };

  renderWidgetTile(){
    // Check if the data is loaded!
    if(this.state.data.isFetched && this.state.isComputed){
      return this.showWidgetTiles();
    } else {
      return <BlockActions />
    }
  };

  // Card body child view list item function!
  cardBodyChildView(roomStatus, roomStatusConstant){
    // Get the count of the roomStatus from the state!
    var countOfTheState = roomStatusConstant !== undefined ? this.state.propertyStatusDetails[roomStatusConstant] : 0;
    return widgetTileBodyTemplateHelpers(roomStatus, countOfTheState);
  };

  // UnMap room status from the state and add it as an array!
  unMapRoomStatus() {
    // Create a copy of the userRoomStatus array because of the asynchronous behaviour of states!
    let updatedUserRoomStatus = [...this.state.userRoomStatus];

    this.state.data.roomStatus.forEach((statusModel) => {
      if (!updatedUserRoomStatus.includes(statusModel.statusName)) {
        updatedUserRoomStatus.push(statusModel.statusName);
      }
    });

    // Update the state with the new userRoomStatus array
    return new Promise((resolve) => {
      this.setState(
        (prevState) => ({
          ...prevState,
          userRoomStatus: updatedUserRoomStatus
        }),
        resolve
      );
    });
  };

  // Widget tile render functions!
  makeWidgetTile(){
    if(this.state.data.isFetched && this.state.isComputed){
      var roomStatusConstants = getRoomStatusConstants(),
        cardViewCollectionProps = [],
        tempData = []; // This is to verify the non added room status constant, and add them to the card body view with the count 0!
      this.state.data.roomCollection.map((model) => {
        var cardViewProps = this.getCardViewProps();
        roomStatusConstants.map((status) => {
          if(model.roomStatusConstant === status){
            // Check if the widgetTile has been already added to the cardViewCollectionProps!
            var isWidgetTileAdded = _.find(cardViewCollectionProps, {customData: [model.roomStatus]});
            if(!isWidgetTileAdded){
              cardViewProps.customData.push(model.roomStatus);
              cardViewProps._showBodyChildView = () => this.cardBodyChildView(model.roomStatus, model.roomStatusConstant);
              cardViewCollectionProps.push(cardViewProps);
            };
          }
        });
      });

      // After we add the roomStatusConstants value to the cardViewCollectionProps, Check what are the roomStatusConstants are missing, and add them with the count 0!
      cardViewCollectionProps.map((cardViewModel) => {
        tempData.push(cardViewModel.customData[0]);
      });
      var nonAddedStatusConstant = _.difference(this.state.userRoomStatus, tempData); // non added room status constant, manually add those to the cardViewCollection 
      // with the count 0!
      return this.addNonAddedStatusConstant(cardViewCollectionProps, nonAddedStatusConstant);
    }; 
  };

  // Add non added status constant to the cardViewCollectionProps!
  addNonAddedStatusConstant(cardViewCollectionProps, nonAddedStatusConstant){
    for (const nonAddedStatusModel of nonAddedStatusConstant){
      var cardViewProps = this.getCardViewProps();
      cardViewProps._showBodyChildView = () => this.cardBodyChildView(nonAddedStatusModel);
      cardViewCollectionProps.push(cardViewProps);
    };
    return cardViewCollectionProps;
  };

  // Update the property details state count!
  _updatePropertyStateCount(stateName, value) {
    return new Promise((resolve) => {
      // Always clone the nested object within the state!
      this.setState(
        (prevState) => ({
          ...prevState,
          propertyStatusDetails: {
            ...prevState.propertyStatusDetails, // Clone the nested object
            [stateName]: value, // Update the specific property
          },
        }),
        () => resolve() // Resolve the promise when the state is updated
      );
    });
  };

  // Update the count of the property details in the state!
  async updateStateCollection(model){
    var currentStateValue = this.state.propertyStatusDetails[model.roomStatusConstant];
    await this._updatePropertyStateCount(model.roomStatusConstant, currentStateValue + 1);
  };
  
  // Compute collection state details!
  async computeCollectionStateDetails(){
    var roomCollection = this.state.data.roomCollection;
    if(roomCollection !== undefined){
      for (const model of roomCollection) {
        if(!this.state.isComputed){ // This is added here because when we swift back from the any other property container, due to the lifecycle methods,
          // this method is being called multiple times hence the count is updating by double the original value!
          await this.updateStateCollection(model);
        }
      }
      await this.unMapRoomStatus();
      await this._toggleComputedState(true);
    }
  }; 
  
  // Update state data everytime when the props changes!
  _updateStateData() {
    return new Promise((resolve) => {
      this.setState(prevState => ({
        ...prevState,
        data: this.props.data
      }), () => {
        this.computeCollectionStateDetails().then(() => {
          resolve();
        })
      });
    });
  };
  
  // On update component lifecycle method!
  componentDidUpdate(prevProps, prevState){
    if(!this.state.isComputed && !_.isEqual(prevProps.data, this.state.data)){ // Using lodash here, because it is essential to do a deep comparision when the state has nested objects!
      this._updateStateData();
    };
  };
  
  // On render component lifecyle method!
  componentDidMount(){
    if(!this.state.isComputed){
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
