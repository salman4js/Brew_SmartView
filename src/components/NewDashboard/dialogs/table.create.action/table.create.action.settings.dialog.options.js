import {addVoucherModelList} from "../../../vouchers/vouchers.utils";
import {convertServerFormat, formatCustomIntoDateFormat} from "../../../common.functions/common.functions";

function voucherTrackerCreateOptions(){
    return [
        {
            value: new Date(),
            defaultValue: new Date(),
            placeholder: "Date",
            label: "Date",
            name: 'dateTime',
            attribute: 'dateField',
            conversionField: true,
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
            value: undefined,
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
            value: undefined,
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
            value: undefined,
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
            value: undefined,
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
    'voucherTracker': () => voucherTrackerCreateOptions(),
    'onSave': {
        'voucherTracker': (options) => addVoucherModelList(options)
    }
};

export default dialogCreateOptions;