// This class analyze the user input and then return the model name from which the data needs to be fetched.
import CollectionInstance from '../../global.collection/widgettile.collection/widgettile.collection';
import _ from 'lodash';
import defaultChatConstants from './chat.default.constants';

class InputAnalyser {
  
  constructor(userInput){
    this.userInput = userInput; // For phase one, the userInput always going to be the roomno!
  };
  
  // Retrieve all the rooms list as this phase 1 will only consider room number as an input.
  getAllRoomsList(){
    this.roomLists = CollectionInstance.getAttribute('roomsListCollection', 'roomno');
  };
  
  // No idea response generator!
  noIdeaResponse(constant){
    return defaultChatConstants.OUTPUT_CONSTANTS[constant];
  };
  
  // Get response based on the status!
  getResponse(isRoomModelReq, isUserModelReq){
    var objectDetails = defaultChatConstants.OBJECT_DETAILS,
      extractedDetails = {};
    var {requiredDetails, textFormer} = isUserModelReq ? objectDetails.occupied_obj_details : objectDetails.available_obj_details;
    for (var details of requiredDetails){
      if(this.roomModel[details] || this.userModel[details]){
        extractedDetails[details] = this.roomModel[details] || this.userModel[details];
      };
    };
    return textFormer(extractedDetails);
  };
  
  // Check for the occupied status and extract data based on the occupied status!
  checkAndFormData(){
    var isRoomOccupied = (this.roomModel.roomStatusConstant === defaultChatConstants.OCCUPIED_STATUS_CONSTANT); // isRoomOccupied represents here if we need userModel also
    // to be populated in the response or not.
    return isRoomOccupied ? this.getResponse(true, true) : this.getResponse(true, false); // first parameter represents the roomColl required
    // and the second represents the userColl required.
  };
  
  getUserAndRoomModel(){
    var self = this;
    this.roomModel = _.find(this.roomColl.data, function(model){
      return model.roomno === self.userInput;
    });
    this.userModel = _.find(this.userColl.data, function(model){
      return model.roomno === self.userInput;
    });
  };
  
  // Check for the room details from the roomListCollection when the room no actually exists!
  checkRoomDetails(){
    var self = this;
    this.roomColl = CollectionInstance.getCollections('roomsListCollection');
    this.userColl = CollectionInstance.getCollections('userCollections');
    // Get the room model and user model
    this.getUserAndRoomModel();
    // Check room status, based on the extract the required data!
    return this.checkAndFormData();
  };
  
  // Analyse the user input for roomno as this phase will only consider room number as an input.
  analyzeInput(){
    this.getAllRoomsList();
    // Check if the roomnumber is present in the roomsList model.
    if(!this.roomLists.includes(this.userInput)){
      return this.noIdeaResponse(defaultChatConstants.NO_IDEA_RES_CONSTANTS.no_room_exists);
    } else {
      return this.checkRoomDetails(); // When the room exists, check for its details!
    };
  };
  
};

export default InputAnalyser;