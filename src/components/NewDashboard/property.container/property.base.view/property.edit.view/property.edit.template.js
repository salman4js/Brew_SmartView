import MetadataFields from "../../../../fields/metadata.fields.view";
import PropertyAlertContainer from "../../property.alert.container/property.alert.container.view";
export function templateHelpers(fieldData, updateFieldData, templateHelpers){
  return(
      <div>
          {!templateHelpers.isEditable() && (
              <PropertyAlertContainer data = {templateHelpers.getPropertyErrMsg()}/>
          )}
          <div className='dashboard-container-fields-view' style={{height: templateHelpers.height}}>
              <div className="dashboard-container-fields-header">
                  {templateHelpers.VIEW_HEADER}
              </div>
              <MetadataFields data={fieldData}
              updateData={(updatedData) => updateFieldData({key: 'data', value: updatedData})}/>
          </div>
      </div>
  )
};