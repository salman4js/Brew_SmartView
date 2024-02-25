import lang from "../dialog.constants";
import dialogCreateOptions from "./table.create.action.settings.dialog.options";
import {extractQueryParams} from "../../../common.functions/node.convertor";

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
                result[lang.widgetObjectId[this.status.roomConstantKey]] = extractQueryParams().widgetObjectId;
                options['lodgeId'] = this.status.params.accIdAndName[0];
                options['data'] = result;
                this.status.eventHelpers.triggerTableLoader(true, true);
                this.status.eventHelpers.collapseCustomModal();
                dialogCreateOptions.onSave[this.status.roomConstantKey](options).then((response) => {
                    if(response.data.success){
                        this.status.eventHelpers.addIntoTableCollection(response.data.data);
                        this.status.eventHelpers.triggerTableLoader(false);
                    }
                }).catch((err) => {
                    console.warn(err);
                    this.status.eventHelpers.collapseCustomModal();
                    this.status.eventHelpers.triggerTableLoader(false);
                });
            }
        });
    };

    getDialogHeaderOptions(){
        return lang.HEADER_OPTIONS[this.status.roomConstantKey];
    };

    getCustomBodyViewOptions(){
        return dialogCreateOptions[this.status.roomConstantKey]();
    };

    getDialogOptions(){
        return {
            header: lang.TABLE_CREATE.tableCreateLabel({headerValue: this.getDialogHeaderOptions()}),
            restrictBody: false,
            renderCustomBodyView: true,
            customBodyViewOptions: this.getCustomBodyViewOptions(),
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