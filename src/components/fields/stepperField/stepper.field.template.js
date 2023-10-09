export function templateHelpers(data){
  return(
    <div style = {data.options.customStyle}>
      <span>
        {data.options.label}
      </span>
      <span className = 'stepper-buttons'>
        <button className = 'metadata-button-field metadata-stepper-buttons' onClick = {() => data.incrementValue()}>
          + 
        </button>
        <span className = 'text-center'>
          {data.state.count}
        </span>
        <button className = 'metadata-button-field metadata-stepper-buttons' onClick = {() => data.decrementValue()}>
          -
        </button>
      </span>
    </div>
  )
};