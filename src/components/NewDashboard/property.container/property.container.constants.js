var propertyContainerConstants = Object.freeze({
  DASHBOARD_MODE: Object.freeze({
    edit: 'edit',
    read: 'read',
    roomStatus: 'roomStatus',
    default: 'default',
    statusTableView: 'statusTableView',
    filterTableView: 'filterTableView',
    logTableView: 'logTableView'
  }),
  TABLE_HEADERS: Object.freeze({
    logTableView: 'Guest Log Table'
  }),
  FORM_MODE: Object.freeze({
    checkinForm: 'checkin-form',
    checkoutForm: 'checkout-form'
  }),
  BUTTON_FIELDS: Object.freeze({
    cancelButton: 'Cancel',
    checkinButton: 'Check-In',
    checkoutButton: 'Other Options',
    transferButton: 'Transfer Room'
  }),
  // Panel field not required dashboardMode constants array!
  IGNORE_PANEL_FIELD: ['default', 'statusTableView', 'filterTableView', 'logTableView']
});

export default propertyContainerConstants;