// Convert the data into server understandable format!
export function nodeConvertor(status){
  const result = {};
  status.map((options, index) => {
    result[options.name] = options.value;
  })
  return result;
}


// Validate the field data...
export function validateFieldData(status){
  var result;
  if(Array.isArray(status)){
    status.map((options, index) => {
      result = options?.isRequired ? checkFieldValue(options.value, options.name) : {isValid: true}
    })
  } else {
    result = status?.isRequired ? checkFieldValue(status.value, status.name) : {isValid: true}
  }
  
  return result;
}


// Check for valid field data...
export function checkFieldValue(value, statusName){
  if(value !== undefined && value !== ""){
    return {isValid: true}
  } else {
    return {isValid: false, statusName: statusName}
  }
}


// Clear out the field data value...
export function _clearData(status){
  const oldFieldData = [...status];
  
  oldFieldData.map((options, key) => {
    options.value = undefined;
  })
  
  return oldFieldData;
}