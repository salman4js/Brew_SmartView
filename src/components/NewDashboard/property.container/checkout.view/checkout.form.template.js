export function templateHelpers(state, configOptions){
  var userModel = state.userModel,
    billingInfo = state.billingInfo,
    billingDetails = state.billingDetails,
    templateHelperLabel = state.templateConstants;
  return(
      <div className = 'row'>
      {/* Customer Details */}
        <div className = 'col'>
          <div className = 'dashboard-container-fields-header'>
            {templateHelperLabel.TEMPLATE_LABEL_CUSTOMER_DETAILS.customerDetailsHeaders}
          </div>
            <div className = 'modal-gap'>
              <label style = {{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_CUSTOMER_DETAILS.customerNameLabel} </label>
              <p style = {{color: 'black'}}> {userModel.username} </p>
            </div>
            <div className = 'modal-gap'>
              <label style = {{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_CUSTOMER_DETAILS.customerPhoneNumberLabel} </label>
              <p style = {{color: 'black'}}> {userModel.phonenumber} </p>
            </div>
            <div className = 'modal-gap'>
              <label style = {{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_CUSTOMER_DETAILS.customerSecondNumberLabel} </label>
              <p style = {{color: 'black'}}> {userModel.secondphonenumber} </p>
            </div>
            <div className = 'modal-gap'>
              <label style = {{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_CUSTOMER_DETAILS.customerIdNumber} </label>
              <p style = {{color: 'black'}}> {userModel.aadharcard} </p>
            </div>
            <div className = 'modal-gap'>
              <label style = {{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_CUSTOMER_DETAILS.adultsHeadCount} </label>
              <p style = {{color: 'black'}}> {userModel.adults} </p>
            </div>
            <div className = 'modal-gap'>
              <label style = {{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_CUSTOMER_DETAILS.childrensHeadCount} </label>
              <p style = {{color: 'black'}}> {userModel.childrens} </p>
            </div>
        </div>
        {/* Stayed Details */}
        <div className = 'col'>
          <div className = 'dashboard-container-fields-header'>
            {templateHelperLabel.TEMPLATE_LABEL_STAYED_DETAILS.stayedDetailsHeader}
          </div>
            <div className = 'modal-gap'>
              <label style = {{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_STAYED_DETAILS.dateOfCheckinHeader} </label>
              <p style = {{color: 'black'}}> {userModel.dateofcheckin} </p>
            </div>
            <div className = 'modal-gap'>
              <label style = {{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_STAYED_DETAILS.timeOfCheckinHeader} </label>
              <p style = {{color: 'black'}}> {userModel.checkinTime} </p>
            </div>
            <div className = 'modal-gap'>
              <label style = {{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_STAYED_DETAILS.dateOfCheckoutHeader} </label>
              <p style = {{color: 'black'}}> {userModel.currentCheckoutDate} </p>
            </div>
            <div className = 'modal-gap'>
              <label style = {{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_STAYED_DETAILS.timeOfCheckoutHeader} </label>
              <p style = {{color: 'black'}}> {userModel.currentTime} </p>
            </div>
            <div className = 'modal-gap'>
              <label style = {{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_STAYED_DETAILS.extraBedCountHeader} </label>
              <p style = {{color: 'black'}}> {billingDetails.extraBedCount} </p>
            </div>
            <div className = 'modal-gap'>
              <label style = {{color: 'black'}}> {configOptions.isExtraCalc ? templateHelperLabel.TEMPLATE_LABEL_STAYED_DETAILS.extraBedPriceHeaderWithExtraCalc : templateHelperLabel.TEMPLATE_LABEL_STAYED_DETAILS.extraBedPriceHeaderWithoutExtraCalc} </label>
              <p style = {{color: 'black'}}> {billingDetails.extraBedCollection} </p>
            </div>
            <div className = 'modal-gap'>
              <label style = {{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_STAYED_DETAILS.stayedDaysHeader} </label>
              <p style = {{color: 'black'}}> {state.stayeddays} </p>
            </div>
        </div>
        {/* Room Transfer Details */}
        {userModel.isRoomTransfered && (
          <div className = 'col'>
            <div className = 'dashboard-container-fields-header'>
              {templateHelperLabel.TEMPLATE_LABEL_ROOM_TRANSFER_DETAILS.roomTransferDetailsHeader}
            </div>
            <div className = 'modal-gap'>
              <label style = {{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_ROOM_TRANSFER_DETAILS.oldRoomNo} </label>
              <p style = {{color: 'black'}}> {userModel.oldRoomNo} </p>
            </div>
            <div className = 'modal-gap'>
              <label style = {{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_ROOM_TRANSFER_DETAILS.oldRoomStayDays} </label>
              <p style = {{color: 'black'}}> {userModel.oldRoomStayDays} </p>
            </div>
            <div className = 'modal-gap'>
              <label style = {{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_ROOM_TRANSFER_DETAILS.oldRoomPrice} </label>
              <p style = {{color: 'black'}}> {userModel.oldRoomPrice + ' Rs'} </p>
            </div>
          </div>
        )}
        {/* Bill Details */}
        <div className = 'col'>
          <div className = 'dashboard-container-fields-header'>
            {templateHelperLabel.TEMPLATE_LABEL_BILL_DETAILS.billDetailsHeader}
          </div>
            <div className = 'modal-gap'>
              <label style = {{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_BILL_DETAILS.roomPriceHeader} </label>
              <p style = {{color: 'black'}}> {billingInfo.roomPrice} </p>
            </div>
            <div className = 'modal-gap'>
              <label style = {{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_BILL_DETAILS.roomPricePerStays} </label>
              <p style = {{color: 'black'}}> {billingInfo.roomPricePerStays + ' Rs'} </p>
            </div>
            <div className = 'modal-gap'>
              <label style = {{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_BILL_DETAILS.gstDedeuction} </label>
              <p style = {{color: 'black'}}> {billingInfo.gstPrice + ' Rs'} </p>
            </div>
            <div className = 'modal-gap'>
              <label style = {{color: 'black'}}> {configOptions.isAdvanceRestricted ? templateHelperLabel.TEMPLATE_LABEL_BILL_DETAILS.advanceAmount : templateHelperLabel.TEMPLATE_LABEL_BILL_DETAILS.cashAndDeposit} </label>
              <p style = {{color: 'black'}}> {billingInfo.advanceAmount} </p>
            </div>
            <div className = 'modal-gap'>
              <label style = {{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_BILL_DETAILS.discountAmount} </label>
              <p style = {{color: 'black'}}> {billingInfo.discountAmount} </p>
            </div>
            {!billingInfo.isNegativeValue && (
              <>
                <div className = 'modal-gap'>
                  <label style = {{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_BILL_DETAILS.balWithoutGST} </label>
                  <p style = {{color: 'black'}}> {billingInfo.withoutGST} </p>
                </div>
                <div className = 'modal-gap'>
                  <label style = {{color: 'black'}}> {templateHelperLabel.TEMPLATE_LABEL_BILL_DETAILS.balWithGST} </label>
                  <p style = {{color: 'black'}}> {billingInfo.totalPrice} </p>
                </div>
                {userModel.isRoomTransfered && (
                  <div className = 'modal-gap'>
                    <label style = {{color: 'green', fontWeight: 'bold'}}> {templateHelperLabel.TEMPLATE_LABEL_BILL_DETAILS.totalPayableAmountWithRoomTransfer} </label>
                    <p style = {{color: 'green', fontWeight: 'bold'}}> {billingInfo.totalPrice + userModel.oldRoomPrice + ' Rs'} </p>
                  </div>
                )}
                {!userModel.isRoomTransfered && (
                  <div className = 'modal-gap'>
                    <label style = {{color: 'green', fontWeight: 'bold'}}> {templateHelperLabel.TEMPLATE_LABEL_BILL_DETAILS.totalPayableAmount} </label>
                    <p style = {{color: 'green', fontWeight: 'bold'}}> {billingInfo.totalPrice + ' Rs'} </p>
                  </div>
                )}
              </>
            )}
            {billingInfo.isNegativeValue && (
              <>
                <div className = 'modal-gap'>
                  <label style = {{color: 'red', fontWeight: 'bold'}}> {templateHelperLabel.TEMPLATE_LABEL_BILL_DETAILS.refundAmount} </label>
                  <p style = {{color: 'red', fontWeight: 'bold'}}> {Math.abs(billingInfo.totalPrice) + ' Rs'} </p>
                </div>
              </>
            )}
        </div>
      </div>
  )
};