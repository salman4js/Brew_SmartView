import React, {useState, useEffect} from 'react';
import CardView from '../../CardView/card.view/card.view';
import MetadataTable from '../../metadata.table.view/metadata.table.view';


const ManageRecepDetails = (props) => {
  
  // Card view state handler!
  const [cardView, setCardView] = useState({
    header: "Account Details",
    height: "580",
    _showBodyChildView : _showCardBodyView,
    footerEnabled: false,
    commandHelper : false,
    commands: [
      {
        value: "Edit",
        onClick: props.onEdit,
        disabled: false
      },
      {
        value: "Delete",
        onClick: props.onDelete,
        disabled: false
      }
    ]
  })
  
  // Update the card state when parent dependant state changes!
  function updateCardState(){
    setCardView(prevState => ({...prevState, commandHelper: props.tableView.commandHelper}));
    setCardView(prevState => {
      const updatedCommands = prevState.commands.map((command, index) => {
        if (command.value === props.tableView.commandDisabled) {
          return {
            ...command,
            disabled: true
          };
        } else {
          return {
            ...command,
            disabled: false
          };
        }
        return command;
      });

      return {
        ...prevState,
        commands: updatedCommands
      };
    });
  }

  // Show card body view!
  function _showCardBodyView(){
    return(
      <div className = "manage-recep-table-center">
        <MetadataTable data = {props.tableView} height = {500} idInstance = {"lodge"} />
      </div>
    )
  }
  
  // Trigger reload if there is a change in props.tableView!
  useEffect(() => {
    updateCardState();
  }, [props.tableView])


  return(
    <div>
      <CardView data = {cardView} />
    </div>
  )
}


export default ManageRecepDetails;