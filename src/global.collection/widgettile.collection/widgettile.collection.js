// Widget tile collection singleton class!
import widgetTileModelSchema from './widgettile.schema';
import _ from 'lodash';

class Collections {
  constructor(){
    if(widgetTileModelSchema.instance){
      throw new Error('Widget tile collection is already initiated.');
    } else {
      widgetTileModelSchema.instance = this;
    }
  };
  
  // Add models and collections to the widget tile model schema!
  setCollections(propertyName, data){
    // First check if the collections are already created, If not create it.
    var isCollectionCreated = this.isCollectionsCreated(propertyName);
    var isCollectionFetched = this.isCollectionFetched();
    if(isCollectionCreated){
      !isCollectionFetched ? this.addCollections(propertyName, data) : this.addToCollections(propertyName, data);
      this.analyseAndSetIsFetched(propertyName);
    } else {
      // When the collections are not created, create it and then continue with the set collections method!
      this.createCollections(propertyName);
      this.setCollections(propertyName, data);
    }
  };
  
  // Add new collections!
  addCollections(propertyName, data){
    widgetTileModelSchema.collections[propertyName].data = data;
    widgetTileModelSchema.collections[propertyName].name = propertyName;
  };
  
  // When the collections are already created, we then want to append new data into the collection's data array!
  // Add to collections!
  addToCollections(propertyName, data){
    var collectionData = widgetTileModelSchema.colletions[propertyName].data;
    var isDataAdded = this.checkForDuplicateCollectionData(collectionData, data);
    if(!isDataAdded){
      collectionData.push(data);
    };
  };
  
  // Check if the data has been already added to collection data!
  checkForDuplicateCollectionData(collectionData, data){
    // Check for duplicate data
    var isDataAdded = _.find(collectionData, function(obj){
      return obj === data;
    });
    return isDataAdded;
  };
  
  // Analyse and set is Fetched!
  analyseAndSetIsFetched(propertyName){
    var propertyCollections = this.getCollections(propertyName);
    if(propertyCollections.data.length > 0){
      widgetTileModelSchema.collections[propertyName].isFetched = true;
    } else {
      widgetTileModelSchema.collections[propertyName].isFetched = false;
    }
  };
  
  // Remove particular models and colletion from the widget tile model schema!
  removeCollections(data, model){
    
  };
  
  // Check if the collections are already created!
  isCollectionsCreated(propertyName){
    return widgetTileModelSchema.collections[propertyName];
  };
  
  // Get collections by property name!
  getCollections(propertyName){
    return widgetTileModelSchema.collections[propertyName];
  };
  
  // Is collections fetched!
  isCollectionFetched(propertyName){
    return widgetTileModelSchema.collections[propertyName]?.isFetched;
  };
  
  // Create collections inside widgetTileModelSchema!
  createCollections(propertyName){
    var isCollectionCreated = this.isCollectionsCreated(propertyName);
    if(isCollectionCreated){
      throw new Error('Collections are already created!')
    } else {
      widgetTileModelSchema.collections[propertyName] = {};
      widgetTileModelSchema.collections[propertyName].data = [];
      widgetTileModelSchema.collections[propertyName].isFetched = false; 
      widgetTileModelSchema.collections[propertyName].name = undefined;
    }
  };
}

let CollectionInstance = Object.freeze(new Collections());

export default CollectionInstance;