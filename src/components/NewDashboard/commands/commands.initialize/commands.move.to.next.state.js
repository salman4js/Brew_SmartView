import lang from "../commands.constants";
import CommandsConnector from "../commands.connector";
import _ from "lodash";
class CommandsMoveToNextState {
    constructor(signatureOptions) {
        this.status = signatureOptions ;
        this.isDisabled = !this.enabled();
        this.defaults = {
            value: lang.MOVE_TO_NEXT_STATE.moveToNextState,
            disabled: this.isDisabled,
            onClick: () => this.execute()
        };
    };

    enabled(){
      return lang.isCommandsEnabled.moveToNextState.includes(this.status.roomConstantKey);
    };

    execute(){
        this.selectedNodes = _.clone(this.status.nodes);
        this._moveToNextStatus();
    };

    _getAllTableCollectionNodes(){
        var tableCollection = this.status.eventHelpers.getTableCollection();
        tableCollection.map((tableModel) => {
           this.selectedNodes.push(tableModel._id);
        });
    };

    // Execute move to next state commands!
    _moveToNextStatus() {
        this.status.eventHelpers.triggerTableLoader(true, true);
        this.status.eventHelpers.updateCheckboxSelection();
        if(this.status.nodes.length === 0){
            this._getAllTableCollectionNodes();
        }
        var moveToOperation = this.selectedNodes.map((node) => {
            return CommandsConnector.moveToNextState({ lodgeId: this.status.params.accIdAndName[0], roomId: node })
                .then((result) => {
                    if (result.data.success) {
                        this.status.eventHelpers.removeFromTableCollection(node);
                        this.status.eventHelpers.dashboardController({
                            reloadSidepanel: { silent: true },
                            updatedModel: result.data.data
                        });
                    }
                })
                .catch((error) => {
                    console.error("API call failed for move to operation:", error);
                    // Handle API failure.
                });
        });

        // Wait for all API calls to complete before triggering table loader off
        Promise.all(moveToOperation)
            .finally(() => {
                this.status.eventHelpers.triggerTableLoader(true, false);
            });
    };
}

export default CommandsMoveToNextState;