import React from 'react';
import {activityLoader} from "../../common.functions/common.functions.view";
import PanelItemView from "../../SidePanelView/panel.item/panel.item.view";
import CollectionInstance from "../../../global.collection/widgettile.collection/widgettile.collection";

class SidepanelContainerRoomListView extends React.Component {
    constructor(props) {
        super(props);
        this.options = this.props.options;
        this.state = {
            selectedItem: []
        }
    };

    _updateComponentState(options){
      this.setState({[options.key]: options.value});
    };

    getSelectedItem(){
        return this.state.selectedItem.length > 0 ? this.state.selectedItem : ([this.props.options.adminAction?.roomTypeModelId || this.collection[0]._id]);
    };

    _getRoomListCollection(){
        this.collection = CollectionInstance.getCollections('roomTypes').data;
    };

    onSelectType(id){
        this.state.selectedItem.push(id);
        this._updateComponentState({key: 'selectedItem', value: this.state.selectedItem});
        this.options.dashboardController({isAdminActionRoomTypeModelSelectionUpdated: true, adminAction: {roomTypeModelId: this.state.selectedItem[this.state.selectedItem.length - 1]}})
    };

    _renderRoomListView(){
        return this.collection.map((options) => {
            return (
                <PanelItemView data = {options.suiteType} _id = {options._id}
                onClick = {(id) => this.onSelectType(id)} selectedItem = {this.getSelectedItem()}/>
            )
        });
    };

    templateHelpers(){
        this._getRoomListCollection();
        return this._renderRoomListView();
    };

    render(){
      return(
          <>
              {this.templateHelpers()}
          </>
      )
    };
}

export default SidepanelContainerRoomListView;