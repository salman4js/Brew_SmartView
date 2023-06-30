import React from 'react';
import MetadataFields from '../../fields/metadata.fields.view';

const MetadataTableHeader = (props) => {

  // Render checkbox view!
  function _checkBoxView(){
    return <MetadataFields data = {props.checkbox} />
  }
  
  return(
    <div>
      <tr>
      {props.checkbox.map((field, index) => {
        return (
          field.enableCellCheckbox && (
            <th className="metadata-table-checkbox" key={index}>
              {field.enableHeaderCheckbox && _checkBoxView(field)}
            </th>
          )
        );
      })}
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