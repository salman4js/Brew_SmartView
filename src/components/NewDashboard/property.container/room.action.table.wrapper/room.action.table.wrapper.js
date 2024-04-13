import _ from "lodash";
import TableView from "../table.view/table.view";
import createRoomActionTableConstants from "./room.action.table.constants";
import {_updateRoomListCollection} from "../../dashboard.utils.helper/form.utils.helper";
import CollectionInstance from "../../../../global.collection/widgettile.collection/widgettile.collection";

class RoomActionTableWrapper extends TableView{
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
                        enableHeaderCheckbox: true,
                        selectedCheckboxIndex: []
                    }
                ]
            }
        }
    };

    async setExpandedTableView(){
        this.roomConstant = createRoomActionTableConstants.tableInfoMessage.PROPERTY_STATUS_KEY;
        !this.isSelectedModelUpdatedInUrl && this._updateSelectedModelInUrl();
        this._prepareTableHeaderState();
        this._prepareTableCellState();
        return this.collection;
    };

    addIntoTableCollection(locallyCreatedModel){
        if(locallyCreatedModel){
            const isCreatedModelAlreadyExists = _.filter(this.collection, (model) => {
                return model._id === locallyCreatedModel._id;
            });
            if(isCreatedModelAlreadyExists.length === 0){
                this.collection.push(locallyCreatedModel);
                locallyCreatedModel['roomId'] = locallyCreatedModel._id;
                _updateRoomListCollection(locallyCreatedModel, 'ADD');
            }
        }
    };

    updateModelFromTableCollection(updatedModel) {
        if(updatedModel){
            var indexToUpdate = _.findIndex(this.collection, (model) => {
                return model._id === updatedModel._id;
            });
            if(indexToUpdate !== -1){
                _.assign(this.collection[indexToUpdate], updatedModel);
                updatedModel['roomId'] = updatedModel._id;
                _updateRoomListCollection(updatedModel, 'EDIT');
            }
        }
    };

    removeFromTableCollection(selectedNodes) {
        if(selectedNodes){
            _.remove(this.collection, (model) => {
                return selectedNodes.includes(model._id);
            });
            this.props.dashboardController({reloadSidepanel: {silent: true, mode: 'roomTypeListPanel', action: 'REMOVE', modelIds: selectedNodes}});
        }
    };

    _updateSelectedModelInUrl(){
      this.props.dashboardController({queryParams: [{key: 'widgetObjectId', value: this._getSelectedModel()._id}]});
      this.isSelectedModelUpdatedInUrl = true;
    };

    _prepareTableHeaderState(){
      this.state.metadataTableState.headerValue = this.propertyStatusTableHeader[createRoomActionTableConstants.tableInfoMessage.PROPERTY_STATUS_KEY];
    };

    _getSelectedModel(){
        if(this.state.adminAction){
            return CollectionInstance.whereInCollections('roomTypes', undefined, '_id', this.state.adminAction.roomTypeModelId)[0];
        } else {
            return CollectionInstance.getCollections('roomTypes').data[0];
        }
    };

    prepareTemplateHelpersData(){
        super.prepareTemplateHelpersData();
        const selectedModel = this._getSelectedModel();
        this.templateHelpersData.options['selectedModel'] = selectedModel;
        this.templateHelpersData.options.selectedRoomConstant = selectedModel.suiteType;
    };

    _prepareTableCellState(){
        // Get the roomType from the collection by roomTypeModelId.
        var selectedModel = this._getSelectedModel();
        this.collection = CollectionInstance.whereInCollections('roomsListCollection', undefined, 'suiteName', selectedModel.suiteType);
    };

    componentDidUpdate(){
        if(this.state.adminAction !== this.props.data.adminAction){
          this._updateComponentState({key: 'adminAction', value: this.props.data.adminAction}, () => {
              this._toggleTableLoader(true, false);
              this.isSelectedModelUpdatedInUrl = false;
          });
        }
    };
}

export default RoomActionTableWrapper;