var dialogConstants = Object.freeze({
    TABLE_FILTER: {
        tableFilterLabel: 'Filter Options',
        footerButtons: {
            primaryBtn: 'Filter',
            secondaryBtn: 'Cancel'
        },
        tableFilterAllowedKeys: ['history', 'afterCleaned', 'afterCheckin']
    },

    TABLE_CREATE: {
      tableCreateLabel: (options) => `Create new ${options.headerValue}`,
      footerButtons: {
          primaryBtn: 'Create',
          secondaryBtn: 'Cancel'
      },
      tableCreateModeAllowedKeys: ['voucherTracker', 'multipleLogin', 'roomAction', 'customReport'],
      customComponentKeys: []
    },

    TABLE_EDIT: {
        tableEditLabel: (options) => `Edit ${options.headerValue} Entry`,
        footerButtons: {
            primaryBtn: 'Edit',
            secondaryBtn: 'Cancel'
        },
        tableEditModeAllowedKeys: ['voucherTracker', 'multipleLogin', 'roomAction']
    },

    HEADER_OPTIONS: {
        voucherTracker: 'Voucher',
        multipleLogin: 'Account',
        roomAction: 'Room',
        roomTypeAction: 'Room Type'
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
        roomAction: {
            roomno: {
                label: 'Room Number',
                placeholder: 'Enter Room Number'
            },
            floorNo: {
                label: 'Floor Number',
                placeholder: 'Enter Floor Number'
            },
            suiteName: {
                placeholder: 'Suite Type',
                label: 'Suite Type',
                readOnly: true
            },
            extraBedPrice: {
                label: 'Extra Bed Price',
                placeholder: 'Enter Extra Bed Price'
            },
            price: {
                label: 'Room Price',
                placeholder: 'Enter Room Price',
                readOnly: true
            },
            bedCount: {
                label: 'Bed Count',
                placeholder: 'Enter Bed Count'
            }
        }
    })
});

export default dialogConstants;