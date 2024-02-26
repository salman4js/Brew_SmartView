import {getStorage} from "../../Controller/Storage/Storage";

const saveAs = require('file-saver');
const axios = require('axios');
const storage = require("../../Controller/Storage/Storage");
const _ = require('lodash');

// Get parsed url!
export function getParsedUrl(){
  var url = window.location.href;
  const parsedUrl = new URL(url);
  return parsedUrl;
};

// Ge the base url!
export function getBaseUrl(){
  var parsedUrl = getParsedUrl();
  return `${parsedUrl.protocol}//${parsedUrl.host}`;
};

// Get the current route!
export function getCurrentRoute(){
  var parsedUrl = getParsedUrl(),
    pathName = parsedUrl.pathname,
    route = pathName.split('/');
  return route[route.length - 1];
};

// Form query params and return!
export function formQueryParams(obj){
  return new URLSearchParams(obj).toString();
};

// Extract object from the query params!
export function extractQueryParams(){
  const urlParams = new URLSearchParams(window.location.search);
  const extractedParams = {};
  for (const [key, value] of urlParams) {
    extractedParams[key] = value;
  }
  return extractedParams;
};

// This method returns query params with URLSearchParams instance!
export function getQueryParams(){
  return new URLSearchParams(window.location.search);
}

// Function to update query parameters
export function updateQueryParams(params) {
  const queryParams = getQueryParams();
  params.forEach((value, key) => {
    queryParams.set(key, value);
  });
  return queryParams.toString();
};

// Convert query params into objects
// Sometimes, when we have to send objects in the URL, we convert it into string and have a separator for objects
// This method is helpful when we want to convert the query params back into the objects.
export function convertQueryParamsIntoObjects(values, separator){
  // Default separator would be '--';
  var resultArr = [],
      sep = separator !== undefined ? separator : '--',
      arr = _.split(values, sep);
  arr.map((val) => {
    if(val.length !== 0 && val !== '[object Object]'){
      resultArr.push(JSON.parse(val));
    }
  });
  return resultArr;
};

// Get current logged-in user.
export function getCurrentUser(){
  // When multiple receptionist login is not enabled, 'loggedInUser' in the session storage would be 'null'.
  return getStorage('loggedInUser') || 'Manager';
};

// Extract data from the state handlers. This is usefull when states are holding their view's sub view function.
// In that case, sub view state will always hold the initial data.
export function extractStateValue(state, value){
  var result = {};
  state.map((options, index) => {
    result[options.name] = options[value];
  });
  return result;
};

// If the metadata fields needs to be changed into any specific format before sending it to server,
// This method will be useful to do the conversion based on the conversionMethod specified in the fields.
function checkIfConversionNeeded(options){
  if(options.conversionInNodeConvertor){
    options.value = options.conversionMethod(options.value);
    options.defaultValue = options.conversionMethod(options.defaultValue);
  }
};

// Convert the data into server understandable format!
export function nodeConvertor(status, fieldProp){ // fieldProp will take array as an input,
  // whatever values are there in the fieldProp will be returned in the result object.
  var valuesArr = fieldProp !== undefined ? fieldProp : [];
  const result = {};
  status.map((options, index) => {
    checkIfConversionNeeded(options);
    if(options.defaultValue && (options.value === undefined)){
      result[options.name] = options.defaultValue;
    } else {
      result[options.name] = options.value !== undefined ? options.value : options.defaultValue;
    }
    // Send any required field value other the 'name' if asked!
    for(var value of valuesArr){
      result[value] = options[value];
    };
  })
  return result;
};

// Validate field data for expected input!
function _validateData(status, setStatus){
  return new Promise((resolve, reject) => {
    var result;
    var tempResult = [];
    if(Array.isArray(status)){
      status.map((options, index) => {
        tempResult.push((options?.isRequired || options?.validation) ?
            checkFieldValue(options.value, options.defaultValue, options.name, options.validationRegex, options.condition) : {isValid: true})
      })
      result = tempResult;
    } else {
      result = (status?.isRequired || status?.validation) ? checkFieldValue(status.value, status.defaultValue, status.name, status.validationRegex) : {isValid: true}
    }
    resolve(result, status, setStatus);
  })
};

