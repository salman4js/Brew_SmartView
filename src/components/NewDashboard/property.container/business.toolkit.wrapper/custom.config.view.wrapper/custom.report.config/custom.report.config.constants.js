const CustomReportConfigConstants = Object.freeze({
    selectFieldsModalHeader: 'Select fields to appear on your custom report',
    createFieldsToolTipMessage: 'Values for customized field formula:\n ' +
        '\nAdvance: advance' +
        '\nDiscount: discount' +
        '\nNo Of Stayed Days: stayedDays' +
        '\nExtra Bed Price: extraBedPrice' +
        '\nExtra Bed Count: extraBeds' +
        '\nGST price: stayGst' +
        '\nRefunded Amount: refund' +
        '\nAmount for stayed days: totalAmount' +
        '\n' +
        '\nReceipt Id: receiptId' +
        '\nCustomer Name: username' +
        '\nCustomer Phone Number: phonenumber' +
        '\nCustomer ID Number: aadharcard' +
        '\nAdults Count: adults' +
        '\nChildren Count: childrens' +
        '\nCheck-In by: checkinBy' +
        '\nCheck-Out by: checkoutBy' +
        '\nDate of checkin: dateofcheckin'+
        '\nTime of checkin: checkinTime' +
        '\nDate of checkout: dateofcheckout' +
        '\nTime of checkout: checkoutTime' +
        '\nBooked Room Number: roomno' +
        '\nTransferred Room Number: transferedRoomNo' +
        '\nRoom Type: roomType' +
        '\n' +
        '\nFloor No: floorNo' +
        '\nCustomer Prebooked: prebooked' +
        '\nCustomer Room Transferred: isRoomTransfered' +
        '\nPrevious Room Number: oldRoomNo' +
        '\nPrevious Room Stayed Days: oldRoomStayDays' +
        '\nPrevious Room Stay Price: oldRoomPrice' +
        '\n' +
        '\nReplace your formula variables with these' +
        '\nvalues!' +
        '\n' +
        '\nEx: (advance + discount) * extraBedPrice' +
        '\n' +
        '\nPlease keep in mind to follow BODMAS rule!',
});

export default CustomReportConfigConstants;