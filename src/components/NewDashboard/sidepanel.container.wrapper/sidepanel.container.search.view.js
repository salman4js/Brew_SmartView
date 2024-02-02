import React from 'react';
import _ from 'lodash';
import MetadataFields from "../../fields/metadata.fields.view";
import CollectionInstance from "../../../global.collection/widgettile.collection/widgettile.collection";
import {nodeConvertor, updateMetadataFields } from "../../common.functions/node.convertor";

class SidepanelContainerSearchView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchView: [{
                value: undefined,
                width: '300px',
                padding: '5px 5px 5px 5px',
                placeholder: 'Search Anything',
                name: 'searchString',
                attribute: 'textField',
                restrictShow: false,
                isRequired: false,
                callBackAfterUpdate: this._updateSearchStringAndFilterCollection.bind(this),
            }]
        }
    };

    // Template helpers for sidepanel search view.
    templateHelpers(){
      return <MetadataFields data = {this.state.searchView} updateData = {(updatedData) => this.setState({searchView: updatedData})} />
    };

    // When the user search for roomno, find the user id from the room model and add the customer name in the filter data.
    addGuestDetails(){
        _.forEach(this.filteredCollection, function(model){
            var userModel = CollectionInstance.whereInCollections('userCollections', undefined,'_id', model.user[0]);
            model['customerName'] =  userModel[0]?.username;
        });
    };

    // When the user search for customer name, find the room id from the user model to get the room model and
    // add only the customer name into the filter data.
    addRoomDetails(){
      var self = this;
      this.filteredRoomCol = [];
      _.forEach(this.filteredCollection, function(model){
        var roomModel = CollectionInstance.whereInCollections('roomsListCollection', undefined,'_id', model.room);
        roomModel[0]['customerName'] = model.username;
        self.filteredRoomCol.push(roomModel[0]);
      });
      this.filteredCollection = this.filteredRoomCol;
    };

    // Filter Collection based on the search string
    filterCollectionAndUpdateListView(){
        if(Number(this.search.searchString)){
            // When the search string is number, which means the user is searching with the room number.
            // In that case, find the room model and then from the room model id, find the user-model,
            // from the user-model, add only customer-name into the room model and return it,
            this.filteredCollection = _.clone(CollectionInstance.filterCollections('roomsListCollection', 'roomno',
                this.search.searchString, new RegExp(`^${this.search.searchString}\\d*`)));
            this.addGuestDetails();
        } else {
            this.filteredCollection = _.clone(CollectionInstance.filterCollections('userCollections', 'username',
                this.search.searchString, new RegExp(`^${this.search.searchString}\\d*`, 'i')));
            this.addRoomDetails();
        }
        this.props.updateFilterData(this.filteredCollection);
    };

    // Update the search string and filter the collection based on the search string.
    async _updateSearchStringAndFilterCollection(){
        this.search = nodeConvertor(this.state.searchView);
        if(this.search.searchString === '') {
            await updateMetadataFields('searchString', {value: undefined}, this.state.searchView,
                (updatedData) => this.setState({searchView: updatedData}));
            this.props.updateFilterData(undefined);
        } else {
            this.filterCollectionAndUpdateListView();
        }
    };

    render(){
        return this.templateHelpers();
    };
}

export default SidepanelContainerSearchView;