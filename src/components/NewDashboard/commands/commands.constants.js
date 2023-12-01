var commandsConstant = Object.freeze({
    goToLocationCommand: 'Go to room',
    roomTransferCommand: 'Transfer Guest',

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
        roomTransfer: ['afterCheckin', 'upcomingCheckout']
    })
});

export default commandsConstant;