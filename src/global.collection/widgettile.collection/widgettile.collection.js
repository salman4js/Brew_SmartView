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
  setCollections(propertyName, data, modelName){
    // First check if the collections are already created, If not create it.
    var isCollectionCreated = this.isCollectionsCreated(propertyName);
    var isCollectionFetched = this.isCollectionFetched(propertyName);
    if(isCollectionCreated){
      !isCollectionFetched ? this.addCollections(propertyName, data) : this.addToCollections(propertyName, data, modelName);
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
  addToCollections(propertyName, data, modelName){
    var collectionData = widgetTileModelSchema.collections[propertyName].data;
    var {isDataAdded, isArray} = this.checkForDuplicateCollectionData(collectionData, modelName, data);
    if(isArray){
      collectionData.push(data);
      return;
    }
    if(modelName) collectionData[modelName] = data;
  };

  // Check if the data has been already added to collection data!
  checkForDuplicateCollectionData(collectionData, modelName, data){
    // Check for duplicate data
    var isDataAdded;
    var isArray;
    if(Array.isArray(collectionData)){
      isArray = true;
      isDataAdded = _.find(collectionData, function(obj){
        return obj === data;
      });
    } else {
      isArray = false;
      isDataAdded = collectionData[modelName] !== undefined ? true : false;
    }
    return {isDataAdded, isArray};
  };
  
  // Analyse and set is Fetched!
  analyseAndSetIsFetched(propertyName){
    var propertyCollections = this.getCollections(propertyName);
    if(propertyCollections.data){
      widgetTileModelSchema.collections[propertyName].isFetched = true;
    } else {
      widgetTileModelSchema.collections[propertyName].isFetched = false;
    }
  };
  
  // Remove particular models and colletion from the widget tile model schema!
  removeCollections(collectionName, data, modelName){
    if(modelName){
      var models = widgetTileModelSchema.collections[collectionName].data,
        model = models[modelName]
      if(!model){
        throw new Error('Collcetion does not exists');
        return;
      }
      _.remove(model, function(ele){
        return ele === data;
      });
    } else {
      delete widgetTileModelSchema.collections[collectionName];
    }
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