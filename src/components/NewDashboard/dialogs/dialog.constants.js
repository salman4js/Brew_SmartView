var dialogConstants = Object.freeze({
    TABLE_FILTER: {
        tableFilterLabel: 'Filter Options',
        footerButtons: {
            primaryBtn: 'Filter',
            secondaryBtn: 'Cancel'
        },
        tableFilterAllowedKeys: ['history', 'afterCleaned', 'afterCheckin']
    },

    widgetObjectId: Object.freeze({
       voucherTracker: 'voucherId'
    }),

    TABLE_CREATE: {
      tableCreateLabel: (options) => `Create new ${options.headerValue}`,
      footerButtons: {
          primaryBtn: 'Create',
          secondaryBtn: 'Cancel'
      },
      tableCreateModeAllowedKeys: ['voucherTracker']
    },

    TABLE_EDIT: {
        tableEditLabel: (options) => `Edit ${options.headerValue} Entry`,
        footerButtons: {
            primaryBtn: 'Edit',
            secondaryBtn: 'Cancel'
        },
        tableEditModeAllowedKeys: ['voucherTracker']
    },

    HEADER_OPTIONS: {
      voucherTracker: 'Voucher'
    },

    TABLE_FILTER_DIALOG: {
        history: {
            dialogOptionsLabelAndPlaceholder: {
                checkoutBy: 'Checkout By',
                checkinBy: 'Checkin By',
                username: 'Customer Name'
            },
        },
        afterCleaned: {
            dialogOptionsLabelAndPlaceholder: {
                roomNo: 'Room No',
                suiteType: 'Room Type',
                floorNo: 'Floor No',
                bedCount: 'Bed Count',
                pricePerDay: 'Price Per Day'
            },
        },
        afterCheckin: {
            dialogOptionsLabelAndPlaceholder: {
                roomNo: 'Room No',
                suiteType: 'Room Type',
                floorNo: 'Floor No',
                bedCount: 'Bed Count',
                pricePerDay: 'Price Per Day',
                username: 'Customer Name',
                phoneNumber: 'Phone Number',
                checkinBy: 'Checkin By',
                idNumber: 'ID Number'
            },
        }
    }
});

export default dialogConstants;