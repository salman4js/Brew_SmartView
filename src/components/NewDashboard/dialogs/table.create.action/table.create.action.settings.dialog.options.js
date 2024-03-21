import {addVoucherModelList} from "../../../utils/vouchers.utils";
import {convertServerFormat, formatCustomIntoDateFormat} from "../../../common.functions/common.functions";

function voucherTrackerCreateOptions(options){
    return [
        {
            value: options?.dateTime || new Date(),
            defaultValue: options?.dateTime || new Date(),
            placeholder: "Date",
            label: "Date",
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
            placeholder: "Particulars",
            label: "Particulars",
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
            placeholder: "Cash Mode",
            label: "Cash Mode",
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
            placeholder: "Receipt",
            label: "Receipt",
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
            placeholder: "Payment",
            label: "Payment",
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
}


var dialogCreateOptions = {
    'voucherTracker': (options) => voucherTrackerCreateOptions(options),
    'onSave': {
        'voucherTracker': (options) => addVoucherModelList(options)
    }
};

export default dialogCreateOptions;