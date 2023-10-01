const storage = require("../../Controller/Storage/Storage");

// Get the base url!
export function getBaseUrl(){
  var url = window.location.href;
  const parsedUrl = new URL(url);
  const baseUrl = `${parsedUrl.protocol}//${parsedUrl.host}`;
  return baseUrl;
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

// Convert the data into server understandable format!
export function nodeConvertor(status){
  const result = {};
  status.map((options, index) => {
    if(options.defaultValue && (options.value === undefined)){
      result[options.name] = options.defaultValue;
    } else {
      result[options.name] = options.value;
    }
  })
  return result;
};

// Get state data --> Use this when states are not updating in reusable components!
export function getStateData(state){
  return state;
};

// Validate field data for expected input!
function _validateData(status, setStatus){
  return new Promise((resolve, reject) => {
    var result;
    var tempResult = [];
    if(Array.isArray(status)){
      status.map((options, index) => {
        tempResult.push((options?.isRequired || options?.validation) ? checkFieldValue(options.value, options.defaultValue, options.name, options.validationRegex) : {isValid: true})
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
export function checkFieldValue(value, defaultValue, statusName, validationRegex){
  var validationRequired = (validationRegex !== undefined);
  if(value !== undefined && value !== ""){
    return validationRequired ? validateMetadataFields(value, statusName, validationRegex) : {isValid: true, statusName: statusName};
  } else {
    return validationRequired ? validateMetadataFields(defaultValue, statusName, validationRegex) : {isValid: false, statusName: statusName};
  }
};

// Validation for metadata fields!
function validateMetadataFields(value, statusName, validationRegex){
  return validationRegex.test(value) ? {isValid: true, statusName: statusName} : {isValid: false, statusName: statusName};
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

// Refresh the entire page when needed!
export function domRefresh(){
  window.location.reload();
};