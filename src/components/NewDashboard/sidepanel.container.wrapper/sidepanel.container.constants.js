var sidepanelConstants = Object.freeze({
    SIDE_PANEL_MODES: Object.freeze({
        roomList: 'ROOM_LIST',
        filterList: 'FILTER_LIST',
        voucherList: 'VOUCHER_LIST',
        insightsSearchForm: 'INSIGHTS_SEARCH_FORM'
    }),
    panelHeader: Object.freeze({
        FILTER_PANEL: 'Filter Panel',
        ROOM_LISTS: 'Rooms List',
        VOUCHER_LISTS: 'Vouchers Model',
        INSIGHTS_SEARCH_FORM: 'Insights Form'
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
        // inflow: {
        //     value: 'InFlow',
        //     data: 'ROOM_LIST'
        // },
        outflow: {
            value: 'OutFlow',
            data: 'VOUCHER_LIST'
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
            label: 'Price Per Day'
        },
        extraBedPrice: {
            placeholder: 'Extra Bed Price',
            label: 'Extra Bed Price',
            readOnly: true
        },
        suiteName: {
            placeholder: 'Room Type',
            label: 'Room Type',
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
    })
});

export default sidepanelConstants;