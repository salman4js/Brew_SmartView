import CommonUtils from "../../common.crud.controller/common.crud.controller";
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
            label: lang.TABLE_CREATE_DIALOG.voucherTracker.particulars,
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
    },  {
        value: options?.extraBedPrice,
        placeholder: lang.TABLE_CREATE_DIALOG.roomAction.extraBedPrice.placeholder,
        label: lang.TABLE_CREATE_DIALOG.roomAction.extraBedPrice.label,
        name: 'extraBedPrice',
        attribute: 'textField',
        isRequired: true,
        readOnly: true,
        inlineToast: {
            isShow: false,
            inlineMessage: 'Please provide a valid payment.'
        }
    }, {
        value: options?.suiteType,
        placeholder: lang.TABLE_CREATE_DIALOG.roomAction.suiteName.placeholder,
        label: lang.TABLE_CREATE_DIALOG.roomAction.suiteName.label,
        name: 'suiteName',
        attribute: 'textField',
        readOnly: lang.TABLE_CREATE_DIALOG.roomAction.suiteName.readOnly
    }, {
        value: options?.price,
        placeholder: lang.TABLE_CREATE_DIALOG.roomAction.price.placeholder,
        label: lang.TABLE_CREATE_DIALOG.roomAction.price.label,
        name: 'price',
        attribute: 'textField',
        readOnly: lang.TABLE_CREATE_DIALOG.roomAction.price.readOnly
    }]
};

function roomTypeAction(options){
    return[{
        value: options?.suiteType,
        placeholder: lang.TABLE_CREATE_DIALOG.roomAction.suiteName.placeholder,
        label: lang.TABLE_CREATE_DIALOG.roomAction.suiteName.label,
        name: 'suiteType',
        attribute: 'textField',
    }, {
        value: options?.extraBedPrice,
        placeholder: lang.TABLE_CREATE_DIALOG.roomAction.extraBedPrice.placeholder,
        label: lang.TABLE_CREATE_DIALOG.roomAction.extraBedPrice.label,
        name: 'extraBedPrice',
        attribute: 'textField'
    }, {
        value: options?.price,
        placeholder: lang.TABLE_CREATE_DIALOG.roomAction.price.placeholder,
        label: lang.TABLE_CREATE_DIALOG.roomAction.price.label,
        name: 'price',
        attribute: 'textField',
    }]
};

function customConfigReportCreateAction(options){
    return[{
        value: options?.fieldName,
        name: 'fieldName',
        label: lang.TABLE_CREATE_DIALOG.customConfigReport.fieldName.label,
        placeholder: lang.TABLE_CREATE_DIALOG.customConfigReport.fieldName.placeholder,
        attribute: 'textField',
        isRequired: true,
        inlineToast: {
            isShow: false,
            inlineMessage: 'Please provide a valid payment.'
        }
    }, {
        value: options?.fieldCustomFormula,
        name: 'fieldCustomFormula',
        label: lang.TABLE_CREATE_DIALOG.customConfigReport.fieldCustomFormula.label,
        placeholder: lang.TABLE_CREATE_DIALOG.customConfigReport.fieldCustomFormula.placeholder,
        attribute: 'textField',
        isRequired: true,
        customFieldIconWithToolTip: true,
        customFieldIconToolTip: lang.TABLE_CREATE_DIALOG.customConfigReport.toolTipOptions._getToolTipMessage,
        customFieldIconToolTipPlacement: 'right',
        showCustomFieldIcon: () => {
          return (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="30" fill="black"
                   className="bi bi-info-circle-fill" viewBox="0 0 16 1">
                  <path
                      d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>
              </svg>
          )
        },
        inlineToast: {
            isShow: false,
            inlineMessage: 'Please provide a valid payment.'
        }
    }, {
        value: options?.comments,
        name: 'comments',
        label: lang.TABLE_CREATE_DIALOG.customConfigReport.comments.label,
        placeholder: lang.TABLE_CREATE_DIALOG.customConfigReport.comments.placeholder,
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
    'roomTypeAction': (options) => roomTypeAction(options),
    'customConfigReport': (options) => customConfigReportCreateAction(options),
    'onSave': (options) => CommonUtils.dispatchRequest(options),
};

export default dialogCreateOptions;