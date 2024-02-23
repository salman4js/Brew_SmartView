import React from 'react';
import sidepanelConstants from "./sidepanel.container.constants";
import CollectionView from "../../SidePanelView/collection.view/collection.view";
import CollectionInstance from "../../../global.collection/widgettile.collection/widgettile.collection";
import PanelItemView from "../../SidePanelView/panel.item/panel.item.view";

class SidepanelContainerVoucherTrackerView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    };

    voucherTrackerParentStruct(){
        let voucherListPanelCollectionView = Object.keys(sidepanelConstants.voucherListParentCollection);
        return voucherListPanelCollectionView.map((voucherCollection) => {
            return(
                <CollectionView data = {sidepanelConstants.voucherListParentCollection[voucherCollection].value} showCollectionChildView = {() => this._renderPanelItemViewVoucherCollection(voucherCollection)}/>
            )
        });
    };

    _renderPanelItemViewVoucherCollection(voucherCollection){
        if(sidepanelConstants.voucherListParentCollection[voucherCollection].data === sidepanelConstants.SIDE_PANEL_MODES.voucherList){
            // Get the vouchers model from the collection instance!
            var vouchersModel = CollectionInstance.getModel('widgetTileCollections', 'voucherModelList');
            return vouchersModel.map((options) => {
                return(
                    <PanelItemView data = {options.voucherName} showIndentationArrow = {true}/>
                )
            })
        } else {
            return this.props.options.roomTreeView();
        }
    };

    templateHelpers(){
      return this.voucherTrackerParentStruct();
    };

    render(){
        return this.templateHelpers();
    };
}

export default SidepanelContainerVoucherTrackerView;