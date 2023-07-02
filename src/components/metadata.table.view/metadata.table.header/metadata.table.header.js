import React from 'react';
import MetadataFields from '../../fields/metadata.fields.view';
import CommandHelper from '../../fields/commandField/command.helper.field'

const MetadataTableHeader = (props) => {

  // Render checkbox view!
  function _checkBoxView(){
    return <MetadataFields data = {props.checkbox} />
  }
  
  // Show commands for performing actions!
  function _showCommands(){
    return <CommandHelper data = {props.commands} />
  }
  
  return(
    <div>
      {props.enableCommandHelper && (
        _showCommands()
      )}
      <tr>
      {props.enableCheckbox && (
        props.checkbox.map((field, index) => {
          return (
            field.enableCellCheckbox && (
              <th className="metadata-table-checkbox" key={index}>
                {field.enableHeaderCheckbox && _checkBoxView(field)}
              </th>
            )
          );
        })
      )}
        {props.data.map((options, key) => {
          return(
            <th className = "metadata-table-header">
              {options}
            </th>
          )
        })}
      </tr>
    </div>
  )
}

export default MetadataTableHeader;