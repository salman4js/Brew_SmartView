import CollectionInstance from '../../../global.collection/widgettile.collection/widgettile.collection';
import {editOccupiedUserModel, editRoomModel} from "../../utils/checkin.form.utils";
import CommonUtils from "../common.crud.controller/common.crud.controller";
const _ = require('lodash');
const brewDate = require('brew-date');

// Check if the widget is enabled or not.
function isWidgetEnabled(widgetName){
  return CollectionInstance.getModel('widgetTileCollections', 'widgetTileModelCount')[widgetName];
};

// check for payment tracker data.
export function checkForPaymentTrackerData(data, action){
  var amountFor = {'check-in': 'Initial-Checkin', 'check-out': 'While CheckOut'};
  var defaults = {amountFor: amountFor[action], amount: '0'};
  if(!data.amountFor) {
    data.amountFor = defaults.amountFor;
  }
  if(!data.amount) {
    data.amount = defaults.amount;
  }
  return data;
};

// Function to check if we need to add the user-model to the collection instance!
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
    // Using unshift because we want to add the updatedModel to the beginning of the collections,
    // So that the new updated model will be added in the top of the table in thw widgetTile.
    models.unshift(updatedModel); // Get the updatedUserModel from the server and then update the upcomingCheckout collection model.
    CollectionInstance.setCollections('widgetTileCollections', models, modelName);
  };
};

// remove model from collections
export function removeModelsFromCollections(modelName, data, options){
  var collections = CollectionInstance.getCollections('widgetTileCollections');
  var prebookUserModel = _.find(collections?.data[modelName], function(obj){ // When the user refreshes the page, the collectionInstance data will be lost.
    // So added a null check to prevent the code from breaking.
    return obj[options.keyToCompare] === data[options.keyToSearch];
  });
  if(prebookUserModel){
    CollectionInstance.removeCollections('widgetTileCollections', prebookUserModel, modelName);
  };
};

// Update the room list collection --> Delete the prebookUserId from the room model when prebook has been cancelled.
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
      if(performer === 'pre-book'){ // If the performer is prebooked then we would have to delete the prebook entry from the roomsListCollection model.
        // Otherwise, roomModel will still have prebooked entries stored which will lead to some misbehavior in almost all aspects.
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
        filteredModel.prebookDateofCheckout.push(data.prebookDateofCheckout);
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
    // Atlas, update the room list collections.
    CollectionInstance.updateCollections('roomsListCollection', roomListCollection);
  };
};

// Update widgetTileCollections data based on the model --> this method handles for all widgetTileCollections.
// Conditions param will take only condition in the form of array of objects.
export function _updateWidgetTileCollections(modelName, data, action, conditions){
  // Get the widget collections.
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
  if(action === 'UPDATE'){
    // Find the index to be updated first and then update it.
    // Conditions param can take array of objects as an input, If any one of the condition matches, It will exit out of the loop.
    for(let i = 0; i <= conditions.length -1; i++){
      var indexToBeUpdated = _.findIndex(widgetTileCollections, conditions[i]);
      if(indexToBeUpdated !== -1){
        _.set(widgetTileCollections, indexToBeUpdated, data);
        break;
      }
    }
  };
  // When prebook is being deleted, delete that entry from the widgetTileCollection also.
  CollectionInstance.updateModel('widgetTileCollections', modelName, widgetTileCollections);
};

export function _updateInsightsCount(model, action){
  // Check if the specific widget is enabled or not.
  if(isWidgetEnabled('insights')){
    var widgetTileCollections = _.clone(CollectionInstance.getModel('widgetTileCollections', 'widgetTileModelCount')),
        insightsCollections = widgetTileCollections.insights.value[model],
        updateCount = true;
    if(action === 'INC') insightsCollections.count++;
    if(action === 'DEC'){
      if((insightsCollections.count--) === 0){
        updateCount = false;
      }
    }
    // When the widgetTileModel Count is updated, Update the entire widgetTileModelCount in the collection instance.
    updateCount && CollectionInstance.updateModel('widgetTileCollections', 'widgetTileModelCount', widgetTileCollections);
  } else {

  }
};

// Update widget tile model count for upcomingCheckout and upcomingPrebook.
export function _updateWidgetTileCount(widgetTileModel, action){
  // Get the widgetTileModel.
  var widgetTileCollections = _.clone(CollectionInstance.getModel('widgetTileCollections', 'widgetTileModelCount')),
      updateCount = true;
  if(action === 'INC') widgetTileCollections[widgetTileModel]++;
  if(action === 'DEC') {
    // Added this check here to prevent widgetTileModelCount goes to below zero.
    /**
      REASON: When we do checkout, we always have the current checkout date which is nothing but the today's date,
      so there is no way yet to verify with the widgetTileModel's datesBetween params to check if the widgetTileModelCount has to be updated or not.
      common check to all the widgetTileModel to prevent going below zero (Negative Value).
     **/
    if((widgetTileCollections[widgetTileModel]--) === 0){
      updateCount = false;
    }
  }
  // When the widgetTileModel Count is updated, Update the entire widgetTileModelCount in the collection instance.
  updateCount && CollectionInstance.updateModel('widgetTileCollections', 'widgetTileModelCount', widgetTileCollections);
};




















