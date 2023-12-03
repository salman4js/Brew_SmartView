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
        cancelFooterBtn: 'Cancel',
        primaryFooterBtn: 'Select Room'
    },

    PropertySearchKey: Object.freeze({
        user: ['afterCheckin', 'upcomingCheckout', 'upcomingPrebook'],
        _id: ['afterCheckedout', 'afterCleaned']
    }),

    ROOM_TRANSFER: Object.freeze({
        filteredRoomStatusConstant: 'afterCleaned',
        dashboardMode: 'filterTableView'
    }),

    isCommandsEnabled: Object.freeze({
        goToLocation: ['afterCheckin',  'upcomingCheckout', 'upcomingPrebook', 'afterCheckedout', 'afterCleaned'],
        roomTransfer: ['afterCheckin', 'upcomingCheckout'],
        favoritesCheckin: ['favorites']
    })
});

export default commandsConstant;