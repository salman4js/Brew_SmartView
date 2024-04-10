import TableView from "../table.view/table.view";
import createRoomActionTableConstants from "./create.room.action.table.constants";
import CollectionInstance from "../../../../global.collection/widgettile.collection/widgettile.collection";

class CreateRoomActionTableWrapper extends TableView{
    constructor(props) {
        super(props);
        this.state = {
            adminAction: undefined,
            customModal: {
                onHide: () => this.onCloseCustomModal()
            },
            metadataTableState: {
                cellValues: undefined,
                headerValue: undefined,
                infoMessage: createRoomActionTableConstants.tableInfoMessage.ZERO_FILTER_MESSAGE,
                tableLoader: true,
                keepLoader: false,
                selectedRoomId: undefined,
                isCheckboxSelected: false,
                checkboxSelection: [],
                enableCheckbox: true,
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
                ]
            }
        }
    };

    async setExpandedTableView(){
        this.roomConstant = createRoomActionTableConstants.tableInfoMessage.PROPERTY_STATUS_KEY;
        this._prepareTableHeaderState();
        return this._prepareTableCellState();
    };

    _prepareTableHeaderState(){
      this.state.metadataTableState.headerValue = this.propertyStatusTableHeader[createRoomActionTableConstants.tableInfoMessage.PROPERTY_STATUS_KEY];
    };

    _prepareTableCellState(){
        // Get the roomType from the collection by roomTypeModelId.
        var searchValue;
        if(this.state.adminAction){
            searchValue = CollectionInstance.whereInCollections('roomTypes', undefined, '_id', this.state.adminAction.roomTypeModelId);
            return CollectionInstance.whereInCollections('roomsListCollection', undefined, 'suiteName', searchValue[0].suiteType);
        } else {
            // Get the first room type from the roomTypes collection and render the table data for that type!
            searchValue = CollectionInstance.getCollections('roomTypes').data;
            return CollectionInstance.whereInCollections('roomsListCollection', undefined, 'suiteName', searchValue[0].suiteType);
        }
    };

    componentDidUpdate(){
        if(this.state.adminAction !== this.props.data.adminAction){
          this._updateComponentState({key: 'adminAction', value: this.props.data.adminAction}, () => this._toggleTableLoader(true, false));
        }
    };
}

export default CreateRoomActionTableWrapper;