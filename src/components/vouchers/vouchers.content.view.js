import React, {useState} from 'react';
import { getFilteredModel } from './vouchers.utils.js';
import PanelView from '../SidePanelView/panel.view';
import MetadataTable from '../metadata.table.view/metadata.table.view';
import MetadataFields from '../fields/metadata.fields.view';
import CommandHelper from '../fields/commandField/command.helper.field'
import { nodeConvertor, validateFieldData, _clearData, _enableInlineToast, isEmpty } from '../common.functions/node.convertor';
import { activityLoader } from '../common.functions/common.functions.view';
import { setStorage, getStorage } from '../../Controller/Storage/Storage'

const VoucherContent = (props) => {
  // Selected voucher id state handler!
  const [selectedVoucherId, setSelectedVoucherId] = useState();
  
  // Loader state handler for table!
  const [isLoading, setIsLoading] = useState(false);
  
  // Show command helper!
  function _showCommandHelper(){
    return <CommandHelper data = {props.commandHelper.commands} />
  }

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
    _toggleLoader(true);
    const fieldData = getFieldData();
    // Get the selected voucher id!
    var selectedVoucherId = getStorage("selectedVoucherId");
    // Form up the params!
    fieldData['voucherId'] = selectedVoucherId;
    const result = await getFilteredModel(props.lodgeId, fieldData);
    if(result.data.success){
      _toggleLoader(false);
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
    
    if(!isLoading){
      return(
        <MetadataTable data = {props.tableData} height = {props.data.height} idInstance = {"voucherId"} />
      )
    } else {
      var opts = {
        color: "black",
        marginTop: (props.data.height) / 2.5 + "px",
        textCenter: true
      }
      
      return activityLoader(opts);
    }
  }
  
  // toggle loader between on and off!
  function _toggleLoader(action){
    setIsLoading(action);
  }
  
  return(
    <div className = "sidepanel-wrapper">
      <div className = "flex-1">
        <PanelView data = {props.data} childView = {() => props.childView()} height = {(value) => props.updateSidepanelHeight(value)} />
      </div>
      <div className = "flex-2">
        {props.commandHelper.commandHelper && (
          _showCommandHelper()
        )}
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