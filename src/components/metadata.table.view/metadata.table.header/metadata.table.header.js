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
      <thead>
        <tr>
        {props.enableCheckbox && (
          props.checkbox.map((field, index) => {
            return (
              field.enableCellCheckbox && (
                <th className = "metadata-content-table-header-checkbox" key={index}>
                  {field.enableHeaderCheckbox && _checkBoxView(field)}
                </th>
              )
            );
          })
        )}
          {props.data.map((options, key) => {
            return(
              <th className = "text-center" style = {{width: props.width}}>
                {options}
              </th>
            )
          })}
        </tr>
      </thead>
    </div>
  )
}

export default MetadataTableHeader;