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
  
  prepareTemplateHelperEvents(){
    this.events = {
      
    };
  };

  // Prepare the messages for the chat.performer.view
  prepareMessages() {
    this.messages = []; // Clear out the data to avoid duplicating the data!
    var chatCollections = CollectionInstance.getCollections('chat-collections');
    chatCollections.data.forEach((options) => {
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
    return templateHelpers(this.messages);
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