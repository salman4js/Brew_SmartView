import React from 'react';
import _ from 'lodash';
import TableViewTemplateHelpers from './table.view.template';
import { filterKeysInObj, arrangeObj } from '../../../common.functions/node.convertor';
import  tableViewConstants  from './table.view.constants';
import MetadataTable from '../../../metadata.table.view/metadata.table.view';
import MetadataFields from '../../../fields/metadata.fields.view';

class TableView extends React.Component {
  
  constructor(props){
    super(props);
    this.widgetTileModel = {
      data: props.data,
      userCollection: props.userCollection,
      height: props.height,
      propertyDetails: props.propertyDetails
    };
    this.templateHelpersData = {};
    this.panelFieldState = [
      {
        value: 'selectedValues',
        attribute: "dataListField",
        customPanelField: true,
        renderCustomPanelField: this.renderLeftSideController.bind(this),
        height: 27,
        width: '200px',
        selectedValue: 'selectedValues',
        style: {
          width: "200",
          color: "black",
          fontSize: "15px",
          paddingRight: "10px",
          paddingLeft: "10px",
          paddingTop: "10px",
          paddingBottom: "10px",
          cursor: "pointer",
        }
      }
    ];
    this.metadataTableState = {
      cellValues: undefined,
      headerValue: undefined,
      infoMessage: tableViewConstants.tableInfoMessage.ZERO_STATE_MESSAGE,
      tableLoader: false,
      selectedRoomId: undefined,
      isCheckboxSelected: false,
      enableCheckbox: false,
      tableCellWidth : "590px",
      showPanelField: false,
    };
    this.propertyStatusTableHeader = tableViewConstants.PropertyStatusTableHeader;
    this.propertyStatusRequiredKey = tableViewConstants.PropertyStatusRequiredKey;
  };
  
  templateHelpers(){
    this.setupEvents();
    this.prepareTemplateHelpersData();
    this.prepareTableData(); // When the table data is ready, Call the metadata table view!
    return <MetadataTable data = {this.metadataTableState} height = {this.widgetTileModel.height} />
  };
  
  // Set up events for any actions!
  setupEvents(){
    this.templateHelpersData.onBack = this.onBackClick.bind(this);
  };
  
  // Handle back action triggered on left side controller!
  onBackClick(){
    this.props.onBack({reloadSidepanel: {silent: true}, navigateToPropertyContainer:true});
  };
  
  // Organize and prepare the required table data!
  prepareTableData(){
    if(this.widgetTileModel.data !== undefined){
      this.getTableHeaders(); // Get the table headers!
      var convertedCollection = this.getWidgetTileCollectionData(); // Get the widget tile collection data for the table cell values!
      this.metadataTableState.cellValues = convertedCollection;
    };
  };
  
  // Template helpers data!
  prepareTemplateHelpersData(){
    this.templateHelpersData.selectedRoomConstant = this.widgetTileModel.data.selectedRoomConstant;
  };
  
  // Get room constant collection!
  getRoomConstantCollection(){
    if(this.roomConstant !== 'afterCheckin'){
      return this.widgetTileModel.data.widgetTileModel[this.widgetTileModel.data.selectedRoomConstant]
    } else {
      return this.widgetTileModel.propertyDetails.userCollection;
    }
  };
  
  // Get the widget tile model data for the table!
  getWidgetTileCollectionData(){
    var convertedCollection = [],
      rawRoomModel = this.getRoomConstantCollection();
    if(rawRoomModel){
      rawRoomModel.map((data) => {
        // Clone the data before filtering the keys as it would change the original data which would cause some trouble in the roomCollection!
        var clonedData = _.clone(data);
        var convertedModel = filterKeysInObj(clonedData, this.propertyStatusRequiredKey[this.roomConstant]);
        var arrangedObj = arrangeObj(convertedModel, this.propertyStatusRequiredKey[this.roomConstant]);
        convertedCollection.push(arrangedObj);
      });  
    };
    return convertedCollection;
  };
  
  // Get the table headers for the selected widget tile!
  getTableHeaders(){
    this.roomConstant = _.findKey(this.widgetTileModel.data.userStatusMap, function(value) { // Using lodash function here to get the key by its value!
        return value === this.widgetTileModel.data.selectedRoomConstant;
    }.bind(this));
    this.metadataTableState.headerValue = this.propertyStatusTableHeader[this.roomConstant];
  };
  
  // Left side controller and header!
  renderLeftSideController(){
    var leftSideController = new TableViewTemplateHelpers(this.templateHelpersData);
    return leftSideController.renderLeftSideController();
  };
  
  // On render function!
  render(){
    return(
      <>
        <MetadataFields data = {this.panelFieldState} />
        {this.templateHelpers()}
      </>
    )
  };
};

export default TableView;