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
    voucherTrackerView: 'voucherTrackerView',
    insights: 'insights',
    roomAction: 'roomAction',
    propertyReadView: 'propertyReadView',
    propertyEditView: 'propertyEditView',
    customHTMLView: 'customHtmlView',
    multipleLogin: 'multipleLogin'
  }),
  TABLE_HEADERS: Object.freeze({
    logTableView: 'Guest Log Table',
    paymentTrackerView: 'Payment Tracker Table'
  }),
  FORM_MODE: Object.freeze({
    checkinForm: 'checkin-form',
    checkoutForm: 'checkout-form',
    insightsForm: 'Weekly Report'
  }),
  BUTTON_FIELDS: Object.freeze({
    cancelButton: 'Cancel',
    checkinButton: 'Check-In',
    checkoutButton: 'Other Options',
    transferButton: 'Transfer Room',
    editButton: 'Edit Properties',
    saveButton: 'Save Properties'
  }),
  WIDGET_CONSTANTS: Object.freeze({
    customHtmlView: 'History Preview',
    propertyReadView: '',
    propertyEditView: '',
    insights: 'Insights'
  }),
  PROPERTY_VIEW: Object.freeze({
    propertyRoom: 'property-room',
    propertyUser: 'property-user'
  }),
  PERSPECTIVE_CONSTANT: Object.freeze({
    insights: 'insights-view'
  }),
  PANEL_FIELD_VALUES: Object.freeze({
    edit: [{
      value: 'checkin-form'
    }],
    read: [{
      value: 'checkout-form'
    }, {
      value: 'Payment Tracker',
      actualValue: 'paymentTrackerView'
    }, {
      value: 'Maintenance Log',
      actualValue: 'logTableView'
    }]
  }),
  reloadDashboardControllerOpts: {
    insights: {
      dashboardMode: 'insights'
    }
  },
  // Panel field not required dashboardMode constants array!
  IGNORE_PANEL_FIELD: ['default', 'statusTableView', 'filterTableView',
    'logTableView', 'paymentTrackerView', 'voucherTrackerView', 'multipleLogin', 'roomAction'],
  ALLOW_PANEL_FIELD: ['edit', 'read'],
  IGNORE_PANEL_FIELD_DROPDOWN: ['statusTableView', 'roomStatus', 'customHtmlView'],
  propertyContainerPerspectiveConstant: 'property-container'
});

export default propertyContainerConstants;