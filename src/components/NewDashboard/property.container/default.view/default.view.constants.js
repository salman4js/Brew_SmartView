var defaultViewConstants = Object.freeze({
  CONFIGURABLE_WIDGET_TILE: Object.freeze({
    upcomingCheckout: 'Upcoming Checkout',
    upcomingPrebook: 'Upcoming Prebook',
    favorites: 'Favorite Customers',
    history: 'Booking History',
    voucherTracker: 'Voucher Tracker'
  }),

  reloadSidePanelOptions: Object.freeze({
    'Voucher Tracker': {silent: true, mode: 'voucherList'}
  }),

  RECEP_LEVEL_WIDGETS: ['upcomingCheckout', 'upcomingPrebook', 'favorites'],
  MANAGER_LEVEL_WIDGETS: ['upcomingCheckout', 'upcomingPrebook', 'favorites', 'history', 'voucherTracker'],
  defaultViewPerspectiveConstant: 'default-view'
});

export default defaultViewConstants;