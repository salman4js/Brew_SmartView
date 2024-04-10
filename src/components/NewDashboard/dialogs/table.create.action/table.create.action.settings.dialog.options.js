import {addAccount} from "../../../utils/manage.recep.utils";
import CommonCrudController from "../../common.crud.controller/common.crud.controller";
import {convertServerFormat, formatCustomIntoDateFormat} from "../../../common.functions/common.functions";
import lang from "../dialog.constants";

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

function createRoomAction(options){
    return[{
        value: options?.username,
        placeholder:  lang.TABLE_CREATE_DIALOG.createRoomAction.roomno.placeholder,
        label:  lang.TABLE_CREATE_DIALOG.createRoomAction.roomno.label,
        name: 'roomno',
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
    'createRoomAction': (options) => createRoomAction(options),
    'onSave': (options) => CommonCrudController.CreateController(options)
};

export default dialogCreateOptions;