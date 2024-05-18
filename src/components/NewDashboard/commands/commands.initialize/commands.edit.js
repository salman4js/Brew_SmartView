import lang from "../commands.constants";
import TableEditActionDialog from "../../dialogs/table.edit.action/table.edit.action.dialog";
import CommonUtils from "../../common.crud.controller/common.crud.controller";

class CommandsEdit {
    constructor(signatureOptions) {
        this.status = signatureOptions;
        this.isDisabled = !this.enabled();
        this.defaults = {
            value: lang.EDIT_CONTROLLER.editController,
            disabled: this.isDisabled,
            onClick: () => this.execute(),
            signature: 'Command-Edit'
        }
    };

    enabled() {
        return (lang.isCommandsEnabled.editAction.includes(this.status.roomConstantKey) && this.status.nodes.length === 1);
    };

    onEdit(options){
        return CommonUtils.dispatchRequest(options).then((result) => {
            return result;
        }).catch((err) => {
            return err;
        });
    };

    execute(){
        // Get the model details through node id to populate the fields with current data!
        this.status.currentModel = this.status.eventHelpers.getTableCollection({nodes: this.status.nodes[0]})[0];
        this.status.eventHelpers.onEdit = (options) => this.onEdit(options);
        this.status.eventHelpers.triggerCustomModel(TableEditActionDialog.execute(this.status));
    };
}

export default CommandsEdit;