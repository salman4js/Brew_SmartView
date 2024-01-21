export function templateHelpers(fieldOptions, templateHelpers){
  return(
      <div className = "dashboard-container-fields-view" style = {{height: templateHelpers.height}}>
          <div className = "dashboard-container-fields-header">
              {templateHelpers.VIEW_HEADER}
          </div>
          {fieldOptions && fieldOptions.map((options) => {
              return (
                  <div className='modal-gap'>
                      <label style={{color: 'black'}}> {options.templateLabel} </label>
                      <p style={{color: 'black'}}> {options.templateValue} </p>
                  </div>
              )
          })}
      </div>
  )
};