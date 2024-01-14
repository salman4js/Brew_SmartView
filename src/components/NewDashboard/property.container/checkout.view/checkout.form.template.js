import {renderCustomHTMLContent} from "../../../common.functions/node.convertor";

export function templateHelpers(state, configOptions) {
  var userModel = state.userModel,
      billingInfo = state.billingInfo,
      billingDetails = state.billingDetails,
      templateHelperLabel = state.templateConstants,
      htmlContent = state.htmlContent;

  // Define replacements
  const replacements = {
    'username': userModel.username,
    'phonenumber': userModel.phonenumber,
    'secondphonenumber': userModel.secondphonenumber,
    'aadharcard': userModel.aadharcard,
    'adults': userModel.adults,
    'childrens': userModel.childrens,
    'dateofcheckin': userModel.dateofcheckin,
    'checkinTime': userModel.checkinTime,
    'currentCheckoutDate': userModel.currentCheckoutDate,
    'currentTime': userModel.currentTime,
    'extraBedCount': billingDetails.extraBedCount,
    'extraBedCollection': billingDetails.extraBedCollection,
    'stayeddays': state.stayeddays,
    'oldRoomNo': userModel.oldRoomNo,
    'oldRoomStayDays': userModel.oldRoomStayDays,
    'oldRoomPrice': userModel.oldRoomPrice + 'Rs',
    'roomPrice': billingInfo.roomPrice,
    'roomPricePerStays': billingInfo.roomPricePerStays + 'Rs',
    'gstPrice': billingInfo.gstPrice,
    'advanceAmount': billingInfo.advanceAmount,
    'discountAmount': billingInfo.discountAmount,
    'withoutGST': billingInfo.withoutGST,
    'totalPrice': billingInfo.totalPrice + 'Rs',
    'totalPrice + oldRoomPrice': billingInfo.totalPrice + userModel.oldRoomPrice + 'Rs',
  };

  if(state.htmlContent.content){
      return renderCustomHTMLContent(htmlContent, replacements);
  } else {
    return (
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
                  <p style={{color: 'black'}}> {replacements.oldRoomPrice + ' Rs'} </p>
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
              <p style={{color: 'black'}}> {replacements.roomPricePerStays + ' Rs'} </p>
            </div>
            <div className='modal-gap'>
              <label style={{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_BILL_DETAILS.gstDedeuction} </label>
              <p style={{color: 'black'}}> {replacements.gstPrice + ' Rs'} </p>
            </div>
            <div className='modal-gap'>
              <label
                  style={{color: 'black'}}> {configOptions.isAdvanceRestricted ? templateHelperLabel.TEMPLATE_LABEL_BILL_DETAILS.advanceAmount : templateHelperLabel.TEMPLATE_LABEL_BILL_DETAILS.cashAndDeposit} </label>
              <p style={{color: 'black'}}> {replacements.advanceAmount} </p>
            </div>
            <div className='modal-gap'>
              <label style={{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_BILL_DETAILS.discountAmount} </label>
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
                        <p style={{
                          color: 'green',
                          fontWeight: 'bold'
                        }}> {replacements.totalPrice + replacements.oldRoomPrice + ' Rs'} </p>
                      </div>
                  )}
                  {!userModel.isRoomTransfered && (
                      <div className='modal-gap'>
                        <label style={{
                          color: 'green',
                          fontWeight: 'bold'
                        }}> {templateHelperLabel.TEMPLATE_LABEL_BILL_DETAILS.totalPayableAmount} </label>
                        <p style={{color: 'green', fontWeight: 'bold'}}> {replacements.totalPrice + ' Rs'} </p>
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
                    <p style={{color: 'red', fontWeight: 'bold'}}> {Math.abs(replacements.totalPrice) + ' Rs'} </p>
                  </div>
                </>
            )}
          </div>
        </div>
    )
  }
}
