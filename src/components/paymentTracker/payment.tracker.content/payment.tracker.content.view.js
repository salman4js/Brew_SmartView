import React from 'react';
import PanelView from '../../SidePanelView/panel.view';
import MetadataTable from '../../metadata.table.view/metadata.table.view';
import CommandHelper from '../../fields/commandField/command.helper.field';
import MetadataFields from '../../fields/metadata.fields.view';

const PaymentTrackerContent = (props) => {
  
  // Render metadata table view!
  function _renderTableView(){
    return(
      <MetadataTable data = {props.tableData} height = {props.data.height} idInstance = {props.idInstance}  />
    )
  }
  
  // Render command helper for actions!
  function commandHelper(){
    return <CommandHelper data = {props.commandHelper.commands} />
  }
  
  // Render panel field based on action!
  function _showPanelField(){
    return <MetadataFields data = {props.panelHelper} updateData = {(state) => props.updatePanelHelper(state)} />
  }
  
  
  return(
    <div className = "sidepanel-wrapper">
      <div className = "flex-1">
        <PanelView data = {props.data} childView = {() => props.childView()} height = {(value) => props.updateSidepanelHeight(value)} />
      </div>
      <div className = "flex-2">
        {props.tableData?.showPanelField && (
          _showPanelField()
        )}
        {props.commandHelper?.commandHelper && (
          <div className = "fixed-command-helper">
            {commandHelper()}
          </div>
        )}
        <div className = "metadata-table-view-payment-tracker">
          {_renderTableView()}
        </div>
      </div>
    </div>
  )
}

export default PaymentTrackerContent;