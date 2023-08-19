import React from 'react';
import DateField from './datefield/datefield.view';
import TextField from './textfield/textfield.view';
import ListField from './listfield/listfield.view';
import DataList from './dataListField/datalist.field.view';
import CheckBox from './checkBoxField/checkbox.field.view';


const MetadataFields = (props) => {

  // Get input value!
  function getInputValue(event, attribute){
    if(attribute === 'dateField' || attribute === "dataListField" || attribute === "checkBoxField"){
      return event;
    } else {
      return event.target.value;
    }
  };
  
  // Update the dependent value field!
  function updateDependantValueField(dependentValueField) {
    const fieldState = [...props.data];
    // Loop through the array and find the dependent field name!
    fieldState.forEach((options, index) => {
      if (options.name === dependentValueField) {
        fieldState[index].value = undefined;
        fieldState[index].isChanged = false;
        if (options.updateIsRequiredOnDependentValue) {
          fieldState[index].isRequired = false;
        }
      }
    });
    props.updateData(fieldState);
  }

  // Handle input change!
  const handleInputChange = (index, event, attribute) => {
    const fieldState = [...props.data]; // Create a copy of the state array
    fieldState[index].value = getInputValue(event, attribute) // Update the value at the specified index
    fieldState[index].isChanged = true; // Change the metafield value to true when the value changed!
    props.toggleButtonProp &&  props.toggleButtonProp("success", false); // Make buttons enable when the field value is changed!
    props.updateData(fieldState); // Update the state with the updated array
    fieldState[index].dependentValue && updateDependantValueField(fieldState[index].dependentValue);
  };
  
  // Disable and enable custom modals footer buttons!
  function toggleButtonValue(){
    props.toggleButtonProp && props.toggleButtonProp("success", true)
  }

  return (
    <>
      {props.data.map((field, index) => {
        if (field.attribute === 'dateField') {
          return (
            <DateField data = {field} index = {index} handleInputChange = {(index, event, attribute) => handleInputChange(index, event, attribute)} />
          );
        }

        if (field.attribute === 'textField') {
          return (
            <TextField data = {field} index = {index} handleInputChange = {(index, event, attribute) => handleInputChange(index, event, attribute)}
              toggleButtonValue = {() => toggleButtonValue()}
             />
          );
        }
        
        if(field.attribute === 'listField') {
          return(
            <ListField data = {field} index = {index} handleInputChange = {(index, event, attribute) => handleInputChange(index, event, attribute)} />
          )
        }
        
        if(field.attribute === 'dataListField') {
          return(
            <DataList data = {field} index = {index} handleInputChange = {(index, event, attribute) => handleInputChange(index, event, attribute)} />
          )
        }
        
        if(field.attribute === "checkBoxField"){
          return(
            <CheckBox data = {field} index = {index} checkboxIndex = {props.checkboxIndex} 
            handleInputChange = {(index, event, attribute) => handleInputChange(index, event, attribute)}  />
          )
        }

        return null;
      })}
    </>
  );
}

export default MetadataFields;
