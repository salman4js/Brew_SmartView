var propertyContainerConstants = Object.freeze({
  DASHBOARD_MODE: Object.freeze({
    edit: 'edit',
    read: 'read',
    roomStatus: 'roomStatus',
    default: 'default',
    statusTableView: 'statusTableView',
    filterTableView: 'filterTableView',
    logTableView: 'logTableView',
    paymentTrackerView: 'paymentTrackerView',
    propertyReadView: 'propertyReadView',
    propertyEditView: 'propertyEditView',
    customHTMLView: 'customHtmlView',
  }),
  TABLE_HEADERS: Object.freeze({
    logTableView: 'Guest Log Table',
    paymentTrackerView: 'Payment Tracker Table'
  }),
  FORM_MODE: Object.freeze({
    checkinForm: 'checkin-form',
    checkoutForm: 'checkout-form'
  }),
  BUTTON_FIELDS: Object.freeze({
    cancelButton: 'Cancel',
    checkinButton: 'Check-In',
    checkoutButton: 'Other Options',
    transferButton: 'Transfer Room',
    editButton: 'Edit Properties'
  }),
  WIDGET_CONSTANTS: Object.freeze({
    customHtmlView: 'History Preview',
    propertyReadView: 'Edit Room Properties'
  }),
  // Panel field not required dashboardMode constants array!
  IGNORE_PANEL_FIELD: ['default', 'statusTableView', 'filterTableView', 'logTableView', 'paymentTrackerView'],
  ALLOW_PANEL_FIELD: ['edit', 'read'],
  IGNORE_PANEL_FIELD_DROPDOWN: ['statusTableView', 'roomStatus', 'customHtmlView'],
  propertyContainerPerspectiveConstant: 'property-container'
});

export default propertyContainerConstants;