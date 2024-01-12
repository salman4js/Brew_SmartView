import React from 'react';
import _ from 'lodash';
import defaultViewConstants from './default.view.constants';
import { getStorage } from '../../../../Controller/Storage/Storage';
import { getRoomStatusConstants, getGreetings } from '../../../common.functions/common.functions';
import CollectionInstance from '../../../../global.collection/widgettile.collection/widgettile.collection';
import BlockActions from '../../../fields/block.actions.view/block.actions.view';
import { templateHelpers, widgetTileTemplateHelpers, widgetTileBodyTemplateHelpers } from './default.view.template';
import propertyContainerConstants from "../property.container.constants";


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
    this.widgetPermissions = {
      recep: defaultViewConstants.RECEP_LEVEL_WIDGETS,
      manager: defaultViewConstants.MANAGER_LEVEL_WIDGETS
    };
    this.routerController = () => this.props.routerController();
    this.isStateRouterNotified = false;
    this.isLoggedInAsRecep =  JSON.parse(getStorage("loggedInAsRecep"));
    this.configurableWidgetTiles = defaultViewConstants.CONFIGURABLE_WIDGET_TILE;
    this.propertyDetailsModel = {}; // Keeping the propertyDetailsModel outside of the state to avoid triggering change event!
    this.propertyStatusMap = {}; // this is to keep track of user defined room status mapping of room status constant.
    // Later add this to global state if this data is further needed!
  };
  
  // Template helpers!
  templateHelpers(){
    if(this.state.data.isFetched && this.state.isComputed){
      return templateHelpers(this);
    } else {
      return <BlockActions />
    }
  };

  // Set the greetings message!
  setGreetings(){
    var greetings = getGreetings(),
      loggedInUser = getStorage('loggedInUser') || 'Manager'; // LoggedInUser will be null when multipleLogin is not set.
    this.greetingMessage = greetings + ', ' + loggedInUser + '!';
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
       height: '200',
       width: '200',
       childViewClass: 'text-center widget-tile-listitem-body',
      _showBodyChildView : function(){
        
      }
    };
  };

  // Show widget view based on the cardCollectionProps data!
  showWidgetTiles(){
    return this.makeWidgetTile().map((state) => {
      return widgetTileTemplateHelpers(state);
    });
  };

  // Notify the state router that the perspective is ready!
  notifyStateRouter(){
    var opts = {
      routerOptions: {
          currentRouter: defaultViewConstants.defaultViewPerspectiveConstant,
          action: 'ADD',
          currentDashboardMode: propertyContainerConstants.DASHBOARD_MODE.default,
          currentTableMode: ''
      }
    };
    this.routerController()._notifyStateRouter(opts);
    this.isStateRouterNotified = true;
  };

  // Render widget view after data fetched and the status count has been computed!
  renderWidgetTile(){
    // Before render the widgetTiles, Set the greetins message!
    this.setGreetings();
    // Check if the data is loaded!
    if(this.state.data.isFetched && this.state.isComputed){
      // Update the state router when the default view perspective is ready!
      !this.isStateRouterNotified && this.notifyStateRouter();
      return this.showWidgetTiles();
    } else {
      return <BlockActions />
    }
  };
  
  // On widget tile click handler!
  onWidgetTileClick(value){
    this.props.dashboardController({navigateToStatusTableView: true, widgetTileModel: this.propertyDetailsModel,
      widgetTileModelCount: this.widgetTileCollection.widgetTileModelCount, dashboardMode: 'statusTableView', userStatusMap: this.propertyStatusMap, selectedRoomConstant: value});
  };

  // Card body child view list item function!
  cardBodyChildView(roomStatusConstant){
    // Get the count of the roomStatus from the state!
    var countOfTheState = roomStatusConstant !== undefined ? this.state.propertyStatusDetails[roomStatusConstant] : 0;
    return widgetTileBodyTemplateHelpers(countOfTheState);
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
  
  // Track of property details model for table data!
  _updatePropertyDetailsModel(roomModel){
    if(this.propertyDetailsModel[roomModel.roomStatus] === undefined){
      this.propertyDetailsModel[roomModel.roomStatus] = [];
    } 
    var isAddedToDetailsModel = _.find(this.propertyDetailsModel[roomModel.roomStatus], {_id: roomModel._id});
    if(!isAddedToDetailsModel){      
      this.propertyDetailsModel[roomModel.roomStatus].push(roomModel);
    };
  };
  
  // Track of user defined room status mapping of the room status constant!
  _updatePropertyStatusMap(roomModel){
    if(this.propertyStatusMap[roomModel.roomStatusConstant] === undefined){
      this.propertyStatusMap[roomModel.roomStatusConstant] = roomModel.roomStatus; 
    };
  };
  
  // Get configured widget tile collections!
  getWidgetTileCollections(){ // This method takes care of configuration of widget tile based on the user preference!
    var widgetTileCollections = CollectionInstance.getCollections('widgetTileCollections'), // Only the user selected preferences will be here!
      preferences = Object.keys(widgetTileCollections.data);
    this.widgetTileCollection = {};
    for (var preference of preferences){
      if(widgetTileCollections.data[preference] !== undefined && typeof widgetTileCollections.data[preference] === 'object'){
        this.widgetTileCollection[preference] = widgetTileCollections.data[preference];
      }
    };
    this.prepareUpcomingNotifications();
  };
  
  // Prepare notifications for 'upcoming' enabled preferences!
  prepareUpcomingNotifications(){
      
  };

  // Widget tile render functions!
  makeWidgetTile(){
    if(this.state.data.isFetched && this.state.isComputed){
      // Get widget tile collection from the global collections!
      this.getWidgetTileCollections();
      var roomStatusConstants = getRoomStatusConstants(),
        cardViewCollectionProps = [],
        tempData = []; // This is to verify the non added room status constant, and add them to the card body view with the count 0!
      this.state.data.roomCollection.map((model) => {
        var cardViewProps = this.getCardViewProps();
        roomStatusConstants.map((status) => {
          if(model.roomStatusConstant === status && model.roomStatus !== undefined){
            this._updatePropertyDetailsModel(model);
            this._updatePropertyStatusMap(model);
            // Check if the widgetTile has been already added to the cardViewCollectionProps!
            var isWidgetTileAdded = _.find(cardViewCollectionProps, {customData: [model.roomStatus]});
            if(!isWidgetTileAdded){
              this.prepareWidgetTile(model, cardViewCollectionProps);
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
      // Add feature widget tile collection props!
      this.addWidgetCollectionToPropertyDetails();
      this.addFeatureWidgetCollection(cardViewCollectionProps);
      if(!CollectionInstance.getCollections('userStatusMap')){
        CollectionInstance.setCollections('userStatusMap', this.propertyStatusMap); // Adding this into global collection because user map can be used anywhere!
      };
      return this.addNonAddedStatusConstant(cardViewCollectionProps, nonAddedStatusConstant);
    }; 
  };
  
  // Prepare widget tile collections!
  prepareWidgetTile(model, cardViewCollectionProps){
    var cardViewProps = this.getCardViewProps();
    cardViewProps.customData.push(model.roomStatus);
    cardViewProps.header = model.roomStatus;
    cardViewProps._showBodyChildView = () => this.cardBodyChildView(model.roomStatusConstant);
    cardViewProps.onClick = (value) => this.onWidgetTileClick(value);
    cardViewCollectionProps.push(cardViewProps);
  };
  
  // Add feature widget collections!
  addWidgetCollectionToPropertyDetails(){
    var widgetTiles = Object.keys(this.widgetTileCollection);
    for (var widgetTile of widgetTiles){
      if(this.widgetTileCollection[widgetTile] !== undefined){
        this.addPropertyStatusDetails(widgetTile);
        var statusName = this.configurableWidgetTiles[widgetTile]; // Get the constant for the widgetCollection name!
        this.propertyDetailsModel[statusName] = this.widgetTileCollection[widgetTile];
      };
    };
  };
  
  // Add property status details with widget tile collection count!
  addPropertyStatusDetails(propertyStatus){
    if(this.state.propertyStatusDetails[propertyStatus] === undefined){
      // Get the count.
      this.state.propertyStatusDetails[propertyStatus] = this.widgetTileCollection.widgetTileModelCount[propertyStatus];
    }
  };

  // Check the widget permission for receptionist users.
  _checkForUserWidgetPermission(widgetConstant){
    return this.isLoggedInAsRecep ? this.widgetPermissions.recep.includes(widgetConstant) : true;
  };

  // Add widget collection to the widget tiles!
  addFeatureWidgetCollection(cardViewCollectionProps){
    var widgetTileCollectionsKey = Object.keys(this.widgetTileCollection);
    for(const widgetTile of widgetTileCollectionsKey){
      var model = {}; // Create an object with a key which is identical to prepareWidgetTile to reuse that function!
      model.roomStatus = this.configurableWidgetTiles[widgetTile];
      model.roomStatusConstant = widgetTile;
      var isWidgetAuthorized = this._checkForUserWidgetPermission(widgetTile);
      if(isWidgetAuthorized && model.roomStatus){ // This will only render the array of object widgetTileModel.
        this._updatePropertyStatusMap(model); // Update property status map!
        this.prepareWidgetTile(model, cardViewCollectionProps);
      }
    }
  };

  // Add non added status constant to the cardViewCollectionProps!
  addNonAddedStatusConstant(cardViewCollectionProps, widgetTileHeaders){
    for (const widgetTileHeader of widgetTileHeaders){
      if(widgetTileHeader !== undefined){
        var cardViewProps = this.getCardViewProps();
        cardViewProps.header = widgetTileHeader;
        cardViewProps._showBodyChildView = () => this.cardBodyChildView();
        cardViewProps.onClick = (value) => this.onWidgetTileClick(value);
        cardViewCollectionProps.push(cardViewProps);
      };
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
  
  // Set the initial state for the property status details!
  _setInitialPropertyStatusDetails(){
    this.state.propertyStatusDetails = {
      afterCheckedout: 0,
      afterCleaned: 0,
      inCleaning: 0,
      afterCheckin: 0,
      others: 0
    };
    this.setState({propertyStatusDetails: this.state.propertyStatusDetails});
  };
  
  // Compute collection state details!
  async computeCollectionStateDetails(){
    var roomCollection = this.state.data.roomCollection;
    if(roomCollection !== undefined){
      for (const model of roomCollection) {
        this.isComputing = true; // this flag is added because when we perform transfer room, two times the props of this component gets updated.
        // which leads to some misleading calculations!
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
