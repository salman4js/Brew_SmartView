import React from 'react';
import _ from 'lodash';
import TableViewTemplateHelpers from './table.view.template';
import Variables from "../../../Variables";
import {filterKeysInObj, arrangeObj, convertObjectValue, nodeConvertor} from '../../../common.functions/node.convertor';
import  tableViewConstants  from './table.view.constants';
import {validateFieldData} from "../../../common.functions/node.convertor";
import MetadataFields from '../../../fields/metadata.fields.view';

class TableView extends React.Component {
  
  constructor(props){
    super(props);
    this.widgetTileModel = {
      data: props.data,
      userCollection: props.userCollection,
      height: props.height,
      propertyDetails: props.propertyDetails,
      allowPagination: false,
      isHeightAdjustedForPagination: false,
      paginationData: {
        count: tableViewConstants.paginationConstants.PAGINATION_DEFAULT_COUNT,
        skipCount: tableViewConstants.paginationConstants.PAGINATION_DEFAULT_SKIP_COUNT,
        limitCount: tableViewConstants.paginationConstants.PAGINATION_DEFAULT_LIMIT,
        getNextNode: false,
        events: {
          onPageShift: this.onPageShift.bind(this)
        }
      }
    };
    this.templateHelpersData = {};
    this.panelFieldState = [
      {
        value: 'selectedValues',
        attribute: "dataListField",
        customPanelField: true,
        renderCustomPanelField: this.renderTableToolbarView.bind(this),
        width: '200px',
        selectedValue: 'selectedValues',
        style: {
          width: "200",
          height: 27,
          color: "black",
          fontSize: "16px",
          paddingLeft: "10px",
          cursor: "pointer",
        }
      }
    ];
    this.state = {
      metadataTableState: {
        cellValues: undefined,
        headerValue: undefined,
        infoMessage: tableViewConstants.tableInfoMessage.ZERO_STATE_MESSAGE,
        tableLoader: false,
        /**
            keepLoader flag is added here because when we invoke any command model functionality, filterCollection happens for pagination
            by that time, if the tableLoader is true, filterCollection method kills off the table loader even though command model wants the loader
            to persist till command model job is over. Hence, introduced this new flag here to prevent the filterCollection method from killing
            the table loader.
         **/
        keepLoader: false,
        selectedRoomId: undefined,
        isCheckboxSelected: false,
        enableCheckbox: true,
        checkboxSelection: [],
        tableCellWidth : "590px",
        showPanelField: false,
        checkbox: [
          {
            select: (value, checkBoxIndex) => this._updateCheckboxSelection(value, checkBoxIndex),
            value: false,
            attribute: "checkBoxField",
            enableCellCheckbox: true,
            enableHeaderCheckbox: true
          }
        ],
      },
      customModal: {
        show: false,
        onHide: this.onCloseCustomModal.bind(this),
        header: undefined,
        centered: true,
        restrictBody: true,
        showBodyItemView: undefined,
        modalSize: "medium",
        footerEnabled: false,
        footerButtons: undefined
      },
      /**
        customModalBodyViewOptions flag is introduced here because of commands model use case.
        commands model is not a React component, hence rendering or updating the state of any view is not possible in commands model.
        So, for custom modal, to update the state of the custom modal's body view, Table view allows to render the custom modal's body view
        as its own state, hence updating the state of the custom modal's body view is possible through table.view.js
       **/
      customModalBodyViewOptions: undefined, // This value should get populated to use custom modal's body view.
    };
    this.params = props.params;
    this.paginationConstants = tableViewConstants.paginationConstants;
    this.propertyStatusTableHeader = tableViewConstants.PropertyStatusTableHeader;
    this.propertyStatusRequiredKey = tableViewConstants.PropertyStatusRequiredKey;
    this.convertableConstants = tableViewConstants.convertableConstants;
    this.fetchableWidgets = tableViewConstants.fetchableWidgetTiles;
    this.tableViewTemplate = new TableViewTemplateHelpers();
  };
  
  templateHelpers(){
    this.prepareTemplateHelpersData();
    this.prepareTableData(); // When the table data is ready, Call the metadata table view!
    this.setupEvents();
    return this.tableViewTemplate.tableViewTemplateHelper(this.state.metadataTableState, this.widgetTileModel);
  };
  
  // Render custom modal!
  _renderCustomModal(){
    return this.tableViewTemplate._renderCustomModal(this.state.customModal);
  };

