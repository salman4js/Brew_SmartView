import React from 'react';
import DateField from './datefield/datefield.view';
import TextField from './textfield/textfield.view';

const MetadataFields = (props) => {
  
  // Get input value!
  function getInputValue(event, attribute){
    if(attribute === 'textField'){
      return event.target.value;
    } else {
      return event;
    }
  }

  // Handle input change!
  const handleInputChange = (index, event, attribute) => {
    const fieldState = [...props.data]; // Create a copy of the state array
    fieldState[index].value = getInputValue(event, attribute) // Update the value at the specified index
    props.updateData(fieldState); // Update the state with the updated array
  };
  
  // Disable and enable custom modals footer buttons!
  function toggleButtonValue(){
    try{
      props.toggleButtonProp(0, false)
    } catch(err){
      
    }
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

        return null;
      })}
    </>
  );
}

export default MetadataFields;
