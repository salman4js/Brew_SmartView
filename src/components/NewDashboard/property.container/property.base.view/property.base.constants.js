var propertyBaseConstants = Object.freeze({
    READ_VIEW_HEADER: {
        'property-room': 'Room Properties',
        'property-user': 'Edit Customer Details'
    },
    EDIT_VIEW_HEADER: {
        'property-room': 'Edit Room Properties',
        'property-user': 'Edit Customer Details'
    },
    VIEW_CONSTANT: 'property-container',
    PERSPECTIVE_CONSTANT: 'propertyView',
    PROPERTY_ERROR_MSG: Object.freeze({
        'property-room': [{status: 'error', message: 'Occupied room cannot be edited'}]
    }),
    PROPERTY_SAVE_MODAL_OPTS: Object.freeze({
        'property-room': {
            show: true,
            centered: false,
            restrictBody: true,
            footerEnabled: false,
            header: undefined,
            onHide: undefined,
            onHideOptions: {reloadSidepanel: {silent: true}, action: 'EDIT'}
        }
    })
});

export default propertyBaseConstants;