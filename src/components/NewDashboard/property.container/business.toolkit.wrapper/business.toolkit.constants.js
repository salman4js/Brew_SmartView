const BusinessToolKitConstants = Object.freeze({
    fieldControlTemplateHeader: 'Customizable Fields',
    noConfigTemplate: 'Create your first custom config template!',
    customConfigCalc: {
        showInfo: true,
        fieldControlTemplateHeader: 'Customizable Fields',
        infoMessageHeader: 'IMPORTANT NOTE OF FORMULA CUSTOMIZATION:',
        infoMessageForCustomFormula: 'Values for customized formula:\n ' +
            '\nAdvance: advance' +
            '\nDiscount: discount' +
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
    }
});

export default BusinessToolKitConstants;