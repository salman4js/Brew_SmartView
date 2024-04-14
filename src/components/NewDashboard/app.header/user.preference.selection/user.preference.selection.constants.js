import {getStorage} from "../../../../Controller/Storage/Storage";

var UserPreferenceSelectionConstants = Object.freeze({
    userPreferenceCheckboxCustomStyle: {
        color: 'black',
        border: '1px solid grey',
        backgroundColor: '#EDEADE',
        padding: '5px 5px 5px 5px',
        borderRadius: '5px',
        marginTop: '10px',
        marginBottom: '10px'
    },
    userPreferenceFieldValue: {
        upcomingCheckout: {
            label: 'Enable Upcoming Checkout'
        },
        upcomingPrebook: {
            label: 'Enable Upcoming Prebook'
        },
        favorites: {
            label: 'Enable Favorites'
        },
        history: {
            label: 'Enable History'
        },
        insights: {
            label: 'Enable Insights',
            restrictShow: !(JSON.parse(getStorage('isInsights')))
        },
        voucherTracker: {
            label: 'Enable Voucher Tracker',
            restrictShow: !(JSON.parse(getStorage('is-linked-with-vouchers')))
        },
        administrativePageEnabled: {
            label: 'Switch to administrative landing page',
            restrictShow: JSON.parse(getStorage('loggedInAsRecep')),
            isAdminAction: true
        },
        datesBetweenCount: {
            label: 'Enable Dates Between',
            attribute: 'stepperButtonField'
        }
    },
    preferenceSaveButtonKey: 'Apply & Save',
});

export default UserPreferenceSelectionConstants;