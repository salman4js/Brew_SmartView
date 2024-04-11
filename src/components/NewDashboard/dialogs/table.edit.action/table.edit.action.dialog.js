import lang from "../dialog.constants";
import CommandsLang from '../../commands/commands.constants';
import dialogEditOptions from "./table.edit.action.settings.dialog.options";

class TableEditActionDialog {
    constructor(signatureOptions) {
        this.status = signatureOptions;
    };

    enabled(constantKey){
        return lang.TABLE_EDIT.tableEditModeAllowedKeys.includes(constantKey);
    };

    getDialogHeaderOptions(){
        return lang.HEADER_OPTIONS[this.status.roomConstantKey];
    };

    getCustomBodyViewOptions(){
        if(dialogEditOptions[this.status.roomConstantKey]){
            return dialogEditOptions[this.status.roomConstantKey](this.status.currentModel);
        }
    };

    async onEdit(){
      var options = {};
      this.status.eventHelpers.validateStateFields().then((result) => {
          if(result){
              if(lang.widgetObjectId[this.status.roomConstantKey]){
                  result[lang.widgetObjectId[this.status.roomConstantKey]] = this.status.nodes[0];
              }
              options['accId'] = this.status.params.accIdAndName[0];
              options['selectedNodes'] = this.status.nodes[0];
              options['widgetName'] = this.status.roomConstantKey;
              options['data'] = result;
              this.status.eventHelpers.triggerTableLoader(true, true);
              this.status.eventHelpers.collapseCustomModal();
              this.status.eventHelpers.updateCheckboxSelection();
              this.status.eventHelpers.onEdit(options).then((response) => {
                  if(response.data.statusCode === 200 && response.data.success){
                      this.status.eventHelpers.updateModelFromTableCollection(response.data.result);
                      this.status.eventHelpers.triggerTableLoader(false);
                      this.status.eventHelpers.triggerCustomModel({header: CommandsLang.EDIT_CONTROLLER[this.status.roomConstantKey].successMessage, centered: false});
                  } else {
                      this.status.eventHelpers.triggerTableLoader(false);
                      this.status.eventHelpers.triggerCustomModel({header: response.data.message, centered: false});
                  }
              }).catch((err) => {
                 console.warn(err);
                 this.status.eventHelpers.triggerTableLoader(false);
                  this.status.eventHelpers.triggerCustomModel({header: CommandsLang.EDIT_CONTROLLER.editControllerError, centered: false});
              });
          }
      })
    };

    getDialogOptions(){
        return {
            header: lang.TABLE_EDIT.tableEditLabel({headerValue: this.getDialogHeaderOptions()}),
            restrictBody: false,
            renderCustomBodyView: true,
            customBodyViewOptions: this.getCustomBodyViewOptions(),
            footerEnabled: true,
            footerButtons: [
                {
                    btnId: lang.TABLE_EDIT.footerButtons.primaryBtn,
                    variant: "success",
                    onClick: () => this.onEdit()
                }
            ]
        };
    };

    static execute(signatureOptions){
        const instance = new TableEditActionDialog(signatureOptions);
        if(instance.enabled(instance.status.roomConstantKey)){
            return instance.getDialogOptions();
        } else {
            throw new Error('Table Edit mode is not enabled for the current provided constant key!');
        }
    };
}

export default TableEditActionDialog