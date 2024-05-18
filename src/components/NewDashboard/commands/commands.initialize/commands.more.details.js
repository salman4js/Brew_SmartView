import lang from "../commands.constants";
import _ from 'lodash';
import CommandsConnector from "../commands.connector";
import {templateHelpers} from '../../property.container/checkout.view/checkout.form.template';
import {getStorage} from '../../../../Controller/Storage/Storage'
import CollectionInstance from "../../../../global.collection/widgettile.collection/widgettile.collection";

class CommandsMoreDetails {
    constructor(signatureOptions){
      this.status = signatureOptions;
      this.isDisabled = !this.enabled();
      this.defaults = {
          value: lang.MORE_DETAILS.moreDetails,
          disabled: this.isDisabled,
          onClick: () => this.execute(),
          signature: 'Command-More-Details'
      };
      this.customHtmlContentFileName = this.status.params.accIdAndName[1] + '-' + this.status.roomConstantKey + '.html';
      this.defaultMoreDetailsTemplate = false;
    };

    enabled(){
        return lang.isCommandsEnabled.moreDetails.includes(this.status.roomConstantKey) && this.status.nodes.length === 1;
    };

    execute(){
      this.status.eventHelpers.triggerTableLoader(true, true);
      this.selectedNodeData = _.clone(lang.MORE_DETAILS.replacementsForEmptyData); // This is to handle replacements in the content for the empty data.
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
            selectedNodes: this.status.nodes
        }
        return CommandsConnector.fetchSelectedHistoryNode(options).then((result) => {
           if(result.data.success){
               this.historyNode = result.data.message[0];
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
            return CommandsConnector.fetchCustomHTMLConfiguredTemplate(options).then((result) => {
                return result;
            });
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

    // When previewing history template, Room price of the room should be there but REST doesn't return room details with user details.
    // They only return roomId with the user details.
    // So, we have to get the room price from the collection instance based on the room id.
    _getRoomPrice(){
        return CollectionInstance.whereInCollections('roomsListCollection', undefined, '_id',  this.selectedNodeData.room)[0].price + ' Rs';
    };

    // Populate replacements object based on the rollBackTemplateView view format.
    populateReplacements(replacements){
        replacements['currentCheckoutDate'] = replacements.dateofcheckout;
        replacements['currentTime'] = replacements.checkoutTime;
        replacements['extraBedCount'] = replacements.extraBeds;
        replacements['extraBedCollection'] = replacements.extraBedPrice;
        replacements['stayeddays'] = replacements.stayedDays;
        replacements['roomPrice'] = this._getRoomPrice();
        replacements['roomPricePerStays'] = replacements.totalAmount;
        replacements['gstPrice'] = this.historyNode.stayGst ? replacements.stayGst + ' Rs' : replacements.stayGst;
        replacements['advanceAmount'] = this.historyNode.advance ? replacements.advance + ' Rs': replacements.advance;
        replacements['discountAmount'] = this.historyNode.discount ? replacements.discount + ' Rs': replacements.discount;
        replacements['withoutGST'] = this.historyNode.bill ? replacements.bill + ' Rs': replacements.bill;
        replacements['totalPrice'] = replacements.totalAmount === "" ?  lang.MORE_DETAILS.replacementsForEmptyData.totalAmount : Number(replacements.totalAmount) + ' Rs';
        replacements['totalPriceWithoutRoomTransfer'] = replacements.totalAmount === "" ?  lang.MORE_DETAILS.replacementsForEmptyData.totalAmount : Number(replacements.totalAmount) + ' Rs';
        replacements['isNegativeValue'] = Number(this.selectedNodeData.totalAmount) < 0; // Populate replacements object to blend in with checkout.view.template.
        replacements.currentCheckoutDate = replacements.dateofcheckout === "" ? lang.MORE_DETAILS.replacementsForEmptyData.dateofcheckout : replacements.dateofcheckout;
        replacements.checkoutTime = replacements.checkoutTime === "" ? lang.MORE_DETAILS.replacementsForEmptyData.checkoutTime : replacements.checkoutTime;
        replacements.roomPricePerStays = replacements.roomPricePerStays === "" ? lang.MORE_DETAILS.replacementsForEmptyData.roomPricePerStays : replacements.roomPricePerStays + ' Rs';
        delete replacements.stayedDays; // Stayed days is already there in the replacements object, removing the duplicate key to avoid errors!
        delete replacements.bill;
        delete replacements.stayGst;
        delete replacements.totalAmount;
        delete replacements.dateofcheckout;
        delete replacements.checkoutTime;
        delete replacements.extraBeds;
        delete replacements.extraBedPrice;
        delete replacements.advance;
        delete replacements.discount;
        delete replacements._id;
        return replacements;
    };

    _getConfigOptions(){
      return{
          isAdvanceRestricted: JSON.parse(getStorage('isAdvanceRestricted')),
          isExtraCalc: JSON.parse(getStorage('extraCalc'))
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
          replacements: _.clone(this.selectedNodeData)
      }
      this.dashboardController.replacements['isCheckedOut'] = this.selectedNodeData.totalAmount !== "";
      this.dashboardController.replacements = this.populateReplacements(this.dashboardController.replacements);
      if(this.defaultMoreDetailsTemplate){
          this.dashboardController.customHtmlContent['rollBackTemplateView'] =  templateHelpers({}, this._getConfigOptions(), this.dashboardController.replacements);
      }
    };
};

export default CommandsMoreDetails;