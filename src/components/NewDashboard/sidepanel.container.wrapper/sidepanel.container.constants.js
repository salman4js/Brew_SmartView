var sidepanelConstants = Object.freeze({
    SIDE_PANEL_MODES: Object.freeze({
        roomList: 'ROOM_LIST',
        filterList: 'FILTER_LIST',
        voucherList: 'VOUCHER_LIST',
        insightsSearchForm: 'INSIGHTS_SEARCH_FORM',
        roomTypeListPanel: 'CREATE_ROOM_ACTION'
    }),
    panelHeader: Object.freeze({
        FILTER_PANEL: 'Filter Panel',
        ROOM_LISTS: 'Rooms List',
        VOUCHER_LISTS: 'Vouchers Model',
        INSIGHTS_SEARCH_FORM: 'Insights Form',
        roomTypeListPanel: 'Room Type List'
    }),
    formMode: Object.freeze({
        READ_MODE: 'read',
        EDIT_MODE: 'edit',
        ROOM_STATUS_MODE: 'roomStatus'
    }),
    formModeConstants: Object.freeze({
       READ_MODE: 'afterCheckin',
       EDIT_MODE: 'afterCleaned'
    }),
    tableHeader: Object.freeze({
        MORE_DETAILS_HEADER: ['Floor No', 'Bed Count', 'Ext Bed Rate', 'Room Price']
    }),
    voucherListParentCollection: Object.freeze({
        outflow: {
            value: 'OutFlow',
            data: 'VOUCHER_LIST'
        }
    }),
    roomActionCollection: Object.freeze({
       roomTypeAction: {
           value: 'Room Type Collection',
           data: 'ROOM_TYPE_LIST'
       }
    }),
    TEMPLATE_LABEL: Object.freeze({
        roomno: {
            placeholder: 'Room No',
            label: 'Room No'
        },
        isOccupied: {
            placeholder: 'Currently Occupied',
            label: 'Currently Occupied',
            readOnly: true
        },
        floorNo: {
            placeholder: 'Floor No',
            label: 'Floor No'
        },
        price: {
            placeholder: 'Price Per Day',
            label: 'Price Per Day',
            readOnly: true
        },
        extraBedPrice: {
            placeholder: 'Extra Bed Price',
            label: 'Extra Bed Price',
            readOnly: true
        },
        suiteName: {
            placeholder: 'Suite Type',
            label: 'Suite Type',
            attribute: 'listField',
            options: undefined
        },
        prebookuser: {
            placeholder: 'Number of Guest Prebook',
            label: 'Number of Guest Prebook',
            readOnly: true
        },
        bedCount: {
            placeholder: 'Bed Count',
            label: 'Bed Count'
        },
        roomStatus: {
            placeholder: 'Current Room Status',
            label: 'Current Room Status',
            readOnly: true
        }
    }),
    ADD_VOUCHER: Object.freeze({
        dialogOptions: {
            header: 'Add new voucher model',
            placeholder: 'Voucher Name',
            label: 'Voucher Name',
            alertMessage: 'Please enter a valid voucher name'
        },
        footerButtons: {
            primaryBtn: 'Create',
            cancelBtn: 'Cancel'
        }
    }),
    ROOM_TYPE_CREATION: Object.freeze({
        dialogOptions: {
            header: 'Create New Room Type',
        },
        footerButtons: {
            primaryBtn: 'Create',
            secondaryBtn: 'Cancel'
        }
    }),
    ROOM_TYPE_UPDATE: Object.freeze({
        dialogOptions: {
            header: 'Edit Room Type'
        },
        footerButtons: {
            primaryBtn: 'Edit'
        }
    })
});

export default sidepanelConstants;