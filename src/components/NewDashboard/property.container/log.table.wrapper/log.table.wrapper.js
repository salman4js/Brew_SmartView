import React from 'react';
import logTableConstants from './log.table.wrapper.constants';
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
          tableLoader: false,
          selectedRoomId: undefined,
          isCheckboxSelected: false,
          enableCheckbox: false,
          tableCellWidth : "590px",
          showPanelField: false,
        }
    };
  };
  
  setExpandedTableView(){
    return [];
  };
}; 

export default LogTable;