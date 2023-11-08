import React from 'react';
import _ from 'lodash';
import { convertObjectValue } from '../../../common.functions/node.convertor';
import logTableConstants from './log.table.wrapper.constants';
import LogTableUtils from './log.table.utils';
import TableView from '../table.view/table.view';

class LogTable extends TableView {
  constructor(props){
    super(props);
    this.state = {
      data: props.data,
        metadataTableState: {
          cellValues: undefined,
          headerValue: undefined,
          infoMessage: logTableConstants.tableInfoMessage.ZERO_FILTER_MESSAGE,
          tableLoader: true,
          selectedRoomId: undefined,
          isCheckboxSelected: false,
          enableCheckbox: false,
          tableCellWidth : "590px",
          showPanelField: false,
        }
    };
    this.shouldFetch = true;
    this.params = this.props.params;
    this.logTableUtils = new LogTableUtils({accId: this.params.accIdAndName[0], userId: this.state.data.userModel.userid});
  };
  
  // This is to handle extended functions from the table.view.
  async setExpandedTableView(){
    this.roomConstant = logTableConstants.tableInfoMessage.PROPERTY_STATUS_KEY; // this will be used when we getting the required table data.
    // from the table.view.constants.
    this._prepareTableHeaderState();
    await this._prepareTableCellState();
    return this.logTableData;
  };
  
  // Prepare the metadata table header state!
  _prepareTableHeaderState(){
    var tableHeaders = this.propertyStatusTableHeader[logTableConstants.tableInfoMessage.PROPERTY_STATUS_KEY];
    this.state.metadataTableState.headerValue = tableHeaders;
  };
  
  // Prepare the metadata table cell state!
  async _prepareTableCellState(){
    this.shouldFetch && await this.fetchLogTableData();
  };
  
  // Review server state data - this method will change the server data to the UI standard data. (For Example, Boolean values)
  _reviewServerData(serverData){
    var objRules = {
      true: 'Yes',
      false: 'No'
    };
    var convertedData = convertObjectValue(serverData, ['isPaid'], objRules);
    this.logTableData = convertedData;
  };
  
  // Log table data has to be fetched from the server everytime the logTable loads!
  async fetchLogTableData(){
    var logTableData = await this.logTableUtils.fetchLogTableData();
    if(logTableData.data.status){
      this._reviewServerData(logTableData.data.data);
      this._toggleTableLoader(false);
      this.shouldFetch = false;
    };
  };

}; 

export default LogTable;