// Validate the field data...
export function validateFieldData(status, setStatus) {
  return new Promise((resolve, reject) => {
    _validateData(status, setStatus)
      .then((result) => {
        const promises = result.map((value, key) => {
          return _enableInlineToast(value.statusName, value.isValid, status, setStatus)
            .then(() => {
              if (!value.isValid) {
                return value.statusName; // Accumulate the error in an array
              }
            });
        });

        return Promise.all(promises);
      })
      .then((errors) => {
        const validationErrors = errors.filter(Boolean);
        if (validationErrors.length > 0) {
          resolve(validationErrors); // Reject with the accumulated errors
        } else {
          resolve(validationErrors); // Resolve if no errors found
        }
      })
      .catch(reject);
  });
};

// Check for valid field data...
export function checkFieldValue(value, defaultValue, statusName, validationRegex, condition){
  var validationRequired = (validationRegex !== undefined);
  if(value !== undefined && value !== ""){
    return validationRequired ? validateMetadataFields(value, statusName, validationRegex, condition) : {isValid: true, statusName: statusName};
  } else {
    return validationRequired ? validateMetadataFields(defaultValue, statusName, validationRegex) : {isValid: false, statusName: statusName};
  }
};

// Check for condition statement!
function checkForConditionStatement(value, condition){
  var validationValue = condition.validationValue,
      validationStatement = condition.validationStatement;
  // Form condition statement.
  var conditionStatement = `${validationValue}${validationStatement}${value}`;
  return eval(conditionStatement);
};

// Validation for metadata fields!
function validateMetadataFields(value, statusName, validationRegex, condition){
  if(!condition) return validationRegex.test(value) ? {isValid: true, statusName: statusName} : {isValid: false, statusName: statusName};
  if(condition) return validationRegex.test(value) && checkForConditionStatement(value, condition) ? {isValid: true, statusName: statusName} : {isValid: false, statusName: statusName};
};

// Enable inline toast message for input field!
export function _enableInlineToast(nodeValue, nodeStatus, state, setState){
  return new Promise((resolve, reject) => {
    // Create a copy of the inputField array
     const updatedInputField = [...state];

     // Find the object where isShow needs to be updated
     const targetObjectIndex = updatedInputField.findIndex(item => item.name === nodeValue);

     // If the object is found, update the isShow property
     if (targetObjectIndex !== -1) {
       updatedInputField[targetObjectIndex].inlineToast.isShow = !nodeStatus;
     }

     // Set the modified copy of the inputField array back into the state
     setState(updatedInputField);
     resolve();
  })
};

// Find and set the value for metadata fields!
function findAndSet(obj, nodeValue) {
    var nodeKey = Object.keys(nodeValue);
    for (var key in obj) {
      for(var i = 0; i <= nodeKey.length; i++){
          if(key === nodeKey[i]){
              obj[key] = nodeValue[nodeKey[i]];
          }
      }
      if (typeof obj[key] === 'object') {
        findAndSet(obj[key], nodeValue);
      }
    }
    return obj;
};

// Update multiple metadata fields in single state of array of object.
export async function updateMultipleMetadataFields(nodeStateOfValue, state, setState){
  for (const property in nodeStateOfValue){
    await updateMetadataFields(property, nodeStateOfValue[property], state, setState);
  }
}

// Update any metadata fields data!
export function updateMetadataFields(nodeValue, nodeState, state, setState){
  return new Promise((resolve, reject) => {
    // Create a copy of metadata fields array!
    const updatedMetadataField = [...state];
    
    // Find the object where the value has to be updated!
    const targetObjectIndex = updatedMetadataField.findIndex(item => item.name === nodeValue);
    
    // When the object is found, update the state of the field to the provided value!
    if(targetObjectIndex !== -1){
      // Find the state value where the data has to be updated!
      updatedMetadataField[targetObjectIndex] = findAndSet(updatedMetadataField[targetObjectIndex], nodeState);
    };

    // Set the modified copy to the metadata fields!
    setState(updatedMetadataField);
    resolve();
  })
};

