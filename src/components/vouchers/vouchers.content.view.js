import React, {useState} from 'react';
import PanelView from '../SidePanelView/panel.view';
import MetadataTable from '../metadata.table.view/metadata.table.view';
import MetadataFields from '../fields/metadata.fields.view';

const VoucherContent = (props) => {
  
  // Cheat code state handler!
  const [cheatCode, setCheatCode] = useState([
    {
      value: undefined,
      placeholder: "Advanced filter cheat code",
      name: 'cheatCode',
      attribute: 'dataListField',
      options: [{
          value: "Add Date from `date1` to `date2`"
        },
        {
          value: "Filter Name 'Enter name to be filtered'"
        },
        {
          value: "Hey there!"
        }
      ],
      style: {
        color: "black",
        fontSize: "15px",
        paddingRight: "10px",
        paddingLeft: "10px",
        cursor: "pointer",
      }
    }
  ])
  
  // Render cheat code input field!
  function _renderCheatCode(){
    return(
      <div>
        <MetadataFields data = {cheatCode} updateData = {setCheatCode} />
      </div>
    )
  }
  
  // Render table view!
  function _renderTableView(){
    return(
      <MetadataTable data = {props.tableData} height = {props.data.height} />
    )
  }
  
  return(
    <div className = "sidepanel-wrapper">
      <div className = "flex-1">
        <PanelView data = {props.data} childView = {() => props.childView()} />
      </div>
      <div className = "flex-2">
        <div className = "cheat-code">
          {_renderCheatCode()}
        </div>
        <div className = "metadata-table-view">
          {_renderTableView()}
        </div>
      </div>
    </div>
  )
}

export default VoucherContent;