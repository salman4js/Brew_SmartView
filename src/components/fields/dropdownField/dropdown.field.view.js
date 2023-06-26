import React from 'react';
import { getStyle } from '../../common.functions/common.functions'


const DropdownField = (props) => {  
  // Render list for the data list field!
  function _renderList(){
    if(props.data.showListValue()){
      return(
        props.data.options.map((opts, key) => {
          return(
            <div className = "metadata-dropdown-list" style = {getStyle(props.data.style)} onClick = {() => props.setSelected(opts.value)}>
              {opts.value}
            </div>
          )
        })
      )
    } else {
      return(
        <div className = "metadata-dropdown-list" style = {getStyle(props.data.style)}>
          {props.data.noneValue}
        </div>
      )
    }
  }
    
  return(
    <div className = "metadata-dropdown-wrapper">
      {_renderList()}
    </div>
  )
}

export default DropdownField;