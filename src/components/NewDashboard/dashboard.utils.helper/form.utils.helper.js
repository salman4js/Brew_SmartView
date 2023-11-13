import CollectionInstance from '../../../global.collection/widgettile.collection/widgettile.collection';
const _ = require('lodash');
const brewDate = require('brew-date');

// Function to check if we need to add the usermodel to the collection instance!
export function shouldAddToCollections(data, action){
  var dateSelection = {
    'check-in': data.checkout,
    'pre-book': data.prebookdateofcheckin,
    'edit-prebook': data.prebookDateofCheckin,
    'edit-checkin': data.dateofcheckout
  };
  var date = dateSelection[action],
    datesBetweenCount = CollectionInstance.getModel('widgetTileCollections', 'datesBetweenCount'),
    updatedDateWithUserPref = brewDate.addDates(brewDate.getFullDate('yyyy/mm/dd'), datesBetweenCount);
  return new Date(updatedDateWithUserPref) > new Date(date);
};

// Add the models to the collections!
export function addToCollections(modelName, updatedModel){
  var widgetCollection = CollectionInstance.getCollections('widgetTileCollections'),
    models = widgetCollection?.data?.[modelName]
  if(models && addToCollections){
    models.push(updatedModel); // Get the updatedUserModel from the server and then update the upcomingCheckout collection model.
    CollectionInstance.setCollections('widgetTileCollections', models, modelName);
  };
};

// remove model from collections
export function removeModelsFromCollections(modelName, data){
  var collections = CollectionInstance.getCollections('widgetTileCollections');
  var prebookUserModel = _.find(collections?.data[modelName], function(obj){ // When the user refreshes the page, the collectionInstance data will be lost.
    // So added a null check to prevent the code from breaking.
    return obj._id === data.userId;
  });
  if(prebookUserModel){
    CollectionInstance.removeCollections('widgetTileCollections', prebookUserModel, modelName);
  };
};

// Update the room list collection --> Delete the prebookUserId from the room model when the prebook has been cancelled.
export function _updateRoomListCollection(data, action, performer){
  // Get the roomList Collections.
  var roomListCollection = CollectionInstance.getCollections('roomsListCollection').data;
  if(roomListCollection){
    // Look for the prebookUserId in the room model by filtering the room collection by the roomId.
    var filteredCollection = _.filter(roomListCollection, function(model){
      return model._id === data.roomId;
    });
    var filteredModel = filteredCollection[0]; // As of now, only one instance can be processed at a time.
    if(filteredCollection && action === 'DELETE'){ // Remove the room model from the roomListCollection if the room model was found.
      _.remove(roomListCollection, function(model){
        return model._id === data.roomId;
      });
      if(performer === 'pre-book'){ // If the performer is prebook then we would have to delete the prebook entry from the roomsListCollection model.
        // Otherwise roomModel will still have prebook entries stored which will lead to some misbehavior in almost all aspects.
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
    };
    if(filteredCollection && action === 'ADD'){
      if(performer === 'pre-book'){
        filteredModel.prebookuser.push(data.prebookUserId);
        filteredModel.prebookDateofCheckin.push(data.prebookDateofCheckin);
      } else {
        roomListCollection.push(data);
      };
    };
    if(filteredCollection && action === 'EDIT'){
      // Remove that edited entry model from the roomListCollection 
      // and then add the updatedData into the roomsListCollection.
      _updateRoomListCollection(data, 'DELETE');
      // Add the updated data into the roomsListCollection.
      _updateRoomListCollection(data, 'ADD');
    };
    // Atlast, update the room list collections.
    CollectionInstance.updateCollections('roomsListCollection', roomListCollection);
  };
};

// Update widgetTileCollections data based on the model --> this method handles for all widgetTileCollections.
export function _updateWidgetTileCollections(modelName, data, action){
  // Get the widgettile collections.
  var widgetTileCollections = _.clone(CollectionInstance.getModel('widgetTileCollections', modelName));
  if(action === 'DELETE'){
    // Delete the prebook entry from the widget tile collection to keep the data in sync for default.view (New Dashboard).
    _.remove(widgetTileCollections, function(obj){
      return obj._id === data._id; 
    });
  };
  if(action === 'EDIT'){
    // Edit the prebook entry from the widget tile collection to keep the data in sync for default.view and also for filter.table (New Dashboard).
    // Remove the edited entry from the widgetTileCollection.
    _.remove(widgetTileCollections, function(obj){
      return obj._id === data._id;
    });
    widgetTileCollections.push(data); // Add the newly edited data into the widgetTileCollection.
  };
  // When the prebook is being deleted, delete that entry from the widgetTileCollection also.
  CollectionInstance.updateModel('widgetTileCollections', modelName, widgetTileCollections);
};




















