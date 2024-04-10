var defaultViewConstants = Object.freeze({
  CONFIGURABLE_WIDGET_TILE: Object.freeze({
    upcomingCheckout: 'Upcoming Checkout',
    upcomingPrebook: 'Upcoming Prebook',
    favorites: 'Favorite Customers',
    history: 'Booking History',
    voucherTracker: 'Voucher Tracker',
    insights: 'Insights',
    multipleLogin: 'Manage Accounts',
    createRoomAction: 'Create Properties'
  }),

  CLIENT_WIDGET_TILE: Object.freeze({
    createRoomAction: {noCountWidget: true}
  }),

  CLIENT_WIDGET_TILE_VIEWCLASS: Object.freeze({
    multipleLogin: 'bi bi-book widget-tile-body widget-icon',
    createRoomAction: 'bi bi-building widget-tile-body widget-icon'
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
    createRoomAction: {
      sidepanelOptions: {silent: true, mode: 'roomTypeListPanel'},
      dashboardMode: 'createRoomAction'
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