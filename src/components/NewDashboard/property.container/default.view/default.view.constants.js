var defaultViewConstants = Object.freeze({
  CONFIGURABLE_WIDGET_TILE: Object.freeze({
    upcomingCheckout: 'Upcoming Checkout',
    upcomingPrebook: 'Upcoming Prebook',
    favorites: 'Favorite Customers',
    history: 'Booking History',
    voucherTracker: 'Voucher Tracker',
    insights: 'Insights'
  }),

  dashboardMode: Object.freeze({
    voucherTracker: 'voucherTrackerView',
    insights: 'insights',
    tableView: 'statusTableView'
  }),

  reloadSidePanelOptions: Object.freeze({
    voucherTracker: {silent: true, mode: 'voucherList'}
  }),

  updateDashboardMode: Object.freeze({
    insights: []
  }),

  RECEP_LEVEL_WIDGETS: ['upcomingCheckout', 'upcomingPrebook', 'favorites'],
  MANAGER_LEVEL_WIDGETS: ['upcomingCheckout', 'upcomingPrebook', 'favorites', 'history', 'voucherTracker'],
  defaultViewPerspectiveConstant: 'default-view'
});

export default defaultViewConstants;