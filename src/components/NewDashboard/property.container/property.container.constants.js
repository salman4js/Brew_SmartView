var propertyContainerConstants = Object.freeze({
  DASHBOARD_MODE: Object.freeze({
    edit: 'edit',
    read: 'read',
    roomStatus: 'roomStatus',
    default: 'default',
    statusTableView: 'statusTableView',
    filterTableView: 'filterTableView'
  }),
  FORM_MODE: Object.freeze({
    checkinForm: 'checkin-form',
    checkoutForm: 'checkout-form'
  }),
  FILTERED_ROOM_STATUS_CONSTANT: 'afterCleaned',
  BUTTON_FIELDS: Object.freeze({
    cancelButton: 'Cancel',
    checkinButton: 'Check-In',
    checkoutButton: 'Continue Checkout',
    transferButton: 'Transfer Room'
  }),
  // Panel field not required dashboardMode constants array!
  IGNORE_PANEL_FIELD: ['default', 'statusTableView', 'filterTableView']
});

export default propertyContainerConstants;