// Clear out the field data value...
export function _clearData(status){
  const oldFieldData = [...status];
  
  oldFieldData.map((options, key) => {
    if(options.defaultValue !== undefined){
      options.value = options.defaultValue;
    } else {
      options.value = undefined;
    }
  })
  
  return oldFieldData;
};

// Convert objects into arrays!
export function convertIntoArrays(value){
  const arrValue = [];
  value.map((options, key) => {
    const value = Object.values(options)
    arrValue.push(value);
  })
  
  return arrValue;
};

// Check if the object is empty of not!
export function isEmpty(value){
  if(value !== undefined && Array.isArray(value) === true && value.length !== 0){
    return false;
  } else {
    return true;
  }
};

// Checkbox selection handler!
export function checkboxSelection(value, setState, storageId){
  var selectedCount = storage.getStorage(storageId);
  if(value){
    const updatedCount = Number(selectedCount) + 1
    storage.setStorage(storageId, updatedCount)
    setState && setState(prevState => ({...prevState, commandHelper: value}))
  } else {
      const updatedCount = Number(selectedCount) - 1
      storage.setStorage(storageId, updatedCount);
      if(value !== undefined && updatedCount === 0){
        setState && setState(prevState => ({...prevState, commandHelper: value}))
      } 
  }
};

// Handle enable / disable commands for command helper!
export function handleCommands(commands, setState, enable){
  commands.forEach((opts) => {
    setState(prevState => {
      const updatedCommands = prevState.commands.map((command, index) => {
        if(command.value === opts){
          return{
            ...command,
            disabled: enable
          }
        } 
        return command;
      });
      
      return {
        ...prevState,
        commands: updatedCommands
      }
    })
  })
};

// Check if any of the metadata fields has been updated or not!
export function getFieldsData(field, name){
  var result = {};
  field.forEach((options) => {
    if(options.name === name){
      var isUpdated = (options.value !== undefined) ? true : false;
      result['isFieldUpdated'] = isUpdated;
      result['updatedValue'] = options.value;
    }
  });
  return result;
};

// Filter any array of objects by comparing the every object with the search object.
export function filterArrayOfObjectsWithSearchObjects(dataArray, searchObject){
  const resultArray = _.filter(dataArray, (item) => {
    return _.every(searchObject, (value, key) => _.isEqual(item[key], value));
  });
  return resultArray;
};

// Create an array of metadata field state based on the object passed.
/**
 * This method is useful to create metadataField states
 * It will take only object with key and value of required state fields.
 **/
export function createMetadataFieldsWithBaseObj(obj, metadataAttribute, metadataFields){
  var metadataFieldArray = [];
  Object.keys(obj).forEach((key) => {
    var fieldObj = _.clone(metadataFields);
    fieldObj['name'] = key;
    fieldObj['value'] = obj[key];
    Object.keys(metadataAttribute[key]).forEach((k) => {
      fieldObj[k] = metadataAttribute[key][k];
    });
    metadataFieldArray.push(fieldObj);
  });
  return metadataFieldArray;
};

// Function to check if the field is actually textField.
export function isTextField(attribute){
  return attribute === 'textField';
};

// Function to check if the field actually dateField.
export function isDateField(attribute){
  return attribute === 'dateField';
}

// Function to check if the field is actually listField.
export function isListField(attribute){
  return attribute === 'listField';
};

// Create replacements data for custom html content with metadata field state.
export function createReplacementsDataFromMetadataFields(metadataFieldState){
  var replacementsObj = {};
  metadataFieldState.map((field) => {
    replacementsObj[field.name] = field.value;
  });
  return replacementsObj;
};

