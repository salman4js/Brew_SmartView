// This class analyze the user input and then return the model name from which the data needs to be fetched.
import CollectionInstance from '../global.collection/widgettile.collection/widgettile.collection';
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
  
  // Analyse the user input for roomno as this phase will only consider room number as an input.
  analyzeInput(){
    this.getAllRoomsList();
    // Check if the roomnumber is present in the roomsList model.
    if(!this.roomLists.includes(this.userInput)){
      return this.noIdeaResponse(defaultChatConstants.NO_IDEA_RES_CONSTANTS.no_room_exists);
    };
  };
  
};

export default InputAnalyser;