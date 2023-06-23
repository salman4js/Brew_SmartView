import React, {useState} from 'react';
import { getFilteredModel } from './vouchers.utils.js';
import PanelView from '../SidePanelView/panel.view';
import MetadataTable from '../metadata.table.view/metadata.table.view';
import MetadataFields from '../fields/metadata.fields.view';
import { nodeConvertor, validateFieldData, _clearData, _enableInlineToast, isEmpty } from '../common.functions/node.convertor';
import { setStorage, getStorage } from '../../Controller/Storage/Storage'

const VoucherContent = (props) => {
  
  // Selected voucher id state handler!
  const [selectedVoucherId, setSelectedVoucherId] = useState();

  // Cheat code state handler!
  const [cheatCode, setCheatCode] = useState([
    {
      value: undefined,
      placeholder: "Advanced filter cheat code",
      name: 'query',
      attribute: 'dataListField',
      onEnter: _saveSelectedValue,
      showListValue: showListValue,
      noneValue: "None",
      options: [{
          value: "Filter CashMode 'Enter Cash Mode to be filtered'"
        },
        {
          value: "Filter Particulars 'Enter name to be filtered'"
        },
        {
          value: "Filter Date From 'date1' To 'date2'"
        },
        {
          value: "Filter All Voucher Model Data"
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
  
  // Determine to show list value!
  function showListValue(){
    return getStorage('selectedVoucherId') !== "undefined" ? true : false
  }

  // Data list field onEnter save value!
  async function _saveSelectedValue(){
    const fieldData = getFieldData();
    // Get the selected voucher id!
    var selectedVoucherId = getStorage("selectedVoucherId");
    // Form up the params!
    fieldData['voucherId'] = selectedVoucherId;
    const result = await getFilteredModel(props.lodgeId, fieldData);
    if(result.data.success){
      props.getFilteredModel(result, selectedVoucherId)
    }
  }
  
  // Get field data!
  function getFieldData(){
    return nodeConvertor(cheatCode);
  }
  
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
    
    // Store the selected voucher id!
    setStorage("selectedVoucherId", props.tableData.selectedVoucherId);
    
    return(
      <MetadataTable data = {props.tableData} height = {props.data.height} idInstance = {"voucherId"} />
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