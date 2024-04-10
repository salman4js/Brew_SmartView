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
      tableCreateModeAllowedKeys: ['voucherTracker', 'multipleLogin']
    },

    TABLE_EDIT: {
        tableEditLabel: (options) => `Edit ${options.headerValue} Entry`,
        footerButtons: {
            primaryBtn: 'Edit',
            secondaryBtn: 'Cancel'
        },
        tableEditModeAllowedKeys: ['voucherTracker', 'multipleLogin', 'createRoomAction']
    },

    HEADER_OPTIONS: {
        voucherTracker: 'Voucher',
        multipleLogin: 'Account',
        createRoomAction: 'Room'
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
    },
    TABLE_CREATE_DIALOG: Object.freeze({
        voucherTracker: {
            date: 'Date',
            particulars: 'Particulars',
            cashMode: 'Cash Mode',
            receipt: 'Receipt',
            payment: 'Payment'
        },
        multipleLogin: {
            username: {
                label: 'Enter Username',
                placeholder: 'User Name'
            },
            password: {
                label: 'Password',
                placeholder: 'Set a password',
            },
            loginAs: {
                placeholder: 'Permission Level',
                listFieldOptions: [{
                    value: 'Manager Level Authorization',
                    actualValue: 'managerLevel'
                }, {
                    value: 'Receptionist Level Authorization',
                    actualValue: 'receptionistLevel'
                }]
            }
        },
        createRoomAction: {
            roomno: {
                placeholder: 'Enter Room Number'
            },
            floorNo: {
                placeholder: 'Enter Floor Number'
            },
            extraBedPrice: {
                placeholder: 'Enter Extra Bed Price'
            },
            price: {
                placeholder: 'Enter Room Price'
            },
            bedCount: {
                placeholder: 'Enter Bed Count'
            }
        }
    })
});

export default dialogConstants;