  // Table view allows other components or commands model to render custom modal body view.
  // To render the custom modal, use _prepareCustomModal method and to render custom modal body view, Use the flag renderCustomBodyView!
  _renderCustomModalBodyView(){
    return <MetadataFields data = {this.state.customModalBodyViewOptions} updateData = {(updatedData) => this.setState({customModalBodyViewOptions: updatedData})}/>
  };
  
  // Set up events for any actions!
  setupEvents(){
    this.templateHelpersData.options.onBack = this.onBackClick.bind(this);
  };
  
  // Handle back action triggered on left side controller!
  onBackClick(){
    this.props.dashboardController({reloadSidepanel: {silent: true}, navigateToPropertyContainer:true});
  };

  // Reset checkbox selection!
  _resetCheckboxSelection(){
    this.state.metadataTableState.checkboxSelection = [];
  };

  // Update the checkbox selection.
  _updateCheckboxSelection(value, checkBoxIndex){
    if(checkBoxIndex){
      if(value){
        this.state.metadataTableState.checkboxSelection.push(checkBoxIndex);
      } else {
        _.remove(this.state.metadataTableState.checkboxSelection, function(index){
          return index === checkBoxIndex;
        });
      }
    } else {
      this.state.metadataTableState.checkboxSelection = [];
    }
    // Update the toolbar padding style settings for menu action items.
    this.state.metadataTableState.checkboxSelection.length > 0 ? this.panelFieldState[0].style.paddingLeft = 0
        : this.panelFieldState[0].style.paddingLeft = 10 // Custom panel field requires a custom style property.
    this._updateMetadataTableState();
  };

  // On page shift from pagination view, increase the skipCount and limitCount based on the selectedIndex.
  onPageShift(selectedIndex){
    var index = selectedIndex - 1;
    // Table loader will be set to false when the computation has been completed in the filter collection function.
    this._toggleTableLoader(true);
    this._resetCheckboxSelection();
    this.widgetTileModel.paginationData.skipCount = (index * this.paginationConstants.PAGINATION_DEFAULT_LIMIT);
    this.widgetTileModel.paginationData.limitCount = (selectedIndex * this.paginationConstants.PAGINATION_DEFAULT_LIMIT);
    this.widgetTileModel.paginationData.getNextNode = true;
  };

  // Adjust property container height in case pagination view is set to true.
  _adjustHeightForPagination(){
    if(this.widgetTileModel.allowPagination && !this.widgetTileModel.isHeightAdjustedForPagination){
      this.widgetTileModel.height = this.widgetTileModel.height - this.paginationConstants.PAGINATION_VIEW_HEIGHT;
      this.widgetTileModel.isHeightAdjustedForPagination = true;
    }
    if(!this.widgetTileModel.allowPagination && this.widgetTileModel.isHeightAdjustedForPagination){
      this.widgetTileModel.height = this.widgetTileModel.height + this.paginationConstants.PAGINATION_VIEW_HEIGHT;
      this.widgetTileModel.isHeightAdjustedForPagination = false;
    }
  };

  // Validate state fields, this state fields would be from the non-component file such as commands model.
  // Fields cannot be validated by node convertor if it's not a component file,
  // so table.view allows to render custom modal body view and validate the fields passed by the non-component file.
  async validateAbstractedStateFields(){
    var isValid = await validateFieldData(this.state.customModalBodyViewOptions, (validatedData) => this.setState({customModalBodyViewOptions: validatedData}));
    if(isValid.length === 0){
      return nodeConvertor(this.state.customModalBodyViewOptions, ['value']);
    }
  };

  // Enable pagination view if the limit set to pagination exceeds.
  _checkAndEnablePaginationView(convertedCollection){
    var widgetTileModelCount = this.widgetTileModel.data.widgetTileModelCount?.[this.roomConstant] || convertedCollection.length;
    this.isPaginationRequired = widgetTileModelCount > this.paginationConstants.PAGINATION_DEFAULT_LIMIT;
    this.widgetTileModel.allowPagination = this.isPaginationRequired;
    this.widgetTileModel.paginationData.count = this.isPaginationRequired ? widgetTileModelCount : 0;
    this._adjustHeightForPagination();
  };
  
  // Organize and prepare the required table data!
  prepareTableData(){
    if(this.widgetTileModel.data !== undefined){
      this.getWidgetTileTableCollectionData(); // Get the widget tile collection data for the table cell values!
    };
  };
  
