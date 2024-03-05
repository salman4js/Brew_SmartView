import lang from "../commands.constants";
import CommandsConnector from "../commands.connector";
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
      return lang.isCommandsEnabled.moveToNextState.includes(this.status.roomConstantKey) && this.status.nodes.length >= 1;
    };

    execute(){
      this._moveToNextStatus();
    };

    // Execute move to next state commands!
    _moveToNextStatus() {
        this.status.eventHelpers.triggerTableLoader(true, true);
        this.status.eventHelpers.updateCheckboxSelection();
        var moveToOperation = this.status.nodes.map((node) => {
            return CommandsConnector.moveToNextState({ lodgeId: this.status.params.accIdAndName[0], roomId: node })
                .then((result) => {
                    if (result.data.success) {
                        this.status.eventHelpers.removeFromTableCollection(result.data.data);
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