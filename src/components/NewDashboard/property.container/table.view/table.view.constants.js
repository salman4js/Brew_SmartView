var tableViewConstants = Object.freeze({

  tablePerspectiveConstant: 'table-view',

  PropertyStatusTableHeader: Object.freeze({
    afterCheckedout: ['Floor No', 'Room No', 'Room type', 'Bed Count', 'Extra Bed Price Per Day', 'Price Per Day'],
    afterCleaned: ['Floor No', 'Room No', 'Room type', 'Bed Count', 'Extra Bed Price Per Day', 'Price Per Day'],
    inCleaning: ['Floor No', 'Room No', 'Room type', 'Bed Count', 'Extra Bed Price Per Day', 'Price Per Day'],
    afterCheckin: ['Floor No', 'Room No', 'Guest Name', 'Guest Phone Number', 'Date of Checkin', 'Date of Checkout'],
    upcomingCheckout: ['Floor No', 'Room No', 'Guest Name', 'Guest Phone Number', 'Date of Checkin', 'Date of Checkout'],
    upcomingPrebook: ['Floor No', 'Room No', 'Guest Name', 'Guest Phone Number', 'Date of Checkin', 'Date of Checkout'],
    favorites: ['Guest Name', "Phone Number", 'Guest Identification Number'],
    history: ['Guest Name', 'Phone Number', 'Guest ID Number', 'Address', 'Date of Checkin',
      'Time of Checkin', 'Date of Checkout', 'Time of Checkout', 'Total Amount'],
    logTable: ['Log Type', 'Log Comments', 'Log Paid', 'Log Date & Time', 'Log Price'],
    paymentTrackerView: ['Amount', 'Amount For', 'Date & Time', 'Mode'],
    multipleLogin: ['Username', 'Password', 'Permission Level'],
    roomAction: ['Floor No', 'Room No', 'Room type', 'Bed Count', 'Extra Bed Price Per Day', 'Price Per Day']
  }),

  PropertyStatusRequiredKey: Object.freeze({
    afterCheckedout: ['_id','floorNo', 'roomno', 'suiteName', 'bedCount', 'extraBedPrice', 'price'],
    afterCleaned: ['_id','floorNo', 'roomno', 'suiteName', 'bedCount', 'extraBedPrice', 'price'],
    inCleaning: ['_id','floorNo', 'roomno', 'suiteName', 'bedCount', 'extraBedPrice', 'price'],
    afterCheckin: ['_id','floorNo', 'roomno', 'username', 'phonenumber', 'dateofcheckin', 'dateofcheckout'],
    upcomingCheckout: ['_id','floorNo', 'roomno', 'username', 'phonenumber', 'dateofcheckin', 'dateofcheckout'],
    upcomingPrebook: ['_id', 'floorNo', 'roomno', 'prebookUsername', 'prebookPhoneNumber', 'prebookDateofCheckin', 'prebookDateofCheckout'],
    favorites: ['_id', 'username', 'phonenumber', 'aadharcard'],
    history: ['_id', 'username', 'phonenumber', 'aadharcard', 'address', 'dateofcheckin',
      'checkinTime', 'dateofcheckout', 'checkoutTime', 'totalAmount'],
    logTable: ['_id', 'priceType', 'priceLog', 'isPaid', 'dateTime', 'price'],
    paymentTrackerView: ['paymentTrackerId', 'amount', 'amountFor', 'dateTime', 'isPrebook'],
    voucherTracker: ['_id', 'vNo', 'dateTime', 'particulars', 'cashMode', 'receipt', 'payment'],
    multipleLogin: ['_id', 'username', 'password', 'loginAs'],
    roomAction: ['_id','floorNo', 'roomno', 'suiteName', 'bedCount', 'extraBedPrice', 'price']
  }),

  tableInfoMessage: Object.freeze({
    ZERO_STATE_MESSAGE: 'You have no records for this table!'
  }),

  convertableConstants: Object.freeze({
    history: {
      keyToConvert: ['dateofcheckout', 'checkoutTime', 'totalAmount'],
      objRules: {
        '' : 'Not Checked-Out Yet'
      }
    }
  }),

  fetchableWidgetTiles: Object.freeze({
    history: (details) => {
      let url = `${details.baseUrl}/${details.accId}/${details.query ? 0 : details.paginationData.skipCount}/${details.query ? 0 : details.paginationData.limitCount}/userdb1`;
      // Check a condition and add query parameters accordingly
      if (details.query) {
        url += '?';
        Object.keys(details.query).forEach((query) => {
          url += `${query}=${details.query[query]}&`;
        });
      }
      return url;
    }
  }),

  paginationConstants: Object.freeze({
    PAGINATION_DEFAULT_LIMIT: 15,
    PAGINATION_DEFAULT_SKIP_COUNT: 0,
    PAGINATION_DEFAULT_COUNT: 0,
    PAGINATION_VIEW_HEIGHT: 20
  }),

  tableFilterSettings: Object.freeze({
    tableFilterAllowedKeys: ['history', 'afterCleaned', 'afterCheckin']
  }),

  tableCreateMode: Object.freeze({
    tableCreateModeAllowedKeys: ['voucherTracker', 'multipleLogin', 'roomAction']
  })

});

export default tableViewConstants;
