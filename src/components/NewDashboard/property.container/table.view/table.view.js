import React from 'react';
import _ from 'lodash';
import TableViewTemplateHelpers from './table.view.template';
import Variables from "../../../Variables";
import {
  arrangeObj,
  convertObjectValue,
  extractStateValue,
  filterArrayOfObjectsWithSearchObjects,
  filterKeysInObj,
  nodeConvertor,
  validateFieldData
} from '../../../common.functions/node.convertor';
import tableViewConstants from './table.view.constants';
import MetadataFields from '../../../fields/metadata.fields.view';
import TableFilterSettingsDialog from "../../dialogs/table.filter.settings/table.filter.settings.dialog";
import CollectionInstance from "../../../../global.collection/widgettile.collection/widgettile.collection";
import TableCreateActionDialog from "../../dialogs/table.create.action/table.create.action.dialog";

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
      isHeightAdjustedForFacets: false,
      facetOptions: undefined,
      paginationData: {
        count: tableViewConstants.paginationConstants.PAGINATION_DEFAULT_COUNT,
        skipCount: tableViewConstants.paginationConstants.PAGINATION_DEFAULT_SKIP_COUNT,
        limitCount: tableViewConstants.paginationConstants.PAGINATION_DEFAULT_LIMIT, // Limit count will be always 15, If needed can be changed.
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
        tableCellWidth : "590px",
        showPanelField: false,
        checkbox: [
          {
            select: (value, checkBoxIndex) => this._updateCheckboxSelection(value, checkBoxIndex),
            value: false,
            attribute: "checkBoxField",
            enableCellCheckbox: true,
            enableHeaderCheckbox: true,
            selectedCheckboxIndex: []
          }
        ],
      },
      facets: {
        isFacetsEnabled: false,
        facetsHeight: undefined
      },
      customModal: {
        show: false,
        onHide: this.onCloseCustomModal.bind(this),
        header: undefined,
        centered: true,
        restrictBody: true,
        customComponent: undefined,
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
    this.stateRouter = props.stateRouter;
    /**
     Router options for the table view. Options that has to be passed to the dashboard controller defines the previous perspective.
     Those options based on the last router will be defined as the object here.
     **/
    this.routerOptions = {
      'default-view': {reloadSidepanel: {silent: true}, navigateToPropertyContainer: true},
      'property-container': {reloadSidepanel: {silent: true}, persistStatusView:true, updatedModel: this.widgetTileModel.data.roomModel},
      'table-view': {reloadSidepanel: {silent: true}, navigateToStatusTableView: true, dashboardMode: this.stateRouter.dashboardModel[this.stateRouter.dashboardModel.length - 1],
        selectedRoomConstant: this.stateRouter.tableModel[this.stateRouter.tableModel.length - 1]}
    };
    /**
     Keep local track of selected checkbox value,
     So that when the table renders again because of pagination, We can populate the selectedCheckboxIndex into state again.
    **/
    this.selectedCheckboxIndex = [];
    /**
      For fetchable widgets, selected model data has to be separately tracked.
      Everytime, we fetch for a new page data this.rawRoomModel gets resets,
      so it's impossible to get the selectedNodes table model data from this.rawRoomModel.
     Hence, for fetchable widgets, selectedModel data will be tracked in fetchableWidgetSelectedTableModel separately.
    **/
    /**
     * getPaginationCountFromCurrentCollection flag is introduced because for some widget tiles, We might want to
     * calculate the pagination based on the current collection rather than the widgetTileModelCount e.g. voucherWidget
    **/
    this.getPaginationCountFromCurrentCollection = false;
    this.fetchableWidgetSelectedTableModel = [];
    this.routerController = () => this.props.routerController();
    this.isStateRouterNotified = false;
    this.tablePerspectiveConstant = tableViewConstants.tablePerspectiveConstant;
    this.paginationConstants = tableViewConstants.paginationConstants;
    this.propertyStatusTableHeader = tableViewConstants.PropertyStatusTableHeader;
    this.propertyStatusRequiredKey = tableViewConstants.PropertyStatusRequiredKey;
    this.convertableConstants = tableViewConstants.convertableConstants;
    this.fetchableWidgets = tableViewConstants.fetchableWidgetTiles;
    this.filterOptions = {};
    this.tableViewTemplate = new TableViewTemplateHelpers();
  };
  
  templateHelpers(){
    this.prepareTemplateHelpersData();
    this.prepareTableData(); // When the table data is ready, Call the metadata table view!
    return this.tableViewTemplate.tableViewTemplateHelper(this.state.metadataTableState, this.widgetTileModel);
  };
  
  // Render custom modal!
  _renderCustomModal(){
    return this.tableViewTemplate._renderCustomModal(this.state.customModal);
  };

  // Render Facets Panel!
  _renderFacetsPanel(){
    return this.tableViewTemplate._renderFacetContainer(this.widgetTileModel.facetOptions);
  };

  // Table view allows other components or commands model to render custom modal body view.
  // To render the custom modal, use _prepareCustomModal method and to render custom modal body view, Use the flag renderCustomBodyView!
  // <MetadataFields data = {this.state.customModalBodyViewOptions} updateData = {(updatedData) => this.setState({customModalBodyViewOptions: updatedData})}/>
  _renderCustomModalBodyView(){
    if(this.state.customModal.customComponent){
      return this.state.customModal.customComponent;
    } else {
      return <MetadataFields data = {this.state.customModalBodyViewOptions} updateData = {(updatedData) => this.setState({customModalBodyViewOptions: updatedData})}/>
    }
  };

  // Handle back action triggered on left side controller!
  onBackClick(){
    // Before navigating back to the last router instance, Delete the current router / last router from the stateRouter model first.
    this.routerController()._notifyStateRouter({routerOptions: {action: 'DELETE'}}).then((result) => {
      this.props.dashboardController(this.routerOptions[result.stateModel[result.stateModel.length - 1]]);
    });
  };

  // Reset checkbox selection!
  _resetCheckboxSelection(){
    this.state.metadataTableState.checkbox[0].selectedCheckboxIndex = [];
  };

  // Restore checkbox selection when the page changes.
  _restoreCheckboxSelection(options){
    if(options?.checkboxSelection){
      this.selectedCheckboxIndex = options.checkboxSelection;
      if(this.isFetchableWidget()){
        _.remove(this.fetchableWidgetSelectedTableModel, function(tableModel){
          return !options.checkboxSelection.includes(tableModel._id);
        });
      }
    }
    this.state.metadataTableState.checkbox[0].selectedCheckboxIndex = this.selectedCheckboxIndex;
  };

  // For fetchable widgets, selected table model data has to be handled/tracked separately.
  _updateFetchableWidgetSelectedTableModel(action, checkboxIndex){
    if(action){ // Add into fetchableWidgetSelectedTableModel
      this.fetchableWidgetSelectedTableModel.push(this._getTableCollection({nodes: [checkboxIndex]})[0]);
    } else {
      _.remove(this.fetchableWidgetSelectedTableModel, function(tableModel){
        return tableModel._id === checkboxIndex;
      });
    }
  };

  // Update the checkbox selection.
  _updateCheckboxSelection(value, checkBoxIndex){
    if(checkBoxIndex){
      // Check for any checkbox selection, If there is any, Populate it in the state.
      this._restoreCheckboxSelection();
      if(value){
        this.state.metadataTableState.checkbox[0].selectedCheckboxIndex.push(checkBoxIndex);
      } else {
        _.remove(this.state.metadataTableState.checkbox[0].selectedCheckboxIndex, function(index){
          return index === checkBoxIndex;
        });
      }
      this.isFetchableWidget() && this._updateFetchableWidgetSelectedTableModel(value, checkBoxIndex);
    } else {
      this.state.metadataTableState.checkbox[0].selectedCheckboxIndex = [];
    }
    this.selectedCheckboxIndex = this.state.metadataTableState.checkbox[0].selectedCheckboxIndex;
    // Update the toolbar padding style settings for menu action items.
    this.state.metadataTableState.checkbox[0].selectedCheckboxIndex.length > 0 ? this.panelFieldState[0].style.paddingLeft = 0
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

  _adjustHeightForFacets(){
    if(this.state.facets.isFacetsEnabled && this.state.facets.facetsHeight && !this.widgetTileModel.isHeightAdjustedForFacets){
      this.widgetTileModel.height = this.widgetTileModel.height - this.state.facets.facetsHeight;
      this.widgetTileModel.isHeightAdjustedForFacets = true;
    } else if (this.widgetTileModel.isHeightAdjustedForFacets && !this.state.facets.facetsHeight){
      this.widgetTileModel.height = this.props.height;
      this.widgetTileModel.isHeightAdjustedForFacets = false;
    }
  };

  // Get the height of the facet panel container from the facet view.
  _setHeightForFacets(options){
    if(!this.widgetTileModel.isHeightAdjustedForFacets && options.facetsHeight){
      this._updateComponentState({key: 'facets', value: {isFacetsEnabled: true, facetsHeight: options.facetsHeight}}, this._adjustHeightForFacets.bind(this));
    }
    if(this.widgetTileModel.isHeightAdjustedForFacets && !options.facetsHeight){
      this._updateComponentState({key: 'facets', value: {isFacetsEnabled: false, facetsHeight: options.facetsHeight}}, this._adjustHeightForFacets.bind(this));
    }
  };

  // Validate state fields, this state fields would be from the non-component file such as commands model.
  // Fields cannot be validated by node convertor if it's not a component file,
  // so table.view allows to render custom modal body view and validate the fields passed by the non-component file.
  async validateAbstractedStateFields(options){
    var isValid = await validateFieldData(this.state.customModalBodyViewOptions, (validatedData) => this.setState({customModalBodyViewOptions: validatedData}));
    if(isValid.length === 0){
      return options?.fieldProp ? {node: nodeConvertor(this.state.customModalBodyViewOptions), fieldProp: extractStateValue(this.state.customModalBodyViewOptions, options.fieldProp)}
          : nodeConvertor(this.state.customModalBodyViewOptions);
    }
  };

  // Enable pagination view if the limit set to pagination exceeds.
  _checkAndEnablePaginationView(convertedCollection){
    var widgetTileModelCount = (this.filterInitiated || this.getPaginationCountFromCurrentCollection) ? convertedCollection.length :
        (this.widgetTileModel.data.widgetTileModelCount?.[this.roomConstant] || convertedCollection.length);
    this.isPaginationRequired = widgetTileModelCount > this.paginationConstants.PAGINATION_DEFAULT_LIMIT;
    this.widgetTileModel.allowPagination = this.isPaginationRequired;
    this.widgetTileModel.paginationData.count = this.isPaginationRequired ? widgetTileModelCount : 0;
    this._adjustHeightForPagination();
  };

  // Notify the state router when the perspective is ready!
  notifyStateRouter(){
    var opts = {
      routerOptions: {
        currentRouter: this.tablePerspectiveConstant,
        currentTableMode: this.widgetTileModel.data.selectedRoomConstant,
        currentDashboardMode: this.widgetTileModel.data.dashboardMode,
        action: 'ADD'
      }
    };
    this.routerController()._notifyStateRouter(opts);
    this.isStateRouterNotified = true;
  };
  
  // Organize and prepare the required table data!
  prepareTableData(){
    if(this.widgetTileModel.data !== undefined){
      this.getWidgetTileTableCollectionData().then(() => {
        !this.isStateRouterNotified && this.notifyStateRouter();
      }); // Get the widget tile collection data for the table cell values!
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

  _setFacetState(val, height){
    this.state.facets.isFacetsEnabled = val;
    this._updateComponentState({key: 'facets', value: {isFacetsEnabled: val, facetsHeight: height}});
  };

  _updateComponentState(state, nextFunction){
    this.setState({ [state.key]: state.value }, async () => {
      _.isFunction(nextFunction) && await nextFunction();
    })
  };

  // Check if the table filter mode is enabled for the roomConstantKey.
  checkForTableFilterMode(){
    return this.roomConstant && tableViewConstants.tableFilterSettings.tableFilterAllowedKeys.includes(this.roomConstant);
  };

  // Check if the current table mode is enabled for create operation.
  checkForTableCreateMode(){
    return this.roomConstant && tableViewConstants.tableCreateMode.tableCreateModeAllowedKeys.includes(this.roomConstant);
  };

  // Execute action when table filter model triggered.
  onFilterTableIconClicked(){
    this.isActionExecutedFromCommands = true; // Need to keep track of this flag to prevent changing the table data to empty when re-renders happens through customModalBodyViewOptions.
    // When the filter action is triggered, initialize the custom modal with the table dialog options from command table filter settings.
    this._prepareCustomModal(TableFilterSettingsDialog.execute(this.templateHelpersData.options));
  };

  // Execute action when table create mode is triggered.
  onCreateModeTableIconClicked(){
    this.isActionExecutedFromCommands = true;
    this._prepareCustomModal(TableCreateActionDialog.execute(this.templateHelpersData.options));
  };
  
  // Template helpers data!
  prepareTemplateHelpersData(){
    this.templateHelpersData.options = {
      selectedRoomConstant: this.widgetTileModel.data.selectedRoomConstant,
      roomConstantKey: this.roomConstant,
      allowHeaderControl: true,
      allowTableFilterMode: this.checkForTableFilterMode(),
      allowCreateMode: this.checkForTableCreateMode(),
      onBack: () => this.onBackClick(),
      onClickTableFilterMode: () => this.onFilterTableIconClicked(),
      onClickTableCreateMode: () => this.onCreateModeTableIconClicked(),
      params: this.params,
      nodes: this.state.metadataTableState.checkbox[0].selectedCheckboxIndex,
      eventHelpers: {
        dashboardController: (opts) => this.props.dashboardController(opts),
        _isFetchableWidget: () => this.isFetchableWidget(),
        routerController: () => this.routerController(),
        triggerTableLoader: (value, keepLoader) => this._toggleTableLoader(value, keepLoader),
        triggerCommandExecution: () => {
          this.isActionExecutedFromCommands = true
        },
        updateCheckboxSelection: (value, checkboxIndex) => this._updateCheckboxSelection(value, checkboxIndex),
        restoreOrUpdateCheckboxSelection: (options) => this._restoreCheckboxSelection(options),
        triggerCustomModel: (options) => this._prepareCustomModal(options),
        prepareFilterOptions: (options) => this._prepareFilterOptions(options),
        prepareFacetOptions: (options) => this._prepareFacetOptions(options),
        refineTableCollection: (tableCol) => this.refineTableCollection(tableCol),
        collapseCustomModal: () => this.onCloseCustomModal(),
        validateStateFields: (options) => this.validateAbstractedStateFields(options),
        getTableCollection: (options) => this._getTableCollection(options),
        getTableHeaders: () => this.getTableHeaders(),
        removeFromTableCollection: (model) => this.removeFromTableCollection(model),
        addIntoTableCollection: (model) => this.addIntoTableCollection(model),
        updateModelFromTableCollection: (model) => this.updateModelFromTableCollection(model),
        updateSelectedModel: (options) => this.props.updateSelectedModel(options)
      }
    }
  };

  // Remove from table collection in case of moveToNextState operation.
  removeFromTableCollection(selectedNodes){
    _.remove(this.widgetTileModel.data.widgetTileModel[this.widgetTileModel.data.selectedRoomConstant], function(model){
      return selectedNodes.includes(model._id);
    });
  };

  // Updated model in the table collection, can be updated in the UI using this method.
  updateModelFromTableCollection(updatedModel){
    // This method should be overridden if table.view is being extended by any other component.
    // If not extended add the locallyCreatedModel into the widgetTileModel and update the corresponding state model in dashboard.container.wrapper if necessary!
    var indexToUpdate = _.findIndex(this.widgetTileModel.data.widgetTileModel[this.widgetTileModel.data.selectedRoomConstant], function(model){
      return model._id === updatedModel._id;
    });
    if(indexToUpdate !== -1){
      _.assign(this.widgetTileModel.data.widgetTileModel[this.widgetTileModel.data.selectedRoomConstant][indexToUpdate], updatedModel);
    }
  };

  // Add newly created items into the table collection.
  addIntoTableCollection(locallyCreatedModel){
    // This method should be overridden if table.view is being extended by any other component.
    // If not extended add the locallyCreatedModel into the widgetTileModel and update the corresponding state model in dashboard.container.wrapper
    const isCreatedModelAlreadyExists = _.filter(this.widgetTileModel.data.widgetTileModel[this.widgetTileModel.data.selectedRoomConstant], function(model){
      return model._id === locallyCreatedModel._id;
    });
    if(isCreatedModelAlreadyExists.length === 0){
      this.widgetTileModel.data.widgetTileModel[this.widgetTileModel.data.selectedRoomConstant].push(locallyCreatedModel);
      this.rawRoomModel.push(locallyCreatedModel);
    }
  };

  // Get table data from the table collection. If nodes collection not provided, It will return all the table collections.
  _getTableCollection(options){
    var filteredTableCollection;
    if(options?.nodes){
      filteredTableCollection = _.filter(this.rawRoomModel, function(tableModel){
        return options.nodes.includes(tableModel._id);
      });
      if(this.isFetchableWidget() && filteredTableCollection && options.nodes.length !== filteredTableCollection.length){
        filteredTableCollection = this.fetchableWidgetSelectedTableModel;
      };
      return this.refineTableCollection(filteredTableCollection);
    } else {
      return this.refineTableCollection(this.rawRoomModel);
    }
  };

  // Client side filtering --> Filter the data based on the filter model passed which filterOptions query.
  clientSideFilter(){
    if(this.filterOptions.query){
      this.rawRoomModel = filterArrayOfObjectsWithSearchObjects(this.rawRoomModel, this.filterOptions.query);
    }
  };
  
  // Get room constant collection!
  async getRoomConstantCollection(){
    if(this.roomConstant !== 'afterCheckin'){
      var widgetTileModel = this.widgetTileModel.data.widgetTileModel?.[this.widgetTileModel.data.selectedRoomConstant];
      if (!widgetTileModel || widgetTileModel.length === 0) {
        return (_.isFunction(this.setExpandedTableView) ? await this.setExpandedTableView() : []);
      } else {
        return widgetTileModel;
      }
    } else {
      // Create a shallow copy of the array before reversing.
      // User Collection doesn't have data about the room type, Room type is needed in user collection for filtering.
      var userCollection = [...this.widgetTileModel.propertyDetails.userCollection].reverse();
      userCollection.map((userModel) => {
        userModel['suiteName'] = CollectionInstance.whereInCollections('roomsListCollection', undefined, '_id', userModel.room)[0].suiteName;
      })
      return userCollection;
    }
  };

  _prepareFacetOptions(options){
    // When creating facet options, attach table view event also so that when facet has been cleared,
    // Facet view can let the table view know that the facet has been cleared.
    // Facets will get enabled when filter action is triggered.
    this._setFacetState(true); // And table has to know about the facets data,
    // So facets has to come from originating place of filter.
    options['originatingView'] = {};
    options.originatingView.prepareFilterOptions =  (options) => this.templateHelpersData.options.eventHelpers.prepareFilterOptions(options);
    options.originatingView._toggleTableLoader = (value, keepLoader) => this.templateHelpersData.options.eventHelpers.triggerTableLoader(value, keepLoader);
    options.originatingView._setHeightForFacets = (options) => this._setHeightForFacets(options);
    this.widgetTileModel.facetOptions = options;
  };

  // Restore filter options flag, When filter options is empty object.
  _restoreFilterOptions(){
    this.filterInitiated = false;
    this.isActionExecutedFromCommands = false;
    this.widgetTileModel.isHeightAdjustedForPagination = false;
    this.filterOptions.query && delete this.filterOptions.query;
  };

  // Check if the next node has to be fetched and set the getNextNode flag accordingly.
  checkAndSetFetchNextNode(){
    if(this.isFetchableWidget()){
      this.widgetTileModel.paginationData.getNextNode = this.widgetTileModel.paginationData.skipCount > 0;
    } else {
      this.widgetTileModel.paginationData.getNextNode = false;
    }
  };

  // Check if any of the model has been selected.
  isTableRowSelected(){
    return this.state.metadataTableState.checkbox[0].selectedCheckboxIndex.length > 0;
  };

  // Prepare filter options from the other parts of the program so that the url can be structured accordingly.
  _prepareFilterOptions(options){
    this.filterOptions['baseUrl'] = Variables.hostId;
    this.filterOptions['accId'] = this.params.accIdAndName[0];
    this.filterOptions['paginationData'] = this.widgetTileModel.paginationData
    if(options){
      if(_.isEmpty(options)){
       this._restoreFilterOptions();
       this.checkAndSetFetchNextNode();
        return;
      }
      this.filterInitiated = true;
      this.widgetTileModel.paginationData.getNextNode = true; // Set it to true so when the re-render happens,
      // getWidgetTileTableCollectionData method will be able to fetch the next node with search query params.
      this.filterOptions['query'] = {};
      Object.keys(options).forEach((opts) => {
        this.filterOptions.query[opts] = options[opts];
      })
    }
    this.isActionExecutedFromCommands = false; // When _prepareFilterOptions method being executed, it means that the filter modal has been closed.
  };

  // Fetch next nodes only for fetchable widgets.
  async fetchNextNode(){
    this._prepareFilterOptions();
    this.nextNode = await fetch(this.fetchableWidgets[this.roomConstant](this.filterOptions));
    this.nextNodeData = await this.nextNode.json();
    this.rawRoomModel = this.nextNodeData.data.result;
    // Commented this line because when we change it to false, NextNode will not get fetched when the data changes,
    // For example, When we perform export to excel command, when the modal renders, getWidgetTileTableCollectionData function will execute, that time
    // getNextNode will be false, so that only the initial 15 data will persist which will cause the length of filteredCollection to zero.
  };

  // Check for fetchable widgets.
  isFetchableWidget(){
    if(!this.roomConstant) this.getTableHeaders(); // Sometimes when the component is being rendered and when the component
    // is being updated, this.roomConstant becomes undefined, so if its undefined get the room-constant before proceeding.
    return Object.keys(this.fetchableWidgets).includes(this.roomConstant);
  };

  // Filter the converted collection for pagination.
  filterCollection(collection){
    // When the filter happens in page 2 or so, This method tries to filter the collection irrespective of the collection length.
    // Let's say we are in page 2, That time skipCount and limitCount will be 15 and 30 and our search result is just 2.
    // To avoid that problem, Only if the collection length is greater than default limit, do the slicing of the collection.
    this.filteredCollection = collection;
    if(collection.length > this.paginationConstants.PAGINATION_DEFAULT_LIMIT){
      this.filteredCollection = collection.slice(this.widgetTileModel.paginationData.skipCount, (2 * this.widgetTileModel.paginationData.skipCount || 15));
    }
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

  // Refining table data collections!
  refineTableCollection(tableCollection){
    var convertedCollection = [];
    tableCollection.map((tableModel) => {
      var clonedData = _.clone(tableModel);
      var convertedModel = filterKeysInObj(clonedData, this.propertyStatusRequiredKey[this.roomConstant]);
      var arrangedObj = arrangeObj(convertedModel, this.propertyStatusRequiredKey[this.roomConstant]);
      convertedCollection.push(this._checkForConvertableConstant(arrangedObj));
    });
    return convertedCollection;
  };
  
  // Get the widget tile model data for the table!
  async getWidgetTileTableCollectionData(){
    var convertedCollection;
    this.shouldFetchForWidget = this.widgetTileModel.paginationData.getNextNode && this.isFetchableWidget(); // Check for fetchable widgets.
    if (this.isFetchableWidget() && (!this.filterInitiated && !this.isActionExecutedFromCommands && !this.isTableRowSelected())) {
      // We check for any table row is selected when selecting a checkboxes to prevent unnecessary data changed in rawRoomModel
      // and to prevent unwanted re-renders.
      this.rawRoomModel = await this.getRoomConstantCollection();
    } else if (!this.isFetchableWidget() && !this.isActionExecutedFromCommands) {
      this.rawRoomModel = await this.getRoomConstantCollection();
      this.filterInitiated && this.clientSideFilter();
    }
    this.getTableHeaders(); // Get the table headers!
    this.shouldFetchForWidget && await this.fetchNextNode();
    if(this.rawRoomModel){
      convertedCollection = this._getTableCollection();
      this._restoreCheckboxSelection();
      this.filterCollection(convertedCollection);
      this.state.metadataTableState.cellValues = this.filteredCollection;
      this._checkAndEnablePaginationView(convertedCollection);
      this.filterEnabled && this._setFilterTableState();
      this.widgetTileModel.paginationData.getNextNode = false;
    };
  };

  _getRoomConstantKey(){
    this.roomConstant = _.findKey(this.widgetTileModel.data.userStatusMap, function(value) { // Using lodash function here to get the key by its value!
      return value === this.widgetTileModel.data.selectedRoomConstant;
    }.bind(this));
  };
  
  // Get the table headers for the selected widget tile!
  getTableHeaders() {
    this.state.metadataTableState.headerValue = undefined; // Set the initial value
    if(this.widgetTileModel.data.userStatusMap !== undefined && !this.roomConstant){
      this._getRoomConstantKey();
      this.state.metadataTableState.headerValue = this.propertyStatusTableHeader[this.roomConstant];
    } else {
      this.state.metadataTableState.headerValue = this.propertyStatusTableHeader[this.roomConstant];
    };
    return this.state.metadataTableState.headerValue;
  };
  
  // Prepare custom modal state data!
  _prepareCustomModal(options){
    // If renderCustomBodyView is true and customModalBodyViewOptions is provided, set it in customModalBodyViewOptions state.
    if(options.renderCustomBodyView && options.customBodyViewOptions){
      this.setState({customModalBodyViewOptions: options.customBodyViewOptions});
      this.state.customModal.customComponent = undefined;
    };
    if(options.renderCustomBodyView && options.customComponent){
      this.state.customModal.customComponent = options.customComponent;
      this.setState({customModalBodyViewOptions: undefined})
    }
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
    if(!this.state.metadataTableState.checkbox[0].selectedCheckboxIndex) {
      return this._renderLeftSideController();
    }
    if(this.state.metadataTableState.checkbox[0].selectedCheckboxIndex.length === 0){
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
        {this.state.facets?.isFacetsEnabled && this._renderFacetsPanel()}
        {this.templateHelpers()}
        {this.state.customModal?.show && this._renderCustomModal()}
      </>
    )
  };
};

export default TableView;