var metadataFieldTemplateState = Object.freeze({
    textField: {
        value: undefined,
        width: '500px',
        placeholder: undefined,
        label: undefined,
        name: undefined,
        readOnly: undefined,
        attribute: 'textField', // Default set to textField, this will change according to the field set.
        isRequired: true,
        inlineToast: {
            isShow: false,
            inlineToastColor: 'red',
            inlineMessage: 'Please provide a valid input.'
        }
    },
    buttonField: {
        btnValue: '',
        onClick: function(){

        },
        isDark: true,
        occupyFullSpace: true,
        customClass: undefined,
        attribute: 'buttonField'
    },
    checkboxField: {
        select: null,
        value: undefined,
        name: undefined,
        attribute: 'checkBoxField',
        updateValue: true,
        restrictShow: false,
        label: undefined,
        isLabelFirst: true,
        customStyle: {}
    }
});

export default metadataFieldTemplateState;