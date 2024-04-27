const BusinessToolkitConstants = Object.freeze({
    modalOptions: {
        customConfigCalc: {
            header: 'Create New Custom Calculation Workspace',
            centered: true,
            modalSize: 'medium',
            footerEnabled: true,
            footerButtons: [{
                btnId: 'Create',
                variant: 'success',
                onClick: null
            }],
            creationFailure: 'Some internal error occurred, Please try again later.',
            creationSuccess: 'Custom config has been created!'
        }
    },
    fieldOptions: {
        customConfigCalc: [{
            value: undefined,
            placeholder: 'Enter new custom calculation config name',
            name: 'configName',
            isChanged: false,
            readOnly: undefined,
            attribute: 'textField', // Default set to textField, this will change according to the field set.
            isRequired: true,
            inlineToast: {
                isShow: false,
                inlineToastColor: 'red',
                inlineMessage: 'Please provide a valid input.'
            }
        }]
    }
});

export default BusinessToolkitConstants;