  // Update metadata table state!
  _updateMetadataTableState(){
    this.setState({metadataTableState: this.state.metadataTableState});
  };
  
  _toggleTableLoader(value, keepLoader){
    this.state.metadataTableState.tableLoader = value;
    this.state.metadataTableState.keepLoader = keepLoader;
    this._updateMetadataTableState();
  };
  
  // Template helpers data!
  prepareTemplateHelpersData(){
    this.templateHelpersData.options = {
      selectedRoomConstant: this.widgetTileModel.data.selectedRoomConstant,
      roomConstantKey: this.roomConstant,
      params: this.params,
      nodes: this.state.metadataTableState.checkboxSelection,
      eventHelpers: {
        dashboardController: (opts) => this.props.dashboardController(opts),
        onRoomTransfer: (opts) => this.props.onRoomTransfer(opts),
        triggerTableLoader: (value, keepLoader) => this._toggleTableLoader(value, keepLoader),
        updateCheckboxSelection: (value, checkboxIndex) => this._updateCheckboxSelection(value, checkboxIndex),
        triggerCustomModel: (options) => this._prepareCustomModal(options),
        collapseCustomModal: () => this.onCloseCustomModal(),
        validateStateFields: () => this.validateAbstractedStateFields(),
        removeFromTableCollection: (model) => this.removeFromTableCollection(model),
        updateSelectedModel: (roomModel, dashboardMode, userModel) => this.props.updateSelectedModel(roomModel, dashboardMode, userModel)
      }
    }
  };

  // Remove from table collection in case of moveToNextState operation.
  removeFromTableCollection(selectedModel){
    _.remove(this.widgetTileModel.data.widgetTileModel[this.widgetTileModel.data.selectedRoomConstant], function(tableModel){
      return tableModel._id === selectedModel._id;
    });
  };
  
  // Get room constant collection!
  async getRoomConstantCollection(){
    if(!this.roomConstant) this.getTableHeaders(); // Sometimes when the component is being rendered and when the component
    // is being updated, this.roomConstant becomes undefined, so if its undefined get the room-constant before proceeding.
    if(this.roomConstant !== 'afterCheckin'){
      return this.widgetTileModel.data.widgetTileModel?.[this.widgetTileModel.data.selectedRoomConstant] || await this.setExpandedTableView();
    } else {
      return this.widgetTileModel.propertyDetails.userCollection;
    }
  };

  // Fetch next nodes only for fetchable widgets.
  async fetchNextNode(){
    var options = {baseUrl: Variables.hostId, accId: this.params.accIdAndName[0], paginationData: this.widgetTileModel.paginationData};
    this.nextNode = await fetch(this.fetchableWidgets[this.roomConstant](options));
    this.nextNodeData = await this.nextNode.json();
    this.rawRoomModel = this.nextNodeData.data.result;
    // Commented this line because when we change it to false, NextNode will not get fetched when the data changes,
    // For example, When we perform export to excel command, when the modal renders, getWidgetTileTableCollectionData function will execute, that time
    // getNextNode will be false, so that only the initial 15 data will persist which will cause the length of filteredCollection to zero.
    // this.widgetTileModel.paginationData.getNextNode = false;
  };

  // Check for fetchable widgets.
  isFetchableWidget(){
    return Object.keys(this.fetchableWidgets).includes(this.roomConstant);
  };

  // Filter the converted collection for pagination.
  filterCollection(collection){
    this.filteredCollection = collection.slice(this.widgetTileModel.paginationData.skipCount, this.widgetTileModel.paginationData.limitCount);
    this.state.metadataTableState.tableLoader && !this.state.metadataTableState.keepLoader && this._toggleTableLoader(false);
  };

  // Check for convertable constant and convert them.
  _checkForConvertableConstant(convertedModel){
    var convertableKeys = Object.keys(this.convertableConstants);
    if(convertableKeys.includes(this.roomConstant)){
      var convertableObj = this.convertableConstants[this.roomConstant],
          convertedResult = convertObjectValue([convertedModel], convertableObj.keyToConvert, convertableObj.objRules);
      // The above function takes array of object as an input, so converting an object into and array and then reverting back while passing the result.
      return convertedResult[0];
    } else {
      return convertedModel;
    }
  };
  
