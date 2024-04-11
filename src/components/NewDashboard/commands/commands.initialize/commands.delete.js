import lang from "../commands.constants";
import CommonCrudController from "../../common.crud.controller/common.crud.controller";

class CommandsDelete {
    constructor(signatureOptions) {
        this.status = signatureOptions;
        this.isDisabled = this.enabled();
        this.defaults = {
            value: lang.DELETE_CONTROLLER.deleteController,
            disabled: !this.isDisabled,
            onClick: () => this.execute()
        }
    };

    enabled(){
        return lang.isCommandsEnabled.deleteAction.includes(this.status.roomConstantKey) && this.status.nodes.length >= 1;
    };

    execute(){
      this.status.eventHelpers.triggerCommandExecution();
      this.status.eventHelpers.triggerTableLoader(true, true);
      this.status.eventHelpers.updateCheckboxSelection(); // This will empty the checkboxSelection so when loader comes, commands will be disabled.
      this._initiateDeleteAction().then((result) => {
          this.status.eventHelpers.triggerTableLoader(false);
          if(result.status === 204){
              this.status.eventHelpers.removeFromTableCollection(this.status.nodes);
              this.status.eventHelpers.triggerCustomModel({header: lang.DELETE_CONTROLLER[this.status.roomConstantKey].successMessage, centered: false});
          } else {
              this.status.eventHelpers.triggerCustomModel({header: result.data.message, centered: false});
          }
      }).catch(() => {
          this.status.eventHelpers.triggerTableLoader(false);
          this.status.eventHelpers.triggerCustomModel({header: lang.DELETE_CONTROLLER.deleteControllerError, centered: false});
      });
    };

    _initiateDeleteAction(){
      return new Promise((resolve, reject) => {
          CommonCrudController.DeleteController({widgetName: this.status.roomConstantKey,
             selectedNodes: this.status.nodes, accId: this.status.params.accIdAndName[0]})
         .then((result) => {
             resolve(result);
         }).catch((err) => {
             reject(err);
             // Let the user know that the operation has been failed for some reason.
         });
      });
    };
}

export default CommandsDelete;