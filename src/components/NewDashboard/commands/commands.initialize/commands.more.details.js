import lang from "../commands.constants";
import CommandsConnector from "../commands.connector";
import {templateHelpers} from "../../property.container/checkout.view/checkout.form.template";
import {getParsedUrl} from "../../../common.functions/node.convertor";
import {getStorage} from "../../../../Controller/Storage/Storage";

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
      this.defaultMoreDetailsTemplate = false;
    };

    enabled(){
        return !lang.isCommandsEnabled.moreDetails.includes(this.status.roomConstantKey);
    };

    execute(){
      this.status.eventHelpers.triggerTableLoader(true, true);
      this.selectedNodeData = lang.MORE_DETAILS.replacementsForEmptyData; // This is to handle replacements in the content for the empty data.
      // Selected node id will be passed here, we have to fetch the data for the selected node id.
      this.fetchHistoryDataForSelectedNodes().then(() => {
          this.fetchCustomHtmlContent().then((result) => {
              this._prepareDashboardControllerOptions(result); // Custom template for a widget template would be always one.
              this.status.eventHelpers.triggerTableLoader(false);
              // This preview perspective doesn't have a dedicated perspective, so we have to add the currentRouterOptions to the stateRouter in commands.
              this._notifyStateRouter();
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
               Object.assign(this.selectedNodeData, result.data.message[0]);
           }
        }).catch(() => {
           console.warn('Failed to fetch data for selected nodes!');
        });
    };

    // Check if custom history preview is configured or not.
    isCustomTemplateConfigured(){
      return JSON.parse(getStorage('customHtmlForHistoryPreview'));
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
        if(this.isCustomTemplateConfigured()){
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
        } else {
            // Rollback to the default history view which is checkout.view.template.
            // This function should return a promise. In the above condition, we have .then functions.
            return new Promise((resolve) => {
                this.defaultMoreDetailsTemplate = true;
                resolve(null);
            })
        }
    };

    // Since the preview doesn't really have a dedicated perspective of its own, We need to update the stateRouter model from the command model.
    _notifyStateRouter(){
        var opts = {
            routerOptions: {
                currentRouter: lang.MORE_DETAILS.currentRouter,
                currentTableMode: this.status.selectedRoomConstant,
                currentDashboardMode: lang.MORE_DETAILS.dashboardMode,
                action: 'ADD'
            }
        };
        this.status.eventHelpers.routerController()._notifyStateRouter(opts);
    };

    // Populate replacements object based on the rollBackTemplateView view format.
    populateReplacements(replacements){
        replacements['currentCheckoutDate'] = replacements.dateofcheckout;
        replacements['currentTime'] = replacements.checkoutTime;
        replacements['extraBedCount'] = replacements.extraBeds;
        replacements['stayeddays'] = replacements.stayedDays;
        replacements['roomPrice'] = replacements.bill;
        replacements['roomPricePerStays'] = replacements.totalAmount;
        replacements['gstPrice'] = replacements.stayGst;
        replacements['advanceAmount'] = replacements.advance;
        replacements['discountAmount'] = replacements.discount;
        replacements['withoutGST'] = replacements.bill;
        replacements['totalPrice'] = replacements.totalAmount;
        return replacements;
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
      if(this.defaultMoreDetailsTemplate){
          // Populate replacements object to blend in with checkout.view.template.
          this.dashboardController.replacements['isNegativeValue'] = Number(this.selectedNodeData.totalAmount) <= 0;
          this.dashboardController.replacements = this.populateReplacements(this.dashboardController.replacements);
          this.dashboardController.customHtmlContent['rollBackTemplateView'] =  templateHelpers({}, {}, this.dashboardController.replacements);
      }
    };
};

export default CommandsMoreDetails;