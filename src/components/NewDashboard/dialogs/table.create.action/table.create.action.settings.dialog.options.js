import CommonCrudController from "../../common.crud.controller/common.crud.controller";
import {convertServerFormat, formatCustomIntoDateFormat} from "../../../common.functions/common.functions";
import lang from "../dialog.constants";
import CollectionInstance from "../../../../global.collection/widgettile.collection/widgettile.collection";

function voucherTrackerCreateOptions(options){
    return [
        {
            value: options?.dateTime || new Date(),
            defaultValue: options?.dateTime || new Date(),
            placeholder: lang.TABLE_CREATE_DIALOG.voucherTracker.date,
            label: lang.TABLE_CREATE_DIALOG.voucherTracker.date,
            name: 'dateTime',
            attribute: 'dateField',
            conversionInFieldConvertor: false,
            conversionInNodeConvertor: true,
            conversionMethod: function(value){
                return convertServerFormat(formatCustomIntoDateFormat(value));
            },
            isRequired: false,
            inlineToast: {
                isShow: false,
                inlineMessage: 'Please provide a valid input.'
            }
        },
        {
            value: options?.particulars,
            placeholder: lang.TABLE_CREATE_DIALOG.voucherTracker.particulars,
            label: lang.TABLE_CREATE_DIALOG.voucherTracker.cashMode,
            name: 'particulars',
            attribute: 'textField',
            isRequired: true,
            inlineToast: {
                isShow: false,
                inlineMessage: 'Please provide a valid input.'
            }
        },
        {
            value: options?.cashMode,
            placeholder: lang.TABLE_CREATE_DIALOG.voucherTracker.cashMode,
            label: lang.TABLE_CREATE_DIALOG.voucherTracker.cashMode,
            name: 'cashMode',
            attribute: 'textField',
            isRequired: true,
            inlineToast: {
                isShow: false,
                inlineMessage: 'Please provide a valid cash mode.'
            }
        },
        {
            value: options?.receipt,
            defaultValue: 0,
            placeholder: lang.TABLE_CREATE_DIALOG.voucherTracker.receipt,
            label: lang.TABLE_CREATE_DIALOG.voucherTracker.receipt,
            name: 'receipt',
            dependentValue: 'payment',
            updateIsRequiredOnDependentValue: true,
            attribute: 'textField',
            isRequired: true,
            inlineToast: {
                isShow: false,
                inlineMessage: 'Please provide a valid receipt.'
            }
        },
        {
            value: options?.payment,
            defaultValue: 0,
            placeholder: lang.TABLE_CREATE_DIALOG.voucherTracker.payment,
            label: lang.TABLE_CREATE_DIALOG.voucherTracker.payment,
            name: 'payment',
            dependentValue: 'receipt',
            updateIsRequiredOnDependentValue: true,
            attribute: 'textField',
            isRequired: true,
            inlineToast: {
                isShow: false,
                inlineMessage: 'Please provide a valid payment.'
            }
        }
    ]
};

function multipleLoginCreateOptions(options){
    return [{
        value: options?.username,
        placeholder:  lang.TABLE_CREATE_DIALOG.multipleLogin.username.placeholder,
        label:  lang.TABLE_CREATE_DIALOG.multipleLogin.username.placeholder,
        name: 'username',
        attribute: 'textField',
        isRequired: true,
        inlineToast: {
            isShow: false,
            inlineMessage: 'Please provide a valid payment.'
        }
    }, {
        value: options?.password,
        placeholder: lang.TABLE_CREATE_DIALOG.multipleLogin.password.placeholder,
        label:  lang.TABLE_CREATE_DIALOG.multipleLogin.password.label,
        name: 'password',
        attribute: 'textField',
        isRequired: true,
        inlineToast: {
            isShow: false,
            inlineMessage: 'Please provide a valid payment.'
        }
    }, {
        value: options?.loginAs,
        placeholder: lang.TABLE_CREATE_DIALOG.multipleLogin.loginAs.placeholder,
        label: lang.TABLE_CREATE_DIALOG.multipleLogin.loginAs.placeholder,
        name: 'loginAs',
        attribute: 'listField',
        options: lang.TABLE_CREATE_DIALOG.multipleLogin.loginAs.listFieldOptions,
        isRequired: true,
        inlineToast: {
            isShow: false,
            inlineMessage: 'Please provide a valid payment.'
        }
    }]
};

function roomAction(options){
    return[{
        value: options?.roomno,
        placeholder:  lang.TABLE_CREATE_DIALOG.roomAction.roomno.placeholder,
        label: lang.TABLE_CREATE_DIALOG.roomAction.roomno.label,
        name: 'roomno',
        attribute: 'textField',
        isRequired: true,
        inlineToast: {
            isShow: false,
            inlineMessage: 'Please provide a valid payment.'
        }
    }, {
        value: options?.floorNo,
        placeholder: lang.TABLE_CREATE_DIALOG.roomAction.floorNo.placeholder,
        label: lang.TABLE_CREATE_DIALOG.roomAction.floorNo.label,
        name: 'floorNo',
        attribute: 'textField',
        isRequired: true,
        inlineToast: {
            isShow: false,
            inlineMessage: 'Please provide a valid payment.'
        }
    }, {
        value: options?.suiteName,
        placeholder: lang.TABLE_CREATE_DIALOG.roomAction.suiteName.placeholder,
        label: lang.TABLE_CREATE_DIALOG.roomAction.suiteName.label,
        name: 'suiteName',
        attribute: 'listField',
        options: CollectionInstance.getAttribute('roomTypes', 'suiteType'),
        isRequired: true,
        inlineToast: {
            isShow: false,
            inlineMessage: 'Please provide a valid payment.'
        }
    }, {
        value: options?.extraBedPrice,
        placeholder: lang.TABLE_CREATE_DIALOG.roomAction.extraBedPrice.placeholder,
        label: lang.TABLE_CREATE_DIALOG.roomAction.extraBedPrice.label,
        name: 'extraBedPrice',
        attribute: 'textField',
        isRequired: true,
        inlineToast: {
            isShow: false,
            inlineMessage: 'Please provide a valid payment.'
        }
    }, {
        value: options?.price,
        placeholder: lang.TABLE_CREATE_DIALOG.roomAction.price.placeholder,
        label: lang.TABLE_CREATE_DIALOG.roomAction.price.label,
        name: 'price',
        attribute: 'textField',
        readOnly: lang.TABLE_CREATE_DIALOG.roomAction.price.readOnly,
        isRequired: true,
        inlineToast: {
            isShow: false,
            inlineMessage: 'Please provide a valid payment.'
        }
    }, {
        value: options?.bedCount,
        placeholder: lang.TABLE_CREATE_DIALOG.roomAction.bedCount.placeholder,
        label: lang.TABLE_CREATE_DIALOG.roomAction.bedCount.label,
        name: 'bedCount',
        attribute: 'textField',
        isRequired: true,
        inlineToast: {
            isShow: false,
            inlineMessage: 'Please provide a valid payment.'
        }
    }]
};


var dialogCreateOptions = {
    'voucherTracker': (options) => voucherTrackerCreateOptions(options),
    'multipleLogin': (options) => multipleLoginCreateOptions(options),
    'roomAction': (options) => roomAction(options),
    'onSave': (options) => CommonCrudController.CreateController(options)
};

export default dialogCreateOptions;