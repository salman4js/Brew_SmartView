const storage = require("../../Controller/Storage/Storage")

// Convert the data into server understandable format!
export function nodeConvertor(status){
  const result = {};
  status.map((options, index) => {
    result[options.name] = options.value;
  })
  return result;
}

// Get state data --> Use this when states are not updating in reusable components!
export function getStateData(state){
  return state;
}

// Validate field data for expected input!
function _validateData(status, setStatus){
  return new Promise((resolve, reject) => {
    var result;
    var tempResult = [];
    if(Array.isArray(status)){
      status.map((options, index) => {
        tempResult.push(options?.isRequired ? checkFieldValue(options.value, options.name) : {isValid: true})
      })
      result = tempResult;
    } else {
      result = status?.isRequired ? checkFieldValue(status.value, status.name) : {isValid: true}
    }
    resolve(result, status, setStatus)
  })
}


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
}

// Check for valid field data...
export function checkFieldValue(value, statusName){
  if(value !== undefined && value !== ""){
    return {isValid: true, statusName: statusName}
  } else {
    return {isValid: false, statusName: statusName}
  }
}

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
}


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
}

// Convert objects into arrays!
export function convertIntoArrays(value){
  const arrValue = [];
  value.map((options, key) => {
    const value = Object.values(options)
    arrValue.push(value);
  })
  
  return arrValue;
}

// Check if the object is empty of not!
export function isEmpty(value){
  if(value !== undefined && Array.isArray(value) === true && value.length !== 0){
    return false;
  } else {
    return true;
  }
}

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
}

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
}

// Refresh the entire page when needed!
export function domRefresh(){
  window.location.reload();
}