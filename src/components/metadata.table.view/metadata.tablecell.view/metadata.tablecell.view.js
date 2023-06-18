import React from 'react';

const MetadataTableCellView = (props) => {
  
  // Render table cell view!
  function _renderTableCellView(){
    return(
      props.data.map((options, key) => {
        return(
          <tr>
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