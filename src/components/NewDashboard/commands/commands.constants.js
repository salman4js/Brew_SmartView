var commandsConstant = Object.freeze({
    LOCAL_SERVER: 'localhost',
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

    SELECTED_MODELS: {
      selectedModelsLabel: 'Selected Entries',
      footerButtons: {
          primaryBtn: 'Apply',
          secondaryBtn: 'Cancel'
      }
    },

    PropertySearchKey: Object.freeze({
        user: ['afterCheckin', 'upcomingCheckout', 'upcomingPrebook'],
        _id: ['afterCheckedout', 'afterCleaned', 'inCleaning']
    }),

    ROOM_TRANSFER: Object.freeze({
        filteredRoomStatusConstant: 'afterCleaned',
        dashboardMode: 'filterTableView'
    }),

    MORE_DETAILS: Object.freeze({
       currentRouter: 'custom-view',
       dashboardMode: 'customHtmlView',
       defaultDashboardMode: 'historyPreview',
       moreDetails: 'More Details',
       replacementsForEmptyData: {
           stayedDays: 'Not Checked-Out Yet',
           bill: 'Not Checked-Out Yet',
           stayGst: 'Not Checked-Out Yet',
           oldRoomNo: 'Not Checked-Out Yet',
           totalAmount: 'Not Checked-Out Yet',
           extraBedCollection: 'Not Checked-Out Yet',
           dateofcheckout: 'Not Checked-Out Yet',
           checkoutTime: 'Not Checked-Out Yet',
           roomPricePerStays: 'Not Checked-Out Yet',
           advance: 'Not provided any advance',
           discount: 'Not provided any discount'
       }
    }),

    MOVE_TO_NEXT_STATE: Object.freeze({
        moveToNextState: 'Move To Next State',
        currentRouter: 'custom-html-view'
    }),

    GENERATE_RECEIPT: Object.freeze({
        dashboardMode: 'receiptGeneration',
        generateReceipt: 'Generate Receipt'
    }),

    LOG_OUT: Object.freeze({
       logOut: 'Log Out'
    }),

    SWITCH_ACCOUNT: Object.freeze({
        switchAccount: 'Switch Account'
    }),

    USER_SETTINGS: Object.freeze({
        constantKey: 'user-preference',
        header: 'User Settings'
    }),

    CONNECT: Object.freeze({
        constantKey: 'livixius-connect',
        header: 'Livixius Connect',
        defaultGreetings: 'Hey there, Give me any room no to get details'
    }),

    DELETE_CONTROLLER: Object.freeze({
       deleteController: 'Delete',
       voucherTracker: {
           successMessage: 'Voucher entry deleted successfully!',
       },
       multipleLogin: {
           successMessage: 'Account has been deleted successfully!'
       },
       roomAction: {
           successMessage: 'Room entry has been deleted successfully!'
       },
       deleteControllerError: 'Something went wrong, Please try again later!'
    }),

    EDIT_CONTROLLER: Object.freeze({
        editController: 'Edit',
        voucherTracker: {
            successMessage: 'Voucher entry updated!',
        },
        multipleLogin: {
            successMessage: 'Account details updated!'
        },
        roomAction: {
            successMessage: 'Room details updated!'
        },
        editControllerError: 'Something went wrong, please try again later!'
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
        }],
        afterCheckin: [{
            'id': 'username', 'title': 'Guest Name',
        }, {
            'id': 'phonenumber', 'title': 'Phone Number',
        }, {
            'id': 'roomno', 'title': 'Room Number',
        }, {
            'id': 'floorNo', 'title': 'Floor Number',
        }, {
            'id': 'dateofcheckin', 'title': 'Date of Checkin',
        }, {
            'id': 'dateofcheckout', 'title': 'Date of Checkout',
        }],
        voucherTracker: [{
            'id': 'vNo', 'title': 'Voucher Number',
        }, {
            'id': 'dateTime', 'title': 'Date & Time',
        }, {
            'id': 'particulars', 'title': 'Particulars',
        }, {
            'id': 'cashMode', 'title': 'Cash Mode',
        }, {
            'id': 'payment', 'title': 'Payment',
        }, {
            'id': 'receipt', 'title': 'Receipt',
        }],
    }),

    isCommandsEnabled: Object.freeze({
        goToLocation: ['afterCheckin',  'upcomingCheckout', 'upcomingPrebook', 'afterCheckedout', 'afterCleaned', 'inCleaning'],
        roomTransfer: ['afterCheckin', 'upcomingCheckout'],
        favoritesCheckin: ['favorites'],
        exportToExcel: ['history', 'afterCheckin', 'voucherTracker'],
        moreDetails: ['history'],
        selectedModel: ['afterCheckin',  'upcomingCheckout', 'upcomingPrebook', 'afterCheckedout', 'afterCleaned', 'inCleaning',
        'history', 'paymentTrackerView', 'voucherTracker', 'multipleLogin', 'roomAction'],
        generateReceipt: ['paymentTrackerView', 'logTable'],
        moveToNextState: ['afterCheckedout', 'inCleaning'],
        deleteAction: ['voucherTracker', 'multipleLogin', 'roomAction'],
        editAction: ['voucherTracker', 'multipleLogin', 'roomAction'],
        userSettings: ['app-header'],
        connect: ['app-header'],
        logOut: ['user-preference'],
        switchAccount: ['user-preference']
    })
});

export default commandsConstant;