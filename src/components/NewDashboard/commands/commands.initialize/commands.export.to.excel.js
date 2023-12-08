import lang from "../commands.constants";
import CommandsConnector from "../commands.connector";
import {downloadContent} from "../../../common.functions/node.convertor";

class CommandsExportToExcel {
    constructor(signatureOptions) {
        this.status = signatureOptions;
        this.isDisabled = this.enabled();
        this.defaults = {
            value: lang.EXPORT_TO_EXCEL.exportToExcelLabel,
            disabled: this.isDisabled,
            onClick: () => this.execute()
        };
        this.exportDialogFieldOptions = [{
            value: undefined,
            placeholder: "Enter the name of the excel file",
            name: 'excelFileName',
            attribute: 'textField',
            isRequired: true,
            inlineToast: {
                isShow: false,
                inlineMessage: 'File name must be valid'
            }
        }];
        this.exportFileName = undefined;
    };

    enabled(){
      return !lang.isCommandsEnabled.bookingHistory.includes(this.status.roomConstantKey);
    };

    execute(){
      this.getColumnConfiguration();
      this._promptConfirmationDialog();
    };

    // Prompt confirmation dialog to get the name of the file to be downloaded.
    _promptConfirmationDialog(){
        this.getExportDialogOptions();
        this.status.eventHelpers.triggerCustomModel(this.dialogOptions);
    };

    // Get the export dialog options.
    getExportDialogOptions(){
        this.dialogOptions = {
            centered: true,
                restrictBody: false,
                renderCustomBodyView: true,
                customBodyViewOptions: this.exportDialogFieldOptions,
                header: lang.EXPORT_TO_EXCEL.exportToExcelLabel,
                modalSize: 'md',
                footerEnabled: true,
                footerButtons: [{
                    btnId: lang.EXPORT_TO_EXCEL.footerButtons.primaryBtn,
                    variant: 'secondary',
                    onClick: () => this.onExport()
                }]
        };
    };

    // On click on export, validate the filename and initiate the export process.
    onExport(){
        this.status.eventHelpers.validateStateFields().then((result) => {
            this.exportFileName = result.value + '.csv';
            this.initiateExport();
        });
    };

    // Initiate the export to excel process.
    initiateExport(){
        // TODO: Get the filename from the user.
        var params = {
            lodgeId: this.status.params.accIdAndName[0],
            fileName: this.exportFileName,
            widgetValue: this.status.roomConstantKey,
            headerValue: this.configuredColumns,
            nodes: this.status.nodes
        };
        //TODO: Show progress panel when the export operation is in progress.
        CommandsConnector.onExportToExcel(params).then((result) => {
            // REST will return the file content downloadable url.
            // Fetch the file from that downloadable url.
            result.data.filename = params.fileName;
            downloadContent(result.data);
            this.status.eventHelpers.collapseCustomModal();
        }).catch((error) => {

        });
    };

    // Get the configured customization.
    // TODO: Change this to backend dependency.
    getColumnConfiguration(){
      this.configuredColumns = lang.configuredTableHeaderAndKey[this.status.roomConstantKey];
    };

}

export default  CommandsExportToExcel;