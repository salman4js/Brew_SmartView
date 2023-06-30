import React from 'react';
import MetadataFields from '../../fields/metadata.fields.view';

const MetadataTableCellView = (props) => {
    
  // Render checkbox view!
  function _renderCheckBoxView(){    
    return <MetadataFields data = {props.checkbox} />
  }
  
  // Render table cell view!
  function _renderTableCellView(){
    return(
      props.data.map((options, key) => {
        return(
          <tr>
          {props.checkbox.map((field, index) => {
            return(
              field.enableCellCheckbox && (
                  <th className = "metadata-table-checkbox">
                    {_renderCheckBoxView()}
                  </th>
              )
            )
          })}
            {options.map((opts, index) => {
              return(
                <td className = "metadata-tablecell-view">
                  {opts}
                </td>
              )
            })}
          </tr>
        )
      })
    )
  }
  
  return(
    _renderTableCellView()
  )
}

export default MetadataTableCellView;