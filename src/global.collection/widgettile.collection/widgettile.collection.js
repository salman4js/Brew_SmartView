// Widget tile collection singleton class!
import widgetTileModelSchema from './widgettile.schema';
import _ from 'lodash';

class Collections { // Design pattern --> Singleton class!
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
  
  // Update the existing collection data!
  updateCollections(propertyName, data){
    widgetTileModelSchema.collections[propertyName].data = data;
  };
  
  // Update the existing model data by the collection name!
  updateModel(collectionName, modelName, data){
    widgetTileModelSchema.collections[collectionName].data[modelName] = data;
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
    if(!isDataAdded && isArray){
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
      if(Array.isArray(data)) isDataAdded = _.isEqual(collectionData, data);
      if(!Array.isArray(data)) isDataAdded = _.find(collectionData, function(obj){
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
  
  // Get particular model from the collection set.
  getModel(collectionName, modelName){
    if(!modelName){
      throw new Error('Model name is not valid');
    } else {
      return widgetTileModelSchema.collections[collectionName]?.data[modelName];
    }
  };
  
  // Remove model from the collections!
  removeModel(collectionName, modelName){
    if(!modelName){
      throw new Error('Model name is not valid');
    } else {
      delete widgetTileModelSchema.collections[collectionName].data[modelName]; 
    };
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
      widgetTileModelSchema.collections[propertyName].data = undefined;
      widgetTileModelSchema.collections[propertyName].isFetched = false; 
      widgetTileModelSchema.collections[propertyName].name = undefined;
    }
  };
  
  // Get the type of collection by passing the collection.
  // -1 being the array type, 1 being the object type.
  getTypeOfCollection(collection){
    if(Array.isArray(collection.data)) return -1;
    if(typeof collection.data === 'object') return 1;
  };
  
  // Ensure collection is created and fetched, if checkForAttr is true,
  // Check for the collection type to make sure attributes can be retrieved.
  _ensureCollection(collectionName, checkForAttr){
    var collection = this.getCollections(collectionName);
    if(!collection){
      throw new Error('Collection does not exists');
    } else {
      var validCol = checkForAttr ? this.getTypeOfCollection(collection) : collection,
        result = checkForAttr ? {validCol, collection} : collection;
      return result;
    }
  };
  
  // Get arribute from the models!
  getAttribute(collectionName, attributeName){
    var coll = this._ensureCollection(collectionName, true);
    if(!coll.validCol){
      throw new Error('Cannot retrieve attributes from this collection');
    } else {
      var attrArr = []; // When the collection's data is in array format,
      // then attrArr will return all the attribute value of the requested attribute.
      if(coll.validCol === 1) return coll.collection.data[attributeName];
      if(coll.validCol === -1) {
        _.forEach(coll.collection.data, function(value, key){
          attrArr.push(value[attributeName]);
        });
      };
      return attrArr
    };
  };

  whereInCollections(collectionName, modelName, searchKey, searchValue) {
    var collection = modelName !== undefined ? this.getModel(collectionName, modelName) : this.getCollections(collectionName).data;
    return _.filter(collection, (val) => {
      if (Array.isArray(val[searchKey])) {
        // Use _.includes to check if searchValue is in the array
        return _.includes(val[searchKey], searchValue);
      } else {
        return val[searchKey] === searchValue;
      }
    });
  };

  // Delete the collections by the collection name.
  deleteCollections(collectionName){
    delete widgetTileModelSchema.collections[collectionName];
  };

  // Delete all collections, which reset the entire data.
  deleteAllCollections(){
    widgetTileModelSchema.instance = undefined;
    widgetTileModelSchema.collections = {};
  };
};

let CollectionInstance = Object.freeze(new Collections());

export default CollectionInstance;