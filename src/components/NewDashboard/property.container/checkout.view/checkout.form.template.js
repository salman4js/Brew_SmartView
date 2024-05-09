import {renderCustomHTMLContent} from "../../../common.functions/node.convertor";
import checkoutViewConstants from "./checkout.form.constants";
import MetadataFieldsView from "../../../fields/metadata.fields.view";

// Populate replacements objects!
function populateReplacementObject(state, templateHelperLabel, configOptions){
  // Define replacements
  return {
    'username': {
      value: state?.userModel?.username,
      label: templateHelperLabel.TEMPLATE_LABEL_CUSTOMER_DETAILS.customerNameLabel,
      attribute: 'labelField',
      restrictShow: false,
      template: 'customerTemplate'
    },
    'phonenumber': {
      value: state?.userModel?.phonenumber,
      label: templateHelperLabel.TEMPLATE_LABEL_CUSTOMER_DETAILS.customerPhoneNumberLabel,
      attribute: 'labelField',
      restrictShow: false,
      template: 'customerTemplate'
    },
    'aadharcard': {
      value: state?.userModel?.aadharcard,
      label: templateHelperLabel.TEMPLATE_LABEL_CUSTOMER_DETAILS.customerIdNumber,
      attribute: 'labelField',
      restrictShow: false,
      template: 'customerTemplate'
    },
    'address': {
      value: state?.userModel?.address,
      label: templateHelperLabel.TEMPLATE_LABEL_CUSTOMER_DETAILS.customerAddress,
      attribute: 'labelField',
      restrictShow: false,
      template: 'customerTemplate'
    },
    'adults': {
      value: state?.userModel?.adults,
      label: templateHelperLabel.TEMPLATE_LABEL_CUSTOMER_DETAILS.adultsHeadCount,
      attribute: 'labelField',
      restrictShow: false,
      template: 'customerTemplate'
    },
    'childrens': {
      value: state?.userModel?.childrens,
      label: templateHelperLabel.TEMPLATE_LABEL_CUSTOMER_DETAILS.childrensHeadCount,
      attribute: 'labelField',
      restrictShow: false,
      template: 'customerTemplate'
    },
    'dateofcheckin': {
      value: state?.userModel?.dateofcheckin,
      label: templateHelperLabel.TEMPLATE_LABEL_STAYED_DETAILS.dateOfCheckinHeader,
      attribute: 'labelField',
      restrictShow: false,
      template: 'stayedDetailsTemplate'
    },
    'checkinTime': {
      value: state?.userModel?.checkinTime,
      label: templateHelperLabel.TEMPLATE_LABEL_STAYED_DETAILS.timeOfCheckinHeader,
      attribute: 'labelField',
      restrictShow: false,
      template: 'stayedDetailsTemplate'
    },
    'currentCheckoutDate': {
      value: state?.userModel?.currentCheckoutDate,
      label: templateHelperLabel.TEMPLATE_LABEL_STAYED_DETAILS.dateOfCheckoutHeader,
      attribute: 'labelField',
      restrictShow: false,
      template: 'stayedDetailsTemplate'
    },
    'currentTime': {
      value: state?.userModel?.currentTime,
      label: templateHelperLabel.TEMPLATE_LABEL_STAYED_DETAILS.timeOfCheckoutHeader,
      attribute: 'labelField',
      restrictShow: false,
      template: 'stayedDetailsTemplate'
    },
    'extraBedCount': {
      value: state?.billingDetails?.extraBedCount,
      label: templateHelperLabel.TEMPLATE_LABEL_STAYED_DETAILS.extraBedCountHeader,
      attribute: 'labelField',
      restrictShow: false,
      template: 'stayedDetailsTemplate'
    },
    'extraBedCollection': {
      value: state?.billingDetails?.extraBedCollection,
      label: configOptions.isExtraCalc ? templateHelperLabel.TEMPLATE_LABEL_STAYED_DETAILS.extraBedPriceHeaderWithExtraCalc :
          templateHelperLabel.TEMPLATE_LABEL_STAYED_DETAILS.extraBedPriceHeaderWithoutExtraCalc,
      attribute: 'labelField',
      restrictShow: false,
      template: 'stayedDetailsTemplate'
    },
    'stayeddays': {
      value: state?.stayeddays + " Days",
      label: templateHelperLabel.TEMPLATE_LABEL_STAYED_DETAILS.stayedDaysHeader,
      attribute: 'labelField',
      restrictShow: false,
      template: 'stayedDetailsTemplate'
    },
    'oldRoomNo': {
      value: state?.userModel?.oldRoomNo,
      label: templateHelperLabel.TEMPLATE_LABEL_ROOM_TRANSFER_DETAILS.oldRoomNo,
      attribute: 'labelField',
      restrictShow: !state?.userModel?.isRoomTransfered,
      template: 'roomTransferTemplate'
    },
    'oldRoomStayDays': {
      value: state?.userModel?.oldRoomStayDays + " Days",
      label: templateHelperLabel.TEMPLATE_LABEL_ROOM_TRANSFER_DETAILS.oldRoomStayDays,
      attribute: 'labelField',
      restrictShow: !state?.userModel?.isRoomTransfered,
      template: 'roomTransferTemplate'
    },
    'oldRoomPrice': {
      value: Number(state?.userModel?.oldRoomPrice) + ' Rs',
      label: templateHelperLabel.TEMPLATE_LABEL_ROOM_TRANSFER_DETAILS.oldRoomPrice,
      attribute: 'labelField',
      restrictShow: !state?.userModel?.isRoomTransfered,
      template: 'roomTransferTemplate'
    },
    'roomPrice': {
      value: state?.billingInfo?.roomPrice,
      label: templateHelperLabel.TEMPLATE_LABEL_BILL_DETAILS.roomPriceHeader,
      attribute: 'labelField',
      restrictShow: false,
      template: 'billingDetailsTemplate'
    },
    'roomPricePerStays': {
      value: state?.billingInfo?.roomPricePerStays + ' Rs',
      label: templateHelperLabel.TEMPLATE_LABEL_BILL_DETAILS.roomPricePerStays,
      attribute: 'labelField',
      restrictShow: false,
      template: 'billingDetailsTemplate'
    },
    'gstPrice': {
      value: state?.billingInfo?.gstPrice + ' Rs',
      label: templateHelperLabel.TEMPLATE_LABEL_BILL_DETAILS.gstDedeuction,
      attribute: 'labelField',
      restrictShow: false,
      template: 'billingDetailsTemplate'
    },
    'advanceAmount': {
      value: state?.billingInfo?.advanceAmount + ' Rs',
      label: configOptions.isAdvanceRestricted ? templateHelperLabel.TEMPLATE_LABEL_BILL_DETAILS.advanceAmount :
          templateHelperLabel.TEMPLATE_LABEL_BILL_DETAILS.cashAndDeposit,
      attribute: 'labelField',
      restrictShow: false,
      template: 'billingDetailsTemplate'
    },
    'discountAmount': {
      value: state?.billingInfo?.discountAmount + ' Rs',
      label: templateHelperLabel.TEMPLATE_LABEL_BILL_DETAILS.discountAmount,
      attribute: 'labelField',
      restrictShow: false,
      template: 'billingDetailsTemplate'
    },
    'withoutGST': {
      value: state?.billingInfo?.withoutGST + ' Rs',
      label: templateHelperLabel.TEMPLATE_LABEL_BILL_DETAILS.balWithoutGST,
      attribute: 'labelField',
      restrictShow: state?.billingInfo?.isNegativeValue,
      template: 'billingDetailsTemplate'
    },
    'totalPrice': {
      value: Math.abs(Number(state?.billingInfo?.totalPrice)) + ' Rs',
      label: templateHelperLabel.TEMPLATE_LABEL_BILL_DETAILS.balWithGST,
      attribute: 'labelField',
      restrictShow: state?.billingInfo?.isNegativeValue,
      template: 'billingDetailsTemplate'
    },
    'totalPriceWithoutRoomTransfer': {
      value: Math.abs(Number(state?.billingInfo?.totalPrice)) + ' Rs',
      label: templateHelperLabel.TEMPLATE_LABEL_BILL_DETAILS.totalPayableAmount,
      attribute: 'labelField',
      customStyle: {
        label: {
          color: 'green',
          fontWeight: 'bold'
        },
        value: {
          color: 'green',
          fontWeight: 'bold'
        }
      },
      restrictShow: state?.userModel?.isRoomTransfered,
      template: 'billingDetailsTemplate'
    },
    'totalPrice + oldRoomPrice': {
      value: (Number(state?.billingInfo?.totalPrice) + Number(state?.userModel?.oldRoomPrice)) + 'Rs',
      label: templateHelperLabel.TEMPLATE_LABEL_BILL_DETAILS.totalPayableAmountWithRoomTransfer,
      attribute: 'labelField',
      restrictShow: !state?.userModel?.isRoomTransfered,
      template: 'billingDetailsTemplate'
    },
    'refundAmount': {
      value: Math.abs(Number(state?.billingInfo?.totalPrice)) + ' Rs',
      label: templateHelperLabel.TEMPLATE_LABEL_BILL_DETAILS.refundAmount,
      attribute: 'labelField',
      customStyle: {
        label: {
          color: 'red',
          fontWeight: 'bold'
        },
        value: {
          color: 'red',
          fontWeight: 'bold'
        }
      },
      restrictShow: !state?.billingInfo?.isNegativeValue,
      template: 'billingDetailsTemplate'
    }
  };
};

