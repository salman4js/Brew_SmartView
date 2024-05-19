import Variables from "../Variables";
import connector from "../utils/connector";
import {defaultStorage} from "../../Controller/Storage/Storage";

class AppStartupUtils {
    constructor(options) {
        this.options = options;
    };

    fetchConfig(){
      return new Promise((resolve, reject) => {
          connector.get(`${Variables.hostId}/${this.options.accId}/check-matrix`).then((res) => {
              if(res.data.success){
                  // Set isGst and isHourly basis in localstorage!
                  const data = {
                      "loggedInID": this.options.accId,
                      "gstin" : res.data.object.gstin,
                      "pan" : res.data.object.pan,
                      "owner-name" : res.data.object.name,
                      "owner-number" : res.data.object.number,
                      "lodge-name": res.data.object.lodgename,
                      "redirectTo": res.data.object.redirectTo,
                      "multipleLogin" : res.data.object.multipleLogins,
                      "isGst" : res.data.object.isGst,
                      "isHourly" : res.data.object.isHourly,
                      "isChannel": res.data.object.isChannel,
                      "updatePrice" : res.data.object.updatePrice,
                      "isExtra": res.data.object.isExtra,
                      "isExclusive": res.data.object.isExclusive,
                      "area" : res.data.object.address,
                      "emailId": res.data.object.emailId,
                      "isInsights": res.data.object.isInsights,
                      "isSpecific": res.data.object.isSpecific,
                      "canDelete": res.data.object.canDelete,
                      "extraCalc": res.data.object.extraCalc,
                      "isGrcPreview": res.data.object.grcPreview,
                      "removePan": res.data.object.removePan,
                      "printManager": res.data.object.printManager,
                      "validateInvoiceDetails": res.data.object.validateInvoiceDetails,
                      "refundPercentage": res.data.object.refundPercentage,
                      "isRefundTrackerEnabled": res.data.object.refundTracker !== undefined ? res.data.object.refundTracker : false,
                      'isAdvanceRestricted': res.data.object.restrictAdvance,
                      'isCheckinDateEditable': res.data.object.checkinDateEditable,
                      'is-linked-with-vouchers': res.data.object.linkVouchersWithLivixius,
                      'showFullDetails': res.data.object.showFullDetails,
                      'customHtmlForBillPreview': res.data.object?.customHtmlContent?.billPreview?.isEnabled || false,
                      'customHtmlForHistoryPreview': res.data.object?.customHtmlContent?.historyPreview?.isEnabled || false,
                      'customHtmlForPropertyRead': res.data.object?.customHtmlContent?.propertyReadRoom?.isEnabled || false,
                      'customTemplateForBill': res.data.object?.customHtmlContent?.billGeneration?.isEnabled || false,
                      'customTemplateForInvoice': res.data.object?.customHtmlContent?.invoiceGeneration?.isEnabled || false,
                      'isFormulaCustomizationEnabled': res.data.object?.customAdminConfig?.customCalc?.isEnabled || false,
                      'isCustomReportEnabled': res.data.object?.customAdminConfig.customReport?.isEnabled || false,
                      'config-value': res.data['actionItems'] ? JSON.stringify(res.data['actionItems']) : false
                  };
                  defaultStorage(data);
                  resolve(res.data.object);
              }
          }).catch((err) => {
              // Throw some error that the fetching config has been failed.
              reject(err);
          });
      });
    };
}

export default AppStartupUtils;