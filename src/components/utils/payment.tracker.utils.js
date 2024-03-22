import CollectionInstance from "../../global.collection/widgettile.collection/widgettile.collection";
const sidepanelContainerUtils = require('../utils/sidepanel.container.utils');
const multipleLoginUtils = require('../utils/manage.recep.utils');
const axios = require("axios");
const brewDate = require('brew-date');
const Variables = require('../Variables');

// Check if the widget tile collections are already fetched!
export async function fetchWidgetTilePref(lodgeId){
  // Get the options ready first!
  var datesBetweenCount = CollectionInstance.getModel('widgetTileCollections', 'datesBetweenCount');
  var options = {
    datesBetween: brewDate.getBetween(brewDate.getFullDate('yyyy/mm/dd'), brewDate.addDates(brewDate.getFullDate('yyyy/mm/dd'), datesBetweenCount))
  };
  // Check if the widget collection data already exists in collection instance!
  var widgetTileCollection = CollectionInstance.getCollections('widgetTileCollections');
  if(!widgetTileCollection){
    const result = await axios.post(`${Variables.Variables.hostId}/${lodgeId}/getwidgettilecol`, options);
    CollectionInstance.setCollections('widgetTileCollections', result.data.data);
  }
};

// Get rooms list!
export async function getRoomList(lodgeId, fetchPref){
  // Default access token params!
  var params = {
    headers: {
        "x-access-token": localStorage.getItem("token"),
    }
  };
  // Call the widget tile collection here!
  fetchPref?.getWidgetTileCollection && await fetchWidgetTilePref(lodgeId);
  fetchPref?.getUserCollection && await sidepanelContainerUtils.getUserModel({lodgeId: lodgeId})
  var resultData = await axios.post(`${Variables.Variables.hostId}/${lodgeId}/false/roomlodge`, params);
  // Add the rooms list to the global collections!
  if(resultData.data.success){
    /**
      We fetch the roomsListCollection everytime when the dashboard loads to keep the data in sync.
      or we have to update the roomlistCollection from every other route when the user changes the any room related model data.
      By keeping this in this way, with minimal changes the roomsListCollection will be sync with the server.
      In the future, if the requirement was to keep the dashboard much faster then we might want to change this and
      update the collection from all the routes where and all the room related data changes.
    **/
    var roomListCollections = CollectionInstance.getCollections('roomsListCollection');
    if(!roomListCollections){
      CollectionInstance.setCollections('roomsListCollection', resultData.data.message);
    } else {
      CollectionInstance.updateCollections('roomsListCollection', resultData.data.message);
    };
  };
  return resultData;
}

// Get payment tracker details for specific rooms!
export async function getPaymentTracker(lodgeId, data){
  return await axios.post(`${Variables.Variables.hostId}/${lodgeId}/getpaymenttracker`, data);
}

// Get payment details for receipt generation!
export async function getPaymentDetails(lodgeId, data){
  return await axios.post(`${Variables.Variables.hostId}/${lodgeId}/getpaymentdetails`, data);
}

// Delete single payment tracker instance!
export async function deletePaymentTracker(lodgeId, data){
  return await axios.post(`${Variables.Variables.hostId}/${lodgeId}/deletesinglepayment`, data);
};

// Get all tha payment tracker regardless of the prebook and checkout status!
export async function getAllPaymentTracker(data){
  return await axios.post(`${Variables.Variables.hostId}/${data.lodgeId}/getallpaymenttracker`, data);
}