import React, {useState, useEffect} from 'react';
import CardView from '../../CardView/card.view/card.view';
import MetadataTable from '../../metadata.table.view/metadata.table.view';


const ManageRecepDetails = (props) => {
    
  // Card view state handler!
  const [cardView, setCardView] = useState({
    header: "Account Details",
    height: "580px",
    _showBodyChildView : _showCardBodyView,
    footerEnabled: false,
    reload: false
  })

  // Show card body view!
  function _showCardBodyView(){
    return(
      <div className = "manage-recep-table-center">
        <MetadataTable data = {props.tableView} height = {500} idInstance = {"lodge"} checkbox = {props.checkboxView} />
      </div>
    )
  }


  return(
    <div>
      <CardView data = {cardView} tableData = {props.tableView} />
    </div>
  )
}


export default ManageRecepDetails;