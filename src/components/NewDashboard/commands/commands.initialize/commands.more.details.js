import lang from "../commands.constants";
import CommandsConnector from "../commands.connector";
import {getBaseUrl, getParsedUrl} from "../../../common.functions/node.convertor";

class CommandsMoreDetails {
    constructor(signatureOptions){
      this.status = signatureOptions;
      this.isDisabled = this.enabled();
      this.defaults = {
          value: lang.MORE_DETAILS.moreDetails,
          disabled: this.isDisabled,
          onClick: () => this.execute()
      };
      this.customHtmlContentFileName = this.status.params.accIdAndName[1] + '-' + this.status.roomConstantKey + '.html';
    };

    enabled(){
        return !lang.isCommandsEnabled.moreDetails.includes(this.status.roomConstantKey);
    };

    execute(){
      this.status.eventHelpers.triggerTableLoader(true, true);
      // Selected node id will be passed here, we have to fetch the data for the selected node id.
      this.fetchHistoryDataForSelectedNodes().then(() => {
          this.fetchCustomHtmlContent().then((result) => {
              this._prepareDashboardControllerOptions(result); // Custom template for a widget template would be always one.
              this.status.eventHelpers.triggerTableLoader(false);
              this.status.eventHelpers.dashboardController(this.dashboardController);
          });
      });
    };

    // Fetch data for the selected history node.
    fetchHistoryDataForSelectedNodes(){
        var options = {
            accId: this.status.params.accIdAndName[0],
            selectedNodes: this.status.nodes[0] // For more details command, selected nodes is always going to be only one.
        }
        return CommandsConnector.fetchSelectedHistoryNode(options).then((result) => {
           if(result.data.success){
               this.selectedNodeData = result.data.message[0]
           }
        }).catch(() => {
           console.warn('Failed to fetch data for selected nodes!');
        });
    };

    // Fetch dynamic html content based on the signatureOption's roomConstantKey.
    // This method will fetch dynamic html content from the server based on the table mode we are currently in.
    // So that this command can be used by multiple table room constants.
    // TODO: If the preview template is not found in the server, rollback to the custom template (Show More details in custom modals).
    fetchCustomHtmlContent(){
        var options = {
            accId: this.status.params.accIdAndName[0],
            filename: this.customHtmlContentFileName,
            templateName: this.status.roomConstantKey
        };
        // Check if the server is running on local, If yes, get the html content from the local server
        // Or get the HTML content from the database.
        if(getParsedUrl().hostname !== lang.LOCAL_SERVER){
            return CommandsConnector._getCustomHTMLContentFromDB(options).then((result) => {
                return result.data.data[0].customTemplate;
            }).catch(() => {
               console.warn('Error occurred while fetching the dynamic html content');
            });
        } else {
            return CommandsConnector._getCustomHTMLContent(options).then((result) => {
                return result;
            }).catch(() => {
                console.warn('Error occurred while fetching the dynamic html content');
            });
        }
    };

    // Prepare dashboard controller options.
    _prepareDashboardControllerOptions(htmlContent){
      this.dashboardController = {
          goToCustomHtmlContent: true,
          dashboardMode: lang.MORE_DETAILS.dashboardMode,
          customHtmlContent: {
              content: htmlContent
          },
          replacements: this.selectedNodeData
      }
    };
};

export default CommandsMoreDetails;