var defaultViewConstants = Object.freeze({
  CONFIGURABLE_WIDGET_TILE: Object.freeze({
    upcomingCheckout: 'Upcoming Checkout',
    upcomingPrebook: 'Upcoming Prebook',
    favorites: 'Favorite Customers',
    history: 'Booking History'
  }),

  RECEP_LEVEL_WIDGETS: ['upcomingCheckout', 'upcomingPrebook', 'favorites'],
  MANAGER_LEVEL_WIDGETS: ['upcomingCheckout', 'upcomingPrebook', 'favorites', 'history']
});

export default defaultViewConstants;