import React from 'react';

const CommnadHelper = (props) => {

  // Show command for performing actions based on the parent component view!
  function _showCommands(){
    return(
      <div>
        {props.data?.map((options, index) => {
          if(!options.disabled){
            return(
              <span className = {props.options?.isFacets ? 'metadata-command-fields metadata-command-facets brew-cursor' : "metadata-command-fields brew-cursor"}
                    onClick = {() => options.onClick(options)}>
                {options.icon ? options.icon() : options.value}
              </span>
            )
          }
        })}
      </div>
    )
  }
  
  return(
    <div className = {props.options?.isFacets ? 'metadata-command-facets-container' : "metadata-command-helper"}>
      {_showCommands()}
    </div>
  )
}

export default CommnadHelper;