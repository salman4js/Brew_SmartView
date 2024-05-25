var defaultViewConstants = Object.freeze({
  CONFIGURABLE_WIDGET_TILE: Object.freeze({
    upcomingCheckout: 'Upcoming Checkout',
    upcomingPrebook: 'Upcoming Prebook',
    favorites: 'Favorite Customers',
    history: 'Booking History',
    voucherTracker: 'Voucher Tracker',
    insights: 'Insights',
    multipleLogin: 'Manage Accounts',
    roomAction: 'Create Properties',
    businessToolKit: 'Business Tool-Kit',
    customReport: 'Report Section'
  }),

  CLIENT_WIDGET_TILE: Object.freeze({
    roomAction: {noCountWidget: true},
    businessToolKit: {noCountWidget: true},
    customReport: {noCountWidget: true}
  }),

  CLIENT_WIDGET_TILE_VIEWCLASS: Object.freeze({
    multipleLogin: 'bi bi-book widget-tile-body widget-icon',
    roomAction: 'bi bi-building widget-tile-body widget-icon',
    businessToolKit: 'bi bi-terminal-plus',
    customReport: 'bi bi-journal-check'
  }),

  dashboardMode: Object.freeze({
    voucherTracker: 'voucherTrackerView',
    insights: 'insights',
    tableView: 'statusTableView'
  }),

  reloadSidePanelOptions: Object.freeze({
    voucherTracker: {
      sidepanelOptions: {silent: true, mode: 'voucherList'},
      dashboardMode: 'voucherTrackerView'
    },
    insights: {
      sidepanelOptions: {silent: true, mode: 'insightsSearchForm'},
      dashboardMode: 'insights'
    },
    roomAction: {
      sidepanelOptions: {silent: true, mode: 'roomTypeListPanel'},
      dashboardMode: 'roomAction'
    },
    businessToolKit: {
      sidepanelOptions: {silent: true, mode: 'businessToolKit'},
      dashboardMode: 'businessToolKit'
    },
    customReport: {
      sidepanelOptions: {silent: true, mode: 'customReport'},
      dashboardMode: 'customReport'
    }
  }),

  RECEP_LEVEL_WIDGETS: ['upcomingCheckout', 'upcomingPrebook', 'favorites'],
  MANAGER_LEVEL_WIDGETS: ['upcomingCheckout', 'upcomingPrebook', 'favorites', 'history', 'voucherTracker'],
  defaultViewPerspectiveConstant: 'default-view',
  detailsMessage: 'Here\'s the brief idea of what\'s going on in your property!',
  administrativeDetailsMessage: 'Here\'s your administrative business workspace!',
  blockActionsMessage: 'Preparing Dashboard...'
});

export default defaultViewConstants;