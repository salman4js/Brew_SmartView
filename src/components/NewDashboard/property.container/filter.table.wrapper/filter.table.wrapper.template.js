// filter table wrapper overriden table templates!

// Filter table action cell view!
export function filterTableActionCellView(events, index){
  var transfer = 'Transfer';
  return(
    <div className = 'metadata-button-field filter-tablecell-field brew-cursor' onClick = {() => events.transferEvent(index)}>
      {transfer}
    </div>
  )
};