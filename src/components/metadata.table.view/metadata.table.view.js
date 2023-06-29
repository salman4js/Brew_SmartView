import React from 'react';
import { commonLabel, activityLoader } from '../common.functions/common.functions.view';
import MetadataTableHeader from './metadata.table.header/metadata.table.header';
import MetadataTableCellView from './metadata.tablecell.view/metadata.tablecell.view';
import {convertIntoArrays, isEmpty} from '../common.functions/node.convertor'

const MetadataTable = (props) => {

  // Show table loader!
  function _showLoader(){
    // Options!
    var opts = {
      color: "black",
      marginTop: (props.height) / 2.5 + "px",
      textCenter: true
    }
    return activityLoader(opts);
  }
  
  // Render table View!
  function _renderTableView(){
    // Check if the object is empty or not!
    if(isEmpty(props.data.cellValues)){
      return _emptyTable();
    } else {
      // Get the options header and put it in the object!
      return(
        <table className = "text-center cheat-code">
          {_renderTableHeader()}
        </table>
      )
    }
  }
  
  // Render table header!
  function _renderTableHeader(){
    return(
      <div>
        <MetadataTableHeader data = {props.data.headerValue} />
        {_renderTableCellView()}
      </div>
    )
  }
  
  // Remove mongodb default values from the return values!
  function _deleteDefaultValues(value, idInstance){
    var result = [...value];
    result.map((options, key) => {
      delete options._id;
      delete options[idInstance];
      delete options.__v;
    })
    return result;
  }
  
  // Render table cell view!
  function _renderTableCellView(){
    // Remove the default mongodb instances!
    const value = _deleteDefaultValues(props.data.cellValues, props.idInstance);
    // Convert the object values into an array values!
    var tableCellValue = convertIntoArrays(value);
    return(
      <MetadataTableCellView data = {tableCellValue} />
    )
  }
  
  // Empty table view!~
  function _emptyTable(){
    // Options!
    var opts = {
      message: props.data.infoMessage,
      color: "black",
      marginTop: (props.height) / 2.2 + "px",
      textCenter: true
    }
    return commonLabel(opts);
  }
  
  return(
    <div>
      {props.data.tableLoader && (
        _showLoader()
      )}
      
      {!props.data.tableLoader && (
        _renderTableView()
      )}
    </div>
  )
}

export default MetadataTable;