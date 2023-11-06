var filterTableConstants = Object.freeze({
  userModelRequiredKey: ['username', 'phonenumber', 'aadharcard', 'address', 'channel', 'adults', 'childrens'],
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
  errorOnTransfer: Object.freeze({
    ERROR_ON_CHECKOUT: 'Something went wrong during the room transfer process, Please perform the checkout and checkin process manually.',
    ERROR_ON_CHECKIN: 'Something went wrong during the room transfer process, Customer has been checkedout from the current room, please perform the checkin process manually.'
  }),
  successOnTransfer: Object.freeze({
    SUCCESS_ON_TRANSFER: "Room Transfer is successfully completed!"
  }),
  tableInfoMessage: Object.freeze({
    ZERO_FILTER_MESSAGE: 'You have no filters applied to provide data!'
  })
});

export default filterTableConstants;