// Remove unwanted data from the objects!
export function removeKeysInObj(obj, unwantedData){
  unwantedData.map((data) => {
    delete obj[data];
  });
  return obj;
};

// Keep only the necessay data in objects and remove unwanted things!
export function filterKeysInObj(obj, filterData){
  for (const key in obj) {
    if (!filterData.includes(key)) {
        delete obj[key];
    };
  };
  return obj;
};

// Keep only the necessay data in arrays and remove unwanted things!
export function filterKeysInArr(arr, filterData){
  var resultArr = [];
  for(var i = 0; i <= arr.length - 1; i++){
    resultArr.push(filterKeysInObj(arr[i], filterData));
  };
  return resultArr;
};

// Arrange objects values in the provided order --> Takes one obj to arrange and an array of values for order reference!
export function arrangeObj(obj, orderedArr){
  var orderedObj = {};
  orderedArr.forEach(key => {
    if (obj.hasOwnProperty(key)) {
      orderedObj[key] = obj[key];
    };
  });
  return orderedObj;
};

// Change the array of object data value based on the key!
/**
This method will take an array of object and key value of array and an objRules as an parameter.
objRules is used to map the value to the user wanted data.
key represents the key value which has to be modified.
**/
export function convertObjectValue(arr, key, objRules){
  _.filter(arr, function(obj){
    for (var i = 0; i <= key.length -1; i++){
      if(obj[key[i]] !== undefined){
        if(Object.keys(objRules).includes(obj[key[i]].toString())){
          obj[key[i]] = objRules[obj[key[i]].toString()];
        };
      };
    };
  });
  return arr;
};

// This method is a helper function for renderCustomHTMLContent to replace the values with the fetched values.
function replacePlaceholders(htmlContent, replacements){
    let result = htmlContent.content;
    for (const key in replacements) {
      if (replacements.hasOwnProperty(key)) {
        const placeholder = `{${key}}`;
        const value = replacements[key];
        result = result.replace(new RegExp(placeholder, 'g'), value);
      }
    }
    return result;
};

export function renderCustomHTMLContent(htmlContent, replacements, propertyContainerHeight){
  if(htmlContent.content){
    // Replace placeholders in the HTML content
    const dynamicHTML = replacePlaceholders(htmlContent, replacements);
    return (
        <div style = {{height: propertyContainerHeight, overflow: 'auto', width: '100%'}} dangerouslySetInnerHTML={{ __html: dynamicHTML }}></div>
    );
  } else if(htmlContent.rollBackTemplateView){
    return htmlContent.rollBackTemplateView;
  } else {
    return (
        <div style = {{height: propertyContainerHeight, overflow: 'auto', color: 'black'}}> No Custom HTML Content Found. </div>
    )
  }
};

// Download the content into the filesystem.
// This method watches for the content, If the content is passed, Content will be downloaded or
// Content will be fetched from the server with the help download URL.
export function downloadContent(options){
  if(options.content){
    // In this case, the content should be converted into blob before passing into this function.
    saveAs(options.content, options.fileName);
    return true;
  } else {
    axios.get(options.downloadUrl).then((result) => {
      var blob = new Blob([result.data]);
      saveAs(blob, options.filename);
      return true;
    }).catch(() => {
      return false;
    })
  }
};

// CSV file preparer.
export function prepareCSV(options){
  // Empty array for storing the values
  const csvRows = [];
  // As for making csv format, headers must be
  // separated by comma and pushing it into array
  csvRows.push(options.header.join(','));
  // Pushing Object values into the array with
  // comma separation
  // Looping through the data values and make
  // sure to align values with respect to headers
  for (const row of options.rows) {
    const values = options.headerRefKeys.map(e => {
      if (row[e].indexOf(',') !== -1) {
        row[e] = '"' + row[e] + '"';
        return row[e];
      } else {
        return row[e];
      }
    })
    csvRows.push(values.join(','))
  }
  // returning the array joining with new line
  return csvRows.join('\n')
};

// Refresh the entire page when needed!
export function domRefresh(){
  window.location.reload();
};