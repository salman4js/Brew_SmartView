const axios = require('axios');
const Variables = require("../../../Variables");
const {shouldAddToCollections, addToCollections, removeModelsFromCollections,
   _updateRoomListCollection, _updateWidgetTileCollections,  _updateWidgetTileCount, checkForPaymentTrackerData} = require('../../dashboard.utils.helper/form.utils.helper');

// Checkin form values!
export async function checkInFormValue(data){
  // Pass the amountFor, amount here for voucher and payment tracker.
  var data = checkForPaymentTrackerData(data, 'check-in');
  // Check if the checkin customer details has to be added in the upcomingCheckout widget collection!
  var updateCollections = shouldAddToCollections(data, 'check-in');
  var result = await axios.post(`${Variables.Variables.hostId}/${data.lodgeId}/adduserrooms`, data);
  // After the data has been synced with the server, Add the user collection to the global.collections!
  updateCollections && addToCollections('upcomingCheckout', result.data.updatedUserModel);
  updateCollections && _updateWidgetTileCount('upcomingCheckout', 'INC');
  // Update the widgetTileCount for history tile and also, add the entry into the history widgetTileModel.
  result.data.success && _updateWidgetTileCount('history', 'INC');
  result.data.success && addToCollections('history', result.data.updatedUserDbModel);
  // If the checkin is happening from prebook side, delete the upcoming prebook collection.
  data.prebook && removeModelsFromCollections('upcomingPrebook', data, {keyToCompare: '_id', keyToSearch: 'userId'});
  return result;
};

// Checkout form values!
export async function checkoutFormValue(data){
  data._id = data.userid; // To blend in with _updateWidgetTileCollections method.
  var result = await axios.post(`${Variables.Variables.hostId}/${data.lodgeId}/deleteuser`, data);
  result.data.success && _updateWidgetTileCollections('upcomingCheckout', data, 'DELETE');
  result.data.success && _updateWidgetTileCount('upcomingCheckout', 'DEC');
  // If the checkout action is being performed by room transfer module, then delete the history entry from the collection.
  // User transferred data will be handled by the checkin process, all the room transfer details are carried out in checkin process.
  result.data.success && data.isUserTransfered && removeModelsFromCollections('history', result.data.deletedUserModel, {keyToCompare: '_id', keyToSearch: '_id'});
  result.data.success && !data.isUserTransfered && _updateWidgetTileCollections('history', result.data.deletedUserModel, 'UPDATE', [{'_id': result.data.deletedUserModel.userid}, {'_id': result.data.deletedUserModel._id}]);
  return result;
};

// Prebook form values!
export async function prebookFormValue(data){
  // Check if the prebook customer details has to be added in the upcomingPrebook widget collection!
  var updateCollections = shouldAddToCollections(data, 'pre-book');
  const result = await axios.post(`${Variables.Variables.hostId}/${data.lodgeId}/addprebookuserrooms`, data);
  // After the data has been synced with the server, Add the user collection to the global.collections!
  updateCollections && addToCollections('upcomingPrebook', result.data.updatedUserModel); // This is for the default.view (New dashboard tile view)
  updateCollections && _updateWidgetTileCount('upcomingPrebook', 'INC');
  // Add the prebookuser into the room model prebook user array in the room colletions!
  var options = {roomId: result.data.updatedUserModel.room, prebookUserId: result.data.updatedUserModel._id, prebookDateofCheckin: data.prebookdateofcheckin};
  _updateRoomListCollection(options, 'ADD', 'pre-book'); // this is to update the roomsListCollection to keep the data in sync for the filter.table (Room transfer).
  return result;
};

// Remove prebook data for the room model.
export async function removePrebookData(data){
  var updateCollection = shouldAddToCollections(data, 'pre-book');
  const result = await axios.post(`${Variables.Variables.hostId}/${data.lodgeId}/deleteprebookuserrooms`, data);
  result.data.success && _updateRoomListCollection(data, 'DELETE', 'pre-book');
  result.data.success && _updateWidgetTileCollections('upcomingPrebook', result.data.updatedPrebookModel, 'DELETE');
  updateCollection && result.data.success && _updateWidgetTileCount('upcomingPrebook', 'DEC');
  return result;
};

// Edit prebook user details and also update the widgettileCollections upcomingPrebook model.
export async function editPrebookDetails(data){
  var shouldUpdateCollections = shouldAddToCollections(data, 'edit-prebook');
  const result = await axios.post(`${Variables.Variables.hostId}/${data.lodgeId}/editprebookedrooms`, data);
  shouldUpdateCollections && result.data.success && _updateWidgetTileCollections('upcomingPrebook', result.data.updatedPrebookModel, 'EDIT');
  return result;
};

// Edit occupied customer data and also update the userModel in the upcomingCheckout widgetTile collection as well userCollections.
export async function editOccupiedUserModel(data){
  var shouldUpdateCollections = shouldAddToCollections(data, 'edit-checkin');
  const result = await axios.post(`${Variables.Variables.hostId}/${data.lodgeId}/updateoccupieddata`, data);
  // Determine the action based on the datesBetweenCount user preferences.
  const action = shouldUpdateCollections ? 'EDIT' : 'DELETE';
  shouldAddToCollections && result.data.success && _updateWidgetTileCollections('upcomingCheckout', result.data.updatedUserModel, action);
  return result;
};

// Edit existing room model and also update the roomsListCollection.
export async function editRoomModel(data){
  const result = await axios.post(`${Variables.Variables.hostId}/${data.lodgeId}/roomupdater`, data);
  if(result.data.success){
    // Modify the result.data.updatedData just to update the room list collections.
    result.data.updatedData['roomId'] = data.roomId;
    _updateRoomListCollection(result.data.updatedData, 'EDIT');
  };
  return result;
};

// Delete the existing room model.
export async function deleteRoomModel(data){
  const result = await axios.post(`${Variables.Variables.hostId}/${data.lodgeId}/deleteroom`, data);
  result.data.success && _updateRoomListCollection(data, 'DELETE');
  return result;
};













