var tableViewConstants = Object.freeze({
  
  PropertyStatusTableHeader: Object.freeze({
    afterCheckedout: ['Floor No', 'Room No', 'Room type', 'Bed Count', 'Extra Bed Price Per Day', 'Price Per Day'],
    afterCleaned: ['Floor No', 'Room No', 'Room type', 'Bed Count', 'Extra Bed Price Per Day', 'Price Per Day'],
    inCleaning: ['Floor No', 'Room No', 'Room type', 'Bed Count', 'Extra Bed Price Per Day', 'Price Per Day'],
    afterCheckin: ['Floor No', 'Room No', 'Guest Name', 'Guest Phone Number', 'Date of Checkin', 'Date of Checkout'],
    upcomingCheckout: ['Floor No', 'Room No', 'Guest Name', 'Guest Phone Number', 'Date of Checkin', 'Date of Checkout'],
    upcomingPrebook: ['Floor No', 'Room No', 'Guest Name', 'Guest Phone Number', 'Date of Checkin', 'Date of Checkout'],
    favorites: ['Guest Name', "Phone Number", 'Guest Identification Number']
  }),
  
  PropertyStatusRequiredKey: Object.freeze({
    afterCheckedout: ['_id','floorNo', 'roomno', 'suiteName', 'bedCount', 'extraBedPrice', 'price'],
    afterCleaned: ['_id','floorNo', 'roomno', 'suiteName', 'bedCount', 'extraBedPrice', 'price'],
    inCleaning: ['_id','floorNo', 'roomno', 'suiteName', 'bedCount', 'extraBedPrice', 'price'],
    afterCheckin: ['_id','floorNo', 'roomno', 'username', 'phonenumber', 'dateofcheckin', 'dateofcheckout'],
    upcomingCheckout: ['_id','floorNo', 'roomno', 'username', 'phonenumber', 'dateofcheckin', 'dateofcheckout'],
    upcomingPrebook: ['_id', 'floorNo', 'roomno', 'prebookUsername', 'prebookPhoneNumber', 'prebookDateofCheckin', 'prebookDateofCheckout'],
    favorites: ['_id', 'username', 'phonenumber', 'aadharcard']
  }),
  
  tableInfoMessage: Object.freeze({
    ZERO_STATE_MESSAGE: 'You have no records for this table!'
  }),
  
});

export default tableViewConstants;
