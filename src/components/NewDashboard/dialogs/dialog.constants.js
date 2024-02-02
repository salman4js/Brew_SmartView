var dialogConstants = Object.freeze({
    TABLE_FILTER: {
        tableFilterLabel: 'Filter Options',
        footerButtons: {
            primaryBtn: 'Filter',
            secondaryBtn: 'Cancel'
        },
        tableFilterAllowedKeys: ['history', 'afterCleaned', 'afterCheckin']
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
});

export default dialogConstants;