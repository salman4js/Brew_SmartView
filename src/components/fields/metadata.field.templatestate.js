var metadataFieldTemplatestate = Object.freeze({
    metadataFieldState: {
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
            inlineMessage: 'Please provide a valid input.'
        }
    }
});

export default metadataFieldTemplatestate;