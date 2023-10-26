import React from 'react';
import _ from 'lodash';
import TableView from '../table.view/table.view';
import CollectionInstance from '../../../../global.collection/widgettile.collection/widgettile.collection';

class FilterTable extends TableView {
  
  constructor(props){
    super(props);
    this.filteredModel = {};
    this.state = {
      data: props.data
    };
  };
  
  // Filter room collection based on the room status constant!
  filterRoomCollection(){
    this.filteredModel = {}; // Reinitialize this filteredModel here to prevent duplicate data!
    // TableView accepts data in array of objects form!
    var roomConstant = this.props.data.selectedRoomConstant,
      roomCollections = CollectionInstance.getCollections('roomsListCollection'),
      self = this;
    if(this.filteredModel[this.props.data.selectedRoomConstant] === undefined){
      this.filteredModel[this.props.data.selectedRoomConstant] = [];
    };
    _.find(roomCollections.data, function(obj){
      if(obj.roomStatusConstant === self.props.data.selectedRoomConstant){
        self.filteredModel[self.props.data.selectedRoomConstant].push(obj);
      };
    });
    this.state.data.filteredData && this._applyFilter();
  };
  
  // Apply user selected filter data!
  _applyFilter(){
    var filterData = this.state.data.filteredData,
      self = this;
    _.remove(this.filteredModel[this.props.data.selectedRoomConstant], function(obj){ // this handle filter by room type!
        return obj.suiteName !== filterData.suiteType;
    });
  };
  
  // Table header value!
  getTableHeaderValue(){
    var userStatusMap = CollectionInstance.getCollections('userStatusMap').data;
    this.templateHelpersData.selectedRoomConstant = userStatusMap[this.props.data.selectedRoomConstant];
  };
  
  // Get the filtered data based on the filter applied by the user!
  getFilteredData(){
    this.getTableHeaderValue();
    this.roomConstant = this.props.data.selectedRoomConstant;
    this.filterRoomCollection();
  };
  
  // Update the component state with newly added value!
  _updateStateValue(updatedValue){
    this.setState({data: updatedValue});
  };
  
  componentDidUpdate(){
    if(this.state.data.filteredData !== this.props.data.filteredData){
      this._updateStateValue(this.props.data);
    };
  };
  
};

export default FilterTable;