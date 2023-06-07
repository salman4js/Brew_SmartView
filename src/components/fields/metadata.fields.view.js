import React from 'react';
import DateField from './datefield/datefield.view';
import TextField from './textfield/textfield.view';

const MetadataFields = (props) => {

  // Handle input change!
  const handleInputChange = (index, event) => {
    const updatedPrebookEdit = [...props.data]; // Create a copy of the state array
    updatedPrebookEdit[index].value = event.target.value; // Update the value at the specified index
    props.updateData(updatedPrebookEdit); // Update the state with the updated array
  };

  return (
    <>
      {props.data.map((field, index) => {
        if (field.attribute === 'dateField') {
          return (
            <DateField data = {field} />
          );
        }

        if (field.attribute === 'textField') {
          return (
            <TextField data = {field} index = {index} handleInputChange = {(index, event) => handleInputChange(index, event)} />
          );
        }

        return null;
      })}
    </>
  );
}

export default MetadataFields;
