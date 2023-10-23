import React from 'react';
import _ from 'lodash';
import CollectionInstance from '../../global.collection/widgettile.collection/widgettile.collection';
import './chat.performer.css';
import { templateHelpers } from './chat.performer.template';

class ChatPerformer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data: props.data
    };
    this.classNames = {
      chatBotMessage: 'chat-bot-message',
      userInputMessage: 'user-input-message'
    };
    this.messages = [];
  };
  
  // View's event constructor.
  prepareTemplateHelperEvents(){
    this.events = {
      moreDetails: this.moreDetails.bind(this)
    };
  };
  
  // Get the targeted model from the room collection!
  getTargetedModel(targetedModelId){
    var roomColl = CollectionInstance.getCollections('roomsListCollection').data,
      targetedModel = _.find(roomColl, function(obj){
        return obj._id === targetedModelId;
      });
    return targetedModel;
  };
  
  // More details handler!
  moreDetails(chatIndex){
    // Extract the targeted model id from the chat-collections and chatIndex is usefull to know which is the targetted model.
    var targetedModelId = this.chatCollections.data[chatIndex].roomModel;
    // Find the targeted model in the room collections!
    var targetedModel = this.getTargetedModel(targetedModelId);
    this.props.goToLocation && this.props.goToLocation(targetedModel);
  };

  // Prepare the messages for the chat.performer.view
  prepareMessages() {
    this.messages = []; // Clear out the data to avoid duplicating the data!
    this.chatCollections = CollectionInstance.getCollections('chat-collections');
    this.chatCollections.data.forEach((options) => {
      let messageData = {
        message: options.content,
        className: options.sender === 'user' ? this.classNames.userInputMessage : this.classNames.chatBotMessage,
        details: options.details ? options.detailsMsg : undefined
      };
      this.messages.push(messageData);
    });
  };
  
  // Update state value with newly updated props values!
  _updateStateValue(updatedValue){
    this.setState({data: updatedValue}, () => {
      this.prepareMessages();
    });
  };
  
  templateHelpers(){
    this.prepareMessages();
    this.prepareTemplateHelperEvents();
    return templateHelpers(this.messages, this.events);
  };
  
  componentDidUpdate(){
    if(!_.isEqual(this.state.data, this.props.data)){
      this._updateStateValue(this.props.data);
    };
  };
  
  render(){
    return this.templateHelpers();
  };
};

export default ChatPerformer;