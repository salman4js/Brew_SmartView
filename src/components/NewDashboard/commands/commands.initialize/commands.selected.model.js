import lang from "../commands.constants";
import MetadataTable from "../../../metadata.table.view/metadata.table.view";
import tableViewConstants from '../../property.container/table.view/table.view.constants'
import _ from "lodash";

class CommandsSelectedModel {
    constructor(signatureOptions) {
        this.status = signatureOptions;
        this.isDisabled = this.enabled();
        this.defaults = {
            icon: () => this.getSelectedModelsTemplate(),
            disabled: !this.isDisabled,
            onClick: () => this.execute(),
            signature: 'Command-SelectedModel'
        };
        this.statusNodes = _.clone(this.status.nodes);
        this.tableState = {
            cellValues: undefined,
            headerValue: undefined,
            infoMessage: tableViewConstants.tableInfoMessage.ZERO_STATE_MESSAGE,
            tableLoader: false,
            selectedRoomId: undefined,
            isCheckboxSelected: false,
            enableCheckbox: true,
            tableCellWidth : "590px",
            showPanelField: false,
            checkbox: [
                {
                    select: (value, checkBoxIndex) => this._onUpdateCheckboxSelection(value, checkBoxIndex),
                    value: false,
                    attribute: "checkBoxField",
                    enableCellCheckbox: true,
                    enableHeaderCheckbox: true,
                    selectedCheckboxIndex: this.statusNodes
                }
            ],
        }
        this.currentSelectedNodesCount = this.status?.nodes?.length || 0;
    };

    getSelectedModelsTemplate(){
        return (
            <span className = 'commands-selected-model-container'>
              Selected <span className = 'commands-selected-model-container-count'>{this.currentSelectedNodesCount}</span>
          </span>
        )
    };

    enabled(){
      return lang.isCommandsEnabled.selectedModel.includes(this.status.roomConstantKey) && this.status.nodes.length >= 1;
    };

    execute(){
        // First get the selected nodes table data from the table.view.
        this.tableState.cellValues = this.status.eventHelpers.getTableCollection({nodes: this.status.nodes});
        // Get Table Headers for the current table mode.
        this.tableState.headerValue = this.status.eventHelpers.getTableHeaders();
        this._prepareDialogOptions();
        this.status.eventHelpers.triggerCustomModel(this.dialogOptions);
    };

    _onUpdateCheckboxSelection(value, checkBoxIndex){
        if(!value){
            _.remove(this.statusNodes, (selectedNode) => {
                return selectedNode === checkBoxIndex;
            });
        } else {
            this.statusNodes.push(checkBoxIndex);
        }
        this.currentSelectedNodesCount = this.statusNodes.length;
    };

    onChangesApply(){
        this.status.eventHelpers.restoreOrUpdateCheckboxSelection({checkboxSelection: this.statusNodes});
        this.status.eventHelpers.collapseCustomModal();
    };

    _prepareCustomModalBodyView(){
        return(
            <div style = {{maxHeight: window.innerHeight - 300 + 'px', overflowX: 'auto'}}>
                <MetadataTable data = {this.tableState} />
            </div>
        )
    };

    _getFooterButtons(){
        if(this.status['selectedModelFooterButtons']){
            return this.status['selectedModelFooterButtons'];
        } else {
            return [{
                btnId: lang.SELECTED_MODELS.footerButtons.primaryBtn,
                variant: 'primary',
                onClick: () => this.onChangesApply()
            }]
        }
    };

    _prepareDialogOptions(){
        this.dialogOptions = {
            centered: true,
            restrictBody: false,
            renderCustomBodyView: true,
            customComponent: this._prepareCustomModalBodyView(),
            header: this.status['selectedModelHeader'] || lang.SELECTED_MODELS.selectedModelsLabel,
            modalSize: 'xl',
            footerEnabled: true,
            footerButtons: this._getFooterButtons()
        };
    };
}

export default CommandsSelectedModel;