  // Get the widget tile model data for the table!
  async getWidgetTileTableCollectionData(){
    this.filterEnabled = false;
    var convertedCollection = [];
    this.rawRoomModel = await this.getRoomConstantCollection();
    this.getTableHeaders(); // Get the table headers!
    this.shouldFetchForWidget = this.widgetTileModel.paginationData.getNextNode && this.isFetchableWidget(); // Check for fetchable widgets.
    this.shouldFetchForWidget && await this.fetchNextNode();
    if(this.rawRoomModel){
      this.rawRoomModel.map((data) => {
        // Clone the data before filtering the keys as it would change the original data which would cause some trouble in the roomCollection!
        var clonedData = _.clone(data);
        var convertedModel = filterKeysInObj(clonedData, this.propertyStatusRequiredKey[this.roomConstant]);
        var arrangedObj = arrangeObj(convertedModel, this.propertyStatusRequiredKey[this.roomConstant]);
        arrangedObj = this._checkForConvertableConstant(arrangedObj);
        convertedCollection.push(arrangedObj);
      });  
    };
    this.filterCollection(convertedCollection);
    this.state.metadataTableState.cellValues = this.filteredCollection;
    this._checkAndEnablePaginationView(convertedCollection);
    this.filterEnabled && this._setFilterTableState();
  };
  
  // Get the table headers for the selected widget tile!
  getTableHeaders() {
    this.state.metadataTableState.headerValue = undefined; // Set the initial value
    if(this.widgetTileModel.data.userStatusMap !== undefined){
      this.roomConstant = _.findKey(this.widgetTileModel.data.userStatusMap, function(value) { // Using lodash function here to get the key by its value!
          return value === this.widgetTileModel.data.selectedRoomConstant;
      }.bind(this));
      this.state.metadataTableState.headerValue = this.propertyStatusTableHeader[this.roomConstant];
    } else {
      this.state.metadataTableState.headerValue = this.propertyStatusTableHeader[this.roomConstant];
    };
  };
  
  // Prepare custom modal state data!
  _prepareCustomModal(options){
    // If renderCustomBodyView is true and customModalBodyViewOptions is provided, set it in customModalBodyViewOptions state.
    if(options.renderCustomBodyView && options.customBodyViewOptions){
      this.setState({customModalBodyViewOptions: options.customBodyViewOptions});
    };
    this.state.customModal.show = true;
    this.state.customModal.centered = options.centered !== undefined ? options.centered : true;
    this.state.customModal.onHide = options.onHide !== undefined ? options.onHide : this.state.customModal.onHide;
    this.state.customModal.restrictBody = (options.restrictBody === false) ? options.restrictBody : true; // By default, restrictBody is set to true.
    // Refer the declaration of customModalBodyViewOptions to understand this flag use case.
    this.state.customModal.showBodyItemView = () => options.renderCustomBodyView ? this._renderCustomModalBodyView() : (options.showBodyItemView && options.showBodyItemView());
    this.state.customModal.header = options.header;
    this.state.customModal.modalSize = options.modalSize;
    this.state.customModal.footerEnabled = options.footerEnabled;
    this.state.customModal.footerButtons = options.footerButtons;
    this._toggleCustomModal();
  };
  
  // trigger custom modal!
  _toggleCustomModal(){
    this.setState({customModal: this.state.customModal});
  };
  
  // On close custom modal dialog!
  onCloseCustomModal(){
    this.state.customModal.show = false;
    this.state.customModal.header = undefined;
    this.state.customModal.footerEnabled = false;
    this.state.customModal.footerButtons = undefined;
    this._toggleCustomModal();
  };

  // Left side controller and header!
  _renderLeftSideController(){
    return this.tableViewTemplateHelpers.renderLeftSideController();
  };
  
  // Base table view toolbar item view.
  renderTableToolbarView(){
    this.tableViewTemplateHelpers = new TableViewTemplateHelpers(this.templateHelpersData);
    // If the checkbox selection is greater than 0,
    // then render tha table menu action items.
    if(!this.state.metadataTableState.checkboxSelection) {
      return this._renderLeftSideController();
    }
    if(this.state.metadataTableState.checkboxSelection.length === 0){
      return this._renderLeftSideController();
    } else {
      return this.tableViewTemplateHelpers.renderMenuActionItems();
    }
  };
  
  // On render function!
  render(){
    return(
      <>
        <MetadataFields data = {this.panelFieldState} />
        {this.templateHelpers()}
        {this.state.customModal?.show && this._renderCustomModal()}
      </>
    )
  };
};

export default TableView;