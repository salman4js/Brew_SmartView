import React from 'react';

const MetadataTableHeader = (props) => {
  return(
    <div>
      <tr>
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