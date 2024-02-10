import lang from "../commands.constants";
import CommandsConnector from "../commands.connector";
import {_checkForSecureConnections} from "../../../common.functions/common.functions";
import {downloadContent, prepareCSV} from "../../../common.functions/node.convertor";

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
            placeholder: lang.EXPORT_TO_EXCEL.dialogPlaceholder,
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
      // Enable export to excel only for local build since export to excel doesn't work on actual build due to hosted server restrictions!
      return !(lang.isCommandsEnabled.bookingHistory.includes(this.status.roomConstantKey));
    };

    execute(){
      this.getColumnConfiguration();
      this._promptConfirmationDialog();
    };

    isLocalServer(){
        return _checkForSecureConnections();
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
        this.status.eventHelpers.triggerTableLoader(true, true);
        this.status.eventHelpers.validateStateFields().then((result) => {
            this.exportFileName = result.excelFileName + '.csv';
            this.isLocalServer() ? this.initiateServerExport() : this.initiateClientExport();
        });
    };

    // Initiate the export to excel process on server
    initiateServerExport(){
        // TODO: Get the filename from the user.
        var params = {
            lodgeId: this.status.params.accIdAndName[0],
            fileName: this.exportFileName,
            widgetValue: this.status.roomConstantKey,
            headerValue: this.configuredColumns,
            nodes: this.status.nodes
        };
        // TODO: Show progress panel when the export operation is in progress.
        CommandsConnector.onExportToExcel(params).then((result) => {
            // REST will return the file content downloadable url.
            // Fetch the file from that downloadable url.
            result.data.filename = params.fileName;
            downloadContent(result.data);
            this._resetTable();
        }).catch((error) => {
            console.warn(error);
        });
    };

    // Initiate the export to excel process on client side
    initiateClientExport(){
        var options = {
            accId: this.status.params.accIdAndName[0],
            selectedNodes: this.status.nodes
        }
        this._prepareClientSideExportCSVHeader();
        // To initiate the export to excel data on client side, We need to fetch the history nodes data from the server.
        CommandsConnector.fetchSelectedHistoryNode(options).then((result) => {
            if(result.data.success){
                var csvData = prepareCSV({header: this.clientSideCSVHeader,
                    rows: this.status.eventHelpers.refineTableCollection(result.data.message),
                    headerRefKeys: this.clientSideCSVHeaderRefKeys});
                var blob = new Blob([csvData], {type: 'text/csv'});
                downloadContent({content: blob, fileName: this.exportFileName});
            }
            this._resetTable();
        });
    };

    _resetTable(){
        this.status.eventHelpers.collapseCustomModal();
        this.status.eventHelpers.updateCheckboxSelection(false)
        this.status.eventHelpers.triggerTableLoader(false);
    };

    _prepareClientSideExportCSVHeader(){
      this.clientSideCSVHeader = []; this.clientSideCSVHeaderRefKeys = [];
      this.configuredColumns.map((col) => {
          this.clientSideCSVHeader.push(col.title);
          this.clientSideCSVHeaderRefKeys.push(col.id);
      });
    };

    // Get the configured customization.
    // TODO: Change this to backend dependency.
    getColumnConfiguration(){
      this.configuredColumns = lang.configuredTableHeaderAndKey[this.status.roomConstantKey];
    };

}

export default  CommandsExportToExcel;