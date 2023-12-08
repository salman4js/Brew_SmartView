var commandsConstant = Object.freeze({
    goToLocationCommand: 'Go to room',
    roomTransferCommand: 'Transfer Guest',

    FAVORITES_CHECKIN_DIALOG: {
        favoritesCheckinHeader: 'Favorites Guest Check-In',
        cancelFooterBtn: 'Cancel',
        primaryFooterBtn: 'Check-In'
    },

    FAVORITES_CHECKIN: {
        favoritesCheckin: 'Check-In',
        favoritesCheckinKey: 'CHECK-IN',
        dashboardMode: 'read'
    },

    FAVORITES_ROOM_PICKER_DIALOG: {
        favoritesRoomPickerDialog: 'Favorites Room Picker',
        primaryFooterBtn: 'Select Room'
    },

    EXPORT_TO_EXCEL: {
      exportToExcelLabel: 'Export to excel',
        footerButtons: {
          primaryBtn: 'Export',
          secondaryBtn: 'Cancel'
        },
        dialogPlaceholder: 'Enter the name of the excel file'
    },

    PropertySearchKey: Object.freeze({
        user: ['afterCheckin', 'upcomingCheckout', 'upcomingPrebook'],
        _id: ['afterCheckedout', 'afterCleaned']
    }),

    ROOM_TRANSFER: Object.freeze({
        filteredRoomStatusConstant: 'afterCleaned',
        dashboardMode: 'filterTableView'
    }),

    // TODO: Remove this later, when we have backend support for column customization.
    configuredTableHeaderAndKey: Object.freeze({
        history: [{
            'id': 'username', 'title': 'Guest Name',
        }, {
            'id': 'phonenumber', 'title': 'Phone Number',
        }, {
            'id': 'aadharcard', 'title': 'Guest Id Number',
        }, {
            'id': 'address', 'title': 'Address',
        }, {
            'id': 'dateofcheckin', 'title': 'Date of Checkin',
        }, {
            'id': 'checkinTime', 'title': 'Time of Checkin',
        }, {
            'id': 'dateofcheckout', 'title': 'Date of Checkout',
        }, {
            'id': 'checkoutTime', 'title': 'Time of Checkout',
        }, {
            'id': 'totalAmount', 'title': 'Total Amount',
        }]
    }),

    isCommandsEnabled: Object.freeze({
        goToLocation: ['afterCheckin',  'upcomingCheckout', 'upcomingPrebook', 'afterCheckedout', 'afterCleaned'],
        roomTransfer: ['afterCheckin', 'upcomingCheckout'],
        favoritesCheckin: ['favorites'],
        bookingHistory: ['history']
    })
});

export default commandsConstant;