// Prepare metadata label fields for checkout.template!
function _prepareLabelFieldsWithValues(templateCollection, templateHelpersLabel){
    const metadataField = {},
        populatedObject = populateReplacementObject({}, templateHelpersLabel, {});
    Object.keys(templateCollection).forEach((templateModel) => {
        const field = {};
        if(!Array.isArray(metadataField[templateCollection[templateModel].template || populatedObject[templateModel]?.template])){
          metadataField[templateCollection[templateModel].template || populatedObject[templateModel]?.template] = [];
        }
        field['value'] = templateCollection[templateModel].value !== undefined ?
            templateCollection[templateModel].value : (typeof templateCollection[templateModel] === 'object' ?
                templateCollection[templateModel].value : templateCollection[templateModel]);
        field['label'] = templateCollection[templateModel].label || populatedObject[templateModel]?.label;
        field['attribute'] = templateCollection[templateModel].attribute || populatedObject[templateModel]?.attribute;
        field['restrictShow'] = templateCollection[templateModel].restrictShow || populatedObject[templateModel]?.restrictShow;
        if(templateCollection[templateModel]?.customStyle || populatedObject[templateModel]?.customStyle){
           field['customStyle'] = templateCollection[templateModel].customStyle || populatedObject[templateModel].customStyle;
        }
        metadataField[templateCollection[templateModel].template || populatedObject[templateModel]?.template].push(field);
    });
    return metadataField;
};

