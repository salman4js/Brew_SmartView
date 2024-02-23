import {renderCustomHTMLContent} from "../../../common.functions/node.convertor";
import checkoutViewConstants from "./checkout.form.constants";

// Populate replacements objects!
function populateReplacementObject(state){
  // Define replacements
  return {
    'username': state.userModel.username,
    'phonenumber': state.userModel.phonenumber,
    'secondphonenumber': state.userModel.secondphonenumber,
    'aadharcard': state.userModel.aadharcard,
    'adults': state.userModel.adults,
    'childrens': state.userModel.childrens,
    'dateofcheckin': state.userModel.dateofcheckin,
    'checkinTime': state.userModel.checkinTime,
    'currentCheckoutDate': state.userModel.currentCheckoutDate,
    'currentTime': state.userModel.currentTime,
    'extraBedCount': state.billingDetails.extraBedCount,
    'extraBedCollection': state.billingDetails.extraBedCollection,
    'stayeddays': state.stayeddays,
    'oldRoomNo': state.userModel.oldRoomNo,
    'oldRoomStayDays': state.userModel.oldRoomStayDays,
    'oldRoomPrice': Number(state.userModel.oldRoomPrice) + ' Rs',
    'roomPrice': state.billingInfo.roomPrice,
    'roomPricePerStays': state.billingInfo.roomPricePerStays + ' Rs',
    'gstPrice': state.billingInfo.gstPrice + ' Rs',
    'advanceAmount': state.billingInfo.advanceAmount + ' Rs',
    'discountAmount': state.billingInfo.discountAmount + ' Rs',
    'withoutGST': state.billingInfo.withoutGST + ' Rs',
    'totalPrice': Number(state.billingInfo.totalPrice) + ' Rs',
    'totalPrice + oldRoomPrice': (Number(state.billingInfo.totalPrice) + Number(state.userModel.oldRoomPrice)) + 'Rs'
  };
};

