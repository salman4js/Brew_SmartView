import CollectionInstance from '../../../../global.collection/widgettile.collection/widgettile.collection';
const axios = require('axios');
const brewDate = require('brew-date');
const Variables = require("../../../Variables");
const _ = require('lodash');

// Function to check if we need to add the usermodel to the collection instance!
function shouldAddToCollections(data, action){
  var date = action !== 'check-in' ? data.prebookdateofcheckin : data.checkout,
    datesBetweenCount = CollectionInstance.getModel('widgetTileCollections', 'datesBetweenCount'),
    updatedDateWithUserPref = brewDate.addDates(date, datesBetweenCount);
  return new Date(updatedDateWithUserPref) > new Date(date);
};

// Add the models to the collections!
function addToCollections(modelName, updatedModel){
  var widgetCollection = CollectionInstance.getCollections('widgetTileCollections'),
    models = widgetCollection?.data?.[modelName]
  if(models && addToCollections){
    models.push(updatedModel); // Get the updatedUserModel from the server and then update the upcomingCheckout collection model.
    CollectionInstance.setCollections('widgetTileCollections', models, modelName);
  };
};

// remove model from collections
function removeModelsFromCollections(modelName, data){
  var collections = CollectionInstance.getCollections('widgetTileCollections');
  var prebookUserModel = _.find(collections?.data[modelName], function(obj){ // When the user refreshes the page, the collectionInstance data will be lost.
    // So added a null check to prevent the code from breaking.
    return obj._id === data.userId;
  });
  if(prebookUserModel){
    CollectionInstance.removeCollections('widgetTileCollections', prebookUserModel, modelName);
  };
};

// Checkin form values!
export async function checkInFormValue(data){
  // Check if the checkin customer details has to be added in the upcomingCheckout widget collection!
  var addCollections = shouldAddToCollections(data, 'check-in');
  var result = await axios.post(`${Variables.Variables.hostId}/${data.lodgeId}/adduserrooms`, data);
  // After the data has been synced with the server, Add the user collection to the global.collections!
  addCollections && addToCollections('upcomingCheckout', result.data.updatedUserModel);
  // If the checkin is happening from prebook side, delete the upcoming prebook collection.
  data.prebook && removeModelsFromCollections('upcomingPrebook', data);
  return result;
};

// Prebook form values!
export async function prebookFormValue(data){
  // Check if the prebook customer details has to be added in the upcomingPrebook widget collection!
  var addCollections = shouldAddToCollections(data, 'pre-book');
  const result = await axios.post(`${Variables.Variables.hostId}/${data.lodgeId}/addprebookuserrooms`, data);
  // After the data has been synced with the server, Add the user collection to the global.collections!
  addCollections && addToCollections('upcomingPrebook', result.data.updatedUserModel);
  // Add the prebookuser into the room model prebook user array in the room colletions!
  var data = {roomId: result.data.updatedUserModel.room, prebookUserId: result.data.updatedUserModel._id, prebookDateofCheckin: data.prebookdateofcheckin};
  _updateRoomListCollection(data, 'ADD');
  return result;
};

// Update the room list collection --> Delete the prebookUserId from the room model when the prebook has been cancelled.
function _updateRoomListCollection(data, action){
  // Get the roomList Collections.
  var roomListCollection = CollectionInstance.getCollections('roomsListCollection').data;
  if(roomListCollection){
    // Look for the prebookUserId in the room model by filtering the room collection by the roomId.
    var filteredCollection = _.filter(roomListCollection, function(model){
      return model._id === data.roomId;
    });
    var filteredModel = filteredCollection[0]; // As of now, only one prebook can be deleted at a time.
    if(filteredCollection && action === 'DELETE'){ // Remove the room model from the roomListCollection if the room model was found.
      _.remove(roomListCollection, function(model){
        return model._id === data.roomId;
      });
      // Delete the prebook user id from the filtered room model.
      _.remove(filteredModel.prebookuser, function(value){
        return value === data.prebookUserId;
      });
      // Delete the prebook date of checkin from the filtered model so the filter table for room transfer can work as expected.
      _.remove(filteredModel.prebookDateofCheckin, function(value){
        return value === data.prebookDateofCheckin;
      });
      // Now, add the filteredModel in the roomListCollection and update the collections.
      roomListCollection.push(filteredModel);
    };
    if(filteredCollection && action === 'ADD'){
      filteredModel.prebookuser.push(data.prebookUserId);
      filteredModel.prebookDateofCheckin.push(data.prebookDateofCheckin);
    };
    CollectionInstance.updateCollections('roomsListCollection', roomListCollection);
  };
};

// Remove prebook data for the room model.
export async function removePrebookData(data){
  const result = await axios.post(`${Variables.Variables.hostId}/${data.lodgeId}/deleteprebookuserrooms`, data);
  result.data.success && _updateRoomListCollection(data, 'DELETE');
  return result;
};
