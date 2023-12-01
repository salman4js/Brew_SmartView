import React from 'react';

const CommnadHelper = (props) => {

  // Show command for performing actions based on the parent component view!
  function _showCommands(){
    return(
      <div>
        {props.data?.map((options, index) => {
          if(!options.disabled){
            return(
              <span className = "metadata-command-fields brew-cursor" onClick = {() => options.onClick(options)}>
                {options.value}
              </span>
            )
          }
        })}
      </div>
    )
  }
  
  return(
    <div className = "metadata-command-helper">
      {_showCommands()}
    </div>
  )
}

export default CommnadHelper;