// Prepare custom template replacements!
function _prepareCustomTemplateReplacements(replacements){
    const customTemplateReplacements = {};
    Object.keys(replacements).forEach((val) => {
        customTemplateReplacements[val] = replacements[val].value;
    });
    return customTemplateReplacements;
};

export function templateHelpers(state, configOptions, replacements, propertyContainerHeight) {
  const userModel = state.userModel || replacements,
      templateHelperLabel = state.templateConstants || checkoutViewConstants,
      htmlContent = state.htmlContent;
  replacements = replacements || populateReplacementObject(state, templateHelperLabel, configOptions);

  const labelFields = _prepareLabelFieldsWithValues(replacements, templateHelperLabel);

  if(state?.htmlContent?.content){
      const customTemplateReplacements = _prepareCustomTemplateReplacements(replacements);
      return renderCustomHTMLContent(htmlContent, customTemplateReplacements, propertyContainerHeight);
  } else {
    return (
        <div className = "dashboard-container-fields-view" style = {{height: propertyContainerHeight}}>
          <div className='row'>
            {/* Customer Details */}
            <div className='col'>
              <div className='dashboard-container-fields-header'>
                {templateHelperLabel.TEMPLATE_LABEL_CUSTOMER_DETAILS.customerDetailsHeaders}
              </div>
              <MetadataFieldsView data = {labelFields['customerTemplate']} />
            </div>
            {/* Stayed Details */}
            <div className='col'>
              <div className='dashboard-container-fields-header'>
                {templateHelperLabel.TEMPLATE_LABEL_STAYED_DETAILS.stayedDetailsHeader}
              </div>
              <MetadataFieldsView data = {labelFields['stayedDetailsTemplate']}/>
            </div>
            {/* Room Transfer Details */}
            {userModel.isRoomTransfered && (
                <div className='col'>
                  <div className='dashboard-container-fields-header'>
                    {templateHelperLabel.TEMPLATE_LABEL_ROOM_TRANSFER_DETAILS.roomTransferDetailsHeader}
                  </div>
                  <MetadataFieldsView data = {labelFields['roomTransferTemplate']}/>
                </div>
            )}
            {/* Bill Details */}
            <div className='col'>
              <div className='dashboard-container-fields-header'>
                {templateHelperLabel.TEMPLATE_LABEL_BILL_DETAILS.billDetailsHeader}
              </div>
              <MetadataFieldsView data = {labelFields['billingDetailsTemplate']}/>
            </div>
          </div>
        </div>
    )
  }
}
