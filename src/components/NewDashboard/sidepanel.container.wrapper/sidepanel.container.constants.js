var sidepanelConstants = Object.freeze({
    panelHeader: Object.freeze({
        FILTER_PANEL: 'Filter Panel',
        ROOM_LISTS: 'Rooms List'
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
    })
});

export default sidepanelConstants;