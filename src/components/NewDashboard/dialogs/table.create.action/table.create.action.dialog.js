import lang from '../dialog.constants'
import dialogCreateOptions from "./table.create.action.settings.dialog.options";
import CommandsLang from "../../commands/commands.constants";

class TableCreateActionDialog {
    constructor(signatureOptions) {
        this.status = signatureOptions;
    };

    enabled(constantKey){
        return lang.TABLE_CREATE.tableCreateModeAllowedKeys.includes(constantKey);
    };

    async onCreate(){
        var options = {};
        this.status.eventHelpers.validateStateFields().then((result) => {
            if(result){
                options['accInfo'] = this.status.params.accIdAndName;
                options['data'] = result;
                options['widgetName'] = this.status.roomConstantKey;
                options['method'] = 'post';
                this.status.eventHelpers.extraParams && this.status.eventHelpers.extraParams(options);
                this.status.eventHelpers.triggerTableLoader(true, true);
                this.status.eventHelpers.collapseCustomModal();
                dialogCreateOptions.onSave(options).then((response) => {
                    if((response.data.statusCode === 201 || response.data.statusCode === 200) && response.data.success){
                        this.status.eventHelpers.addIntoTableCollection(response.data.result);
                        this.status.eventHelpers.triggerTableLoader(false);
                        this.status.eventHelpers.triggerCustomModel({header: CommandsLang.CREATE_CONTROLLER[this.status.roomConstantKey].successMessage, centered: false});
                    } else {
                        this.status.eventHelpers.triggerTableLoader(false);
                        this.status.eventHelpers.triggerCustomModel({header: response.data.message, centered: false});
                    }
                }).catch((err) => {
                    console.warn(err);
                    this.status.eventHelpers.triggerCustomModel({header: CommandsLang.CREATE_CONTROLLER.createControllerError, centered: false});
                    this.status.eventHelpers.triggerTableLoader(false);
                });
            }
        });
    };

    getDialogHeaderOptions(){
        return lang.HEADER_OPTIONS[this.status.roomConstantKey];
    };

    getCustomBodyViewOptions(){
        if(!lang.TABLE_CREATE.customComponentKeys.includes(this.status.roomConstantKey)){
            return dialogCreateOptions[this.status.roomConstantKey](this.status.selectedModel);
        }
    };

    getCustomBodyComponent(){
        if(lang.TABLE_CREATE.customComponentKeys.includes(this.status.roomConstantKey)){
            return dialogCreateOptions[this.status.roomConstantKey](this.status);
        }
    };

    getDialogOptions(){
        return {
            header: lang.TABLE_CREATE.tableCreateLabel({headerValue: this.getDialogHeaderOptions()}),
            restrictBody: false,
            renderCustomBodyView: true,
            modalSize: this.status.modalSize || 'md',
            customBodyViewOptions: this.getCustomBodyViewOptions(),
            customComponent: this.getCustomBodyComponent(),
            footerEnabled: true,
            footerButtons: [
                {
                    btnId: lang.TABLE_CREATE.footerButtons.primaryBtn,
                    variant: "success",
                    onClick: () => this.onCreate()
                }
            ]
        };
    };

    static execute(signatureOptions) {
      const instance = new TableCreateActionDialog(signatureOptions);
      if(instance.enabled(instance.status.roomConstantKey)){
          return instance.getDialogOptions();
      } else {
          throw new Error('Table Create mode is not enabled for the current provided constant!');
      }
    };
}

export default TableCreateActionDialog;