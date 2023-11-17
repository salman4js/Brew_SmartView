// filter table wrapper override table templates!
import MetadataFieldsView from "../../../fields/metadata.fields.view";

// Filter table action cell view!
export function filterTableActionCellView(events, index){
  var transfer = 'Transfer';
  return(
    <div className = 'metadata-button-field filter-tablecell-field brew-cursor' onClick = {() => events.transferEvent(index)}>
      {transfer}
    </div>
  )
}

// Edit properties custom modal body item view!
export function editPropertiesBodyView(data, updateData){
  return <MetadataFieldsView data = {data} updateData = {updateData}/>
}