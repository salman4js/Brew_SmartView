var filterTableConstants = Object.freeze({
  userModelRequiredKey: ['username', 'phonenumber', 'aadharcard', 'address', 'channel', 'adults', 'childrens', 'checkinBy'],
  channelManager: 'Walk-In',
  tableInfoMessage: Object.freeze({
    ZERO_STATE_MESSAGE: 'You have no records for this table!',
    ZERO_FILTER_MESSAGE: 'You have no filters applied to provide data!'
  }),
  promptTransferDialog: Object.freeze({
    header: (details) => `Are you sure to move this customer from ${details.currentRoom} to ${details.nextRoom}`,
    footerButtons: {
      cancelBtn: 'Cancel',
      transferBtn: 'Yes, Transfer'
    }
  }),
  promptCheckInDialog: Object.freeze({
    header: 'Favorites Guest Check-In',
    footerButtons: {
      cancelBtn: 'Cancel',
      transferBtn: 'Yes, Check-In'
    }
  }),
  promptErrorDialog: Object.freeze({
    header: (details) => `You are about to transfer this guest from ${details.currentRoomType} type to ${details.nextRoomType} type. 
                                  Do you want to change any ${details.nextRoom}'s room properties before transfer operation?`,
    footerButtons: {
      cancelBtn: 'Cancel and Transfer',
      editPropsBtn: 'Edit Properties'
    }
  }),
  errorOnTransfer: Object.freeze({
    ERROR_ON_CHECKOUT: 'Something went wrong during the room transfer process, Please perform the checkout and checkin process manually.',
    ERROR_ON_CHECKIN: 'Something went wrong during the room transfer process, Customer has been checkedout from the current room, please perform the checkin process manually.'
  }),
  successOnTransfer: Object.freeze({
    SUCCESS_ON_TRANSFER: "Room Transfer is successfully completed!"
  }),
  columnState: Object.freeze({
    DEFAULT_COLUMN_STATE: 'DEFAULT',
    FILTER_COLUMN_STATE: 'FILTER',
    CHECKIN_COLUMN_STATE: 'CHECK-IN'
  })
});

export default filterTableConstants;