import {getStorage} from "../../../Controller/Storage/Storage";

const appHeaderConstants = Object.freeze({
    userPreferenceConstants: {
        header: 'User Settings'
    },
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
            restrictShow: !JSON.parse(getStorage('isInsights'))
        },
        voucherTracker: {
            label: 'Enable Voucher Tracker',
            restrictShow: !JSON.parse(getStorage('is-linked-with-vouchers'))
        },
        multipleLogin: {
            label: 'Enable Manage Accounts',
            restrictShow: !JSON.parse(getStorage('multipleLogin'))
        },
        datesBetweenCount: {
            label: 'Enable Dates Between'
        }
    },
    preferenceSaveButtonKey: 'Apply & Save',
    constantKey: 'app-header'
});

export default appHeaderConstants;