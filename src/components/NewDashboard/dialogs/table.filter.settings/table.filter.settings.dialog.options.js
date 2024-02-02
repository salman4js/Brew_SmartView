import lang from "../dialog.constants";

function historyTableFilterOptions(){
    return [{
        value: undefined,
        placeholder: lang.TABLE_FILTER_DIALOG.history.dialogOptionsLabelAndPlaceholder.checkoutBy,
        name: 'checkoutBy',
        attribute: 'textField',
        isRequired: false
    }, {
        value: undefined,
        placeholder: lang.TABLE_FILTER_DIALOG.history.dialogOptionsLabelAndPlaceholder.checkinBy,
        name: 'checkinBy',
        attribute: 'textField',
        isRequired: false
    }, {
        value: undefined,
        placeholder: lang.TABLE_FILTER_DIALOG.history.dialogOptionsLabelAndPlaceholder.username,
        name: 'username',
        attribute: 'textField',
        isRequired: false
    }];
}

function afterCleanedFilterOptions(){
    return [{
        value: undefined,
        placeholder: lang.TABLE_FILTER_DIALOG.afterCleaned.dialogOptionsLabelAndPlaceholder.roomNo,
        name: 'roomno',
        attribute: 'textField',
        isRequired: false
    }, {
        value: undefined,
        placeholder: lang.TABLE_FILTER_DIALOG.afterCleaned.dialogOptionsLabelAndPlaceholder.floorNo,
        name: 'floorNo',
        attribute: 'textField',
        isRequired: false
    }, {
        value: undefined,
        placeholder: lang.TABLE_FILTER_DIALOG.afterCleaned.dialogOptionsLabelAndPlaceholder.suiteType,
        name: 'suiteName',
        attribute: 'textField',
        isRequired: false
    }, {
        value: undefined,
        placeholder: lang.TABLE_FILTER_DIALOG.afterCleaned.dialogOptionsLabelAndPlaceholder.bedCount,
        name: 'bedCount',
        attribute: 'textField',
        isRequired: false
    }, {
        value: undefined,
        placeholder: lang.TABLE_FILTER_DIALOG.afterCleaned.dialogOptionsLabelAndPlaceholder.pricePerDay,
        name: 'price',
        attribute: 'textField',
        isRequired: false
    }];
}

function afterCheckinFilterOptions(){
    return [{
        value: undefined,
        placeholder: lang.TABLE_FILTER_DIALOG.afterCheckin.dialogOptionsLabelAndPlaceholder.roomNo,
        name: 'roomno',
        attribute: 'textField',
        isRequired: false
    }, {
        value: undefined,
        placeholder: lang.TABLE_FILTER_DIALOG.afterCheckin.dialogOptionsLabelAndPlaceholder.floorNo,
        name: 'floorNo',
        attribute: 'textField',
        isRequired: false
    }, {
        value: undefined,
        placeholder: lang.TABLE_FILTER_DIALOG.afterCheckin.dialogOptionsLabelAndPlaceholder.suiteType,
        name: 'suiteName',
        attribute: 'textField',
        isRequired: false
    }, {
        value: undefined,
        placeholder: lang.TABLE_FILTER_DIALOG.afterCheckin.dialogOptionsLabelAndPlaceholder.bedCount,
        name: 'bedCount',
        attribute: 'textField',
        isRequired: false
    }, {
        value: undefined,
        placeholder: lang.TABLE_FILTER_DIALOG.afterCheckin.dialogOptionsLabelAndPlaceholder.pricePerDay,
        name: 'price',
        attribute: 'textField',
        isRequired: false
    }, {
        value: undefined,
        placeholder: lang.TABLE_FILTER_DIALOG.afterCheckin.dialogOptionsLabelAndPlaceholder.username,
        name: 'username',
        attribute: 'textField',
        isRequired: false
    }, {
        value: undefined,
        placeholder: lang.TABLE_FILTER_DIALOG.afterCheckin.dialogOptionsLabelAndPlaceholder.phoneNumber,
        name: 'phonenumber',
        attribute: 'textField',
        isRequired: false
    }, {
        value: undefined,
        placeholder: lang.TABLE_FILTER_DIALOG.afterCheckin.dialogOptionsLabelAndPlaceholder.checkinBy,
        name: 'checkinBy',
        attribute: 'textField',
        isRequired: false
    }, {
        value: undefined,
        placeholder: lang.TABLE_FILTER_DIALOG.afterCheckin.dialogOptionsLabelAndPlaceholder.idNumber,
        name: 'aadharcard',
        attribute: 'textField',
        isRequired: false
    }];
}


var dialogFilterOptions = {
    'history': () => historyTableFilterOptions(),
    'afterCleaned': () => afterCleanedFilterOptions(),
    'afterCheckin': () => afterCheckinFilterOptions()
};

export default dialogFilterOptions;