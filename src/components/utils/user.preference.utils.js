import CollectionInstance from "../../global.collection/widgettile.collection/widgettile.collection";
const sidepanelContainerUtils = require('../utils/sidepanel.container.utils');
const connector = require('../utils/connector').default;
const brewDate = require('brew-date');
const Variables = require('../Variables');

export async function fetchWidgetTilePref(lodgeId){
    // Get the options ready first!
    var datesBetweenCount = CollectionInstance.getModel('widgetTileCollections', 'datesBetweenCount');
    var options = {
        datesBetween: brewDate.getBetween(brewDate.getFullDate('yyyy/mm/dd'), brewDate.addDates(brewDate.getFullDate('yyyy/mm/dd'), datesBetweenCount))
    };
    // Check if the widget collection data already exists in collection instance!
    var widgetTileCollection = CollectionInstance.getCollections('widgetTileCollections');
    if(!widgetTileCollection){
        const result = await connector.post(`${Variables.Variables.hostId}/${lodgeId}/getwidgettilecol`, options);
        CollectionInstance.setCollections('widgetTileCollections', result.data.data);
    }
};

export async function _updateUserPreferences(data){
    var datesBetweenPref = data.datesBetweenCount || 3;
    data.datesBetween = brewDate.getBetween(brewDate.getFullDate('yyyy/mm/dd'), brewDate.addDates(brewDate.getFullDate('yyyy/mm/dd'), datesBetweenPref));
    const result = await connector.post(`${Variables.Variables.hostId}/${data.accId}/updatepref`, data);
    if(result.data.success){
        CollectionInstance.removeCollections('widgetTileCollections'); // WHen the preference updated, Remove the existing collection!
        CollectionInstance.setCollections('widgetTileCollections', result.data.data); // And then update with the new preference collections!
    }
};

// Get rooms list!
export async function getRoomList(lodgeId, fetchPref){
    // Call the widget tile collection here!
    fetchPref?.getWidgetTileCollection && await fetchWidgetTilePref(lodgeId);
    fetchPref?.getUserCollection && await sidepanelContainerUtils.getUserModel({lodgeId: lodgeId})
    var resultData = await connector.post(`${Variables.Variables.hostId}/${lodgeId}/false/roomlodge`);
    // Add the rooms list to the global collections!
    if(resultData.data.success){
        /**
         We fetch the roomsListCollection everytime when the dashboard loads to keep the data in sync.
         or we have to update the room list Collection from every other route when the user changes the any room related model data.
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