export function templateHelpers(state, configOptions, replacements, propertyContainerHeight) {
  var userModel = state.userModel || replacements,
      billingInfo = state.billingInfo || replacements,
      templateHelperLabel = state.templateConstants || checkoutViewConstants,
      htmlContent = state.htmlContent;
  replacements = replacements || populateReplacementObject(state);

  if(state?.htmlContent?.content){
      return renderCustomHTMLContent(htmlContent, replacements, propertyContainerHeight);
  } else {
    return (
        <div className = "dashboard-container-fields-view">
          <div className='row'>
            {/* Customer Details */}
            <div className='col'>
              <div className='dashboard-container-fields-header'>
                {templateHelperLabel.TEMPLATE_LABEL_CUSTOMER_DETAILS.customerDetailsHeaders}
              </div>
              <div className='modal-gap'>
                <label
                    style={{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_CUSTOMER_DETAILS.customerNameLabel} </label>
                <p style={{color: 'black'}}> {replacements.username} </p>
              </div>
              <div className='modal-gap'>
                <label
                    style={{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_CUSTOMER_DETAILS.customerPhoneNumberLabel} </label>
                <p style={{color: 'black'}}> {replacements.phonenumber} </p>
              </div>
              <div className='modal-gap'>
                <label
                    style={{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_CUSTOMER_DETAILS.customerSecondNumberLabel} </label>
                <p style={{color: 'black'}}> {replacements.secondphonenumber} </p>
              </div>
              <div className='modal-gap'>
                <label
                    style={{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_CUSTOMER_DETAILS.customerIdNumber} </label>
                <p style={{color: 'black'}}> {replacements.aadharcard} </p>
              </div>
              <div className='modal-gap'>
                <label
                    style={{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_CUSTOMER_DETAILS.adultsHeadCount} </label>
                <p style={{color: 'black'}}> {replacements.adults} </p>
              </div>
              <div className='modal-gap'>
                <label
                    style={{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_CUSTOMER_DETAILS.childrensHeadCount} </label>
                <p style={{color: 'black'}}> {replacements.childrens} </p>
              </div>
            </div>
            {/* Stayed Details */}
            <div className='col'>
              <div className='dashboard-container-fields-header'>
                {templateHelperLabel.TEMPLATE_LABEL_STAYED_DETAILS.stayedDetailsHeader}
              </div>
              <div className='modal-gap'>
                <label
                    style={{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_STAYED_DETAILS.dateOfCheckinHeader} </label>
                <p style={{color: 'black'}}> {replacements.dateofcheckin} </p>
              </div>
              <div className='modal-gap'>
                <label
                    style={{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_STAYED_DETAILS.timeOfCheckinHeader} </label>
                <p style={{color: 'black'}}> {replacements.checkinTime} </p>
              </div>
              <div className='modal-gap'>
                <label
                    style={{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_STAYED_DETAILS.dateOfCheckoutHeader} </label>
                <p style={{color: 'black'}}> {replacements.currentCheckoutDate} </p>
              </div>
              <div className='modal-gap'>
                <label
                    style={{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_STAYED_DETAILS.timeOfCheckoutHeader} </label>
                <p style={{color: 'black'}}> {replacements.currentTime} </p>
              </div>
              <div className='modal-gap'>
                <label
                    style={{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_STAYED_DETAILS.extraBedCountHeader} </label>
                <p style={{color: 'black'}}> {replacements.extraBedCount} </p>
              </div>
              <div className='modal-gap'>
                <label
                    style={{color: 'black'}}> {configOptions.isExtraCalc ? templateHelperLabel.TEMPLATE_LABEL_STAYED_DETAILS.extraBedPriceHeaderWithExtraCalc : templateHelperLabel.TEMPLATE_LABEL_STAYED_DETAILS.extraBedPriceHeaderWithoutExtraCalc} </label>
                <p style={{color: 'black'}}> {replacements.extraBedCollection} </p>
              </div>
              <div className='modal-gap'>
                <label
                    style={{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_STAYED_DETAILS.stayedDaysHeader} </label>
                <p style={{color: 'black'}}> {replacements.stayeddays} </p>
              </div>
            </div>
            {/* Room Transfer Details */}
            {userModel.isRoomTransfered && (
                <div className='col'>
                  <div className='dashboard-container-fields-header'>
                    {templateHelperLabel.TEMPLATE_LABEL_ROOM_TRANSFER_DETAILS.roomTransferDetailsHeader}
                  </div>
                  <div className='modal-gap'>
                    <label
                        style={{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_ROOM_TRANSFER_DETAILS.oldRoomNo} </label>
                    <p style={{color: 'black'}}> {replacements.oldRoomNo} </p>
                  </div>
                  <div className='modal-gap'>
                    <label
                        style={{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_ROOM_TRANSFER_DETAILS.oldRoomStayDays} </label>
                    <p style={{color: 'black'}}> {replacements.oldRoomStayDays} </p>
                  </div>
                  <div className='modal-gap'>
                    <label
                        style={{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_ROOM_TRANSFER_DETAILS.oldRoomPrice} </label>
                    <p style={{color: 'black'}}> {replacements.oldRoomPrice} </p>
                  </div>
                </div>
            )}
            {/* Bill Details */}
            <div className='col'>
              <div className='dashboard-container-fields-header'>
                {templateHelperLabel.TEMPLATE_LABEL_BILL_DETAILS.billDetailsHeader}
              </div>
              <div className='modal-gap'>
                <label
                    style={{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_BILL_DETAILS.roomPriceHeader} </label>
                <p style={{color: 'black'}}> {replacements.roomPrice} </p>
              </div>
              <div className='modal-gap'>
                <label
                    style={{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_BILL_DETAILS.roomPricePerStays} </label>
                <p style={{color: 'black'}}> {replacements.roomPricePerStays} </p>
              </div>
              <div className='modal-gap'>
                <label
                    style={{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_BILL_DETAILS.gstDedeuction} </label>
                <p style={{color: 'black'}}> {replacements.gstPrice} </p>
              </div>
              <div className='modal-gap'>
                <label
                    style={{color: 'black'}}> {configOptions.isAdvanceRestricted ? templateHelperLabel.TEMPLATE_LABEL_BILL_DETAILS.advanceAmount : templateHelperLabel.TEMPLATE_LABEL_BILL_DETAILS.cashAndDeposit} </label>
                <p style={{color: 'black'}}> {replacements.advanceAmount} </p>
              </div>
              <div className='modal-gap'>
                <label
                    style={{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_BILL_DETAILS.discountAmount} </label>
                <p style={{color: 'black'}}> {replacements.discountAmount} </p>
              </div>
              {!billingInfo.isNegativeValue && (
                  <>
                    <div className='modal-gap'>
                      <label
                          style={{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_BILL_DETAILS.balWithoutGST} </label>
                      <p style={{color: 'black'}}> {replacements.withoutGST} </p>
                    </div>
                    <div className='modal-gap'>
                      <label
                          style={{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_BILL_DETAILS.balWithGST} </label>
                      <p style={{color: 'black'}}> {replacements.totalPrice} </p>
                    </div>
                    {userModel.isRoomTransfered && (
                        <div className='modal-gap'>
                          <label style={{
                            color: 'green',
                            fontWeight: 'bold'
                          }}> {templateHelperLabel.TEMPLATE_LABEL_BILL_DETAILS.totalPayableAmountWithRoomTransfer} </label>
                          {replacements.isCheckedOut && (
                              <p style={{
                                color: 'green',
                                fontWeight: 'bold'
                              }}> {replacements.totalPrice + replacements.oldRoomPrice} </p>
                          )}
                          {/** If it's not checked out don't render oldRoomPrice data**/}
                          {!replacements.isCheckedOut && (
                              <p style={{
                                color: 'green',
                                fontWeight: 'bold'
                              }}> {replacements.totalPrice} </p>
                          )}
                        </div>
                    )}
                    {!userModel.isRoomTransfered && (
                        <div className='modal-gap'>
                          <label style={{
                            color: 'green',
                            fontWeight: 'bold'
                          }}> {templateHelperLabel.TEMPLATE_LABEL_BILL_DETAILS.totalPayableAmount} </label>
                          <p style={{color: 'green', fontWeight: 'bold'}}> {replacements.totalPrice} </p>
                        </div>
                    )}
                  </>
              )}
              {billingInfo.isNegativeValue && (
                  <>
                    <div className='modal-gap'>
                      <label style={{
                        color: 'red',
                        fontWeight: 'bold'
                      }}> {templateHelperLabel.TEMPLATE_LABEL_BILL_DETAILS.refundAmount} </label>
                      <p style={{color: 'red', fontWeight: 'bold'}}> {Math.abs(replacements.totalPrice)} </p>
                    </div>
                  </>
              )}
            </div>
          </div>
        </div>
    )
  }
}
