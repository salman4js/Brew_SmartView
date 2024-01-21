import MetadataFields from "../../../../fields/metadata.fields.view";
export function templateHelpers(fieldData, updateFieldData, templateHelpers){
  return(
      <div className='dashboard-container-fields-view' style = {{height: templateHelpers.height}}>
        <div className="dashboard-container-fields-header">
          {templateHelpers.VIEW_HEADER}
        </div>
        <MetadataFields data = {fieldData} updateData = {(updatedData) => updateFieldData({key: 'data', value: updatedData})} />
      </div>
  )
};