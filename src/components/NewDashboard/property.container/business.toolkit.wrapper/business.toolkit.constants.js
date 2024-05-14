const BusinessToolKitConstants = Object.freeze({
    fieldControlTemplateHeader: 'Customizable Fields',
    noConfigTemplate: 'Create your first custom config template!',
    customConfigCalc: {
        showInfo: true,
        fieldControlTemplateHeader: 'Customizable Fields',
        fieldControlCenter: [{
            name: 'advance', placeholder: 'Enter custom formula advance',
            label: 'Formula Customization', attribute: 'textField', clientName: 'Advance',
            customFieldIconWithToolTip: true
        }, {
            name: 'discount', placeholder: 'Enter custom formula discount',
            label: 'Formula Customization', attribute: 'textField', clientName: 'Discount',
            customFieldIconWithToolTip: true
        }, {
            name: 'extraBedPrice', placeholder: 'Enter custom formula extra bed price',
            label: 'Formula Customization', attribute: 'textField', clientName: 'Extra Bed Price',
            customFieldIconWithToolTip: true
        },{
            name: 'gstPrice', placeholder: "Enter custom formula for GST calculation",
            label: 'Formula Customization', attribute: 'textField', clientName: 'GST',
            customFieldIconWithToolTip: true
        },{
            name: 'totalAmount', placeholder: 'Enter custom formula for total amount',
            label: 'Formula Customization', attribute: 'textField', clientName: 'Total Amount',
            customFieldIconWithToolTip: true
        }],
        infoMessageHeader: 'IMPORTANT NOTE OF FORMULA CUSTOMIZATION:',
        infoMessageForCustomFormula: 'Values for customized formula:\n ' +
            '\nAdvance: advance' +
            '\nDiscount: discount' +
            '\nNo Of Stayed Days: noOfStayedDays' +
            '\nExtra Bed Price: extraBedPrice' +
            '\nGST percent: gstPercent' +
            '\nGST price: gst' +
            '\nAmount for stayed days: amountForStayedDays' +
            '\n' +
            '\nReplace your formula variables with these' +
            '\nvalues!' +
            '\n' +
            '\nEx: (advance + discount) * extraBedPrice' +
            '\n' +
            '\nPlease keep in mind to follow BODMAS rule!',
        infoMessage: 'Formula Customization has to be in the format of BODMAS rule to avoid calculations errors/mistakes. ' +
            '\n' +
            '\nBODMAS is an acronym that stands for:\n' +
            '\n' +
            'Brackets\n' +
            'Orders (i.e., powers and square roots, etc.)\n' +
            'Division and Multiplication (from left to right)\n' +
            'Addition and Subtraction (from left to right)\n' +
            '\n' +
            'The BODMAS rule is important because it provides a standardized order of operations for solving mathematical expressions. ' +
            '\nFollowing this rule ensures that everyone gets the same answer when evaluating mathematical expressions.\n' +
            '\n' +
            'For example, consider the expression 3+5×23+5×2. If you don\'t follow the BODMAS rule and simply solve from left to right, ' +
            '\nyou might get 16 instead of the correct answer, 13, which you get by following the BODMAS rule.\n' +
            '\n' +
            'So, BODMAS provides a clear sequence of steps to follow when solving mathematical expressions, ' +
            '\nensuring consistency and accuracy in mathematical calculations.',
    },
    customConfigReport: {
        fieldControlTemplateHeader: 'Customizable Fields',
        customFieldCreationHeader: 'Customizable Fields Creation',
        fieldControlCenter: ['Customer Name', 'Guest Phone Number', 'Guest ID Number', 'Date of Checkin',
            'Date of Checkout', 'Time of Checkin', 'Time of Checkout', 'Total Amount'],
        fieldControlCenterSequence: ['_id', 'fieldName', 'fieldCustomFormula', 'createdBy', 'enabledBy', 'comments'],
        defaultFieldsCreateBy: 'Livixius',
        createFieldOptions: {
            fieldName: {
                placeholder: 'Enter custom field name',
                label: 'Custom field name',
                invalidArguments: 'Please provide a valid arguments'
            },
            fieldCustomFormula: {
                placeholder: 'Enter custom field formula',
                label: 'Custom field formula',
                invalidArguments: 'Please provide a valid arguments'
            },
            createField: {
                btnValue: 'Create field'
            },
            resetFields: {
                btnValue: 'Reset form data'
            },
            successMessage: 'Custom report field has been created!',
            errorMessage: 'Some internal error occurred, Please try again later!'
        },
        selectFieldOptions: {
            modalHeader: 'Add Custom Fields',
            dialog: {
                btnValue: 'Apply & Save'
            }
        }
    },
    routerOptions: {
        currentRouter: 'business-toolkit',
        dashboardMode: 'businessToolKit'
    }
});

export default BusinessToolKitConstants;