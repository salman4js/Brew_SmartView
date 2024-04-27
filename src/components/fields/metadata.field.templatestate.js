var metadataFieldTemplateState = Object.freeze({
    textField: {
        value: undefined,
        width: '500px',
        placeholder: undefined,
        label: undefined,
        name: undefined,
        isChanged: false,
        readOnly: undefined,
        customFieldIconWithToolTip: false,
        showCustomFieldIcon: function(){
          // return the view for custom field here!
        },
        customFieldIconToolTip: undefined,
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
    checkBoxField: {
        select: null,
        value: undefined,
        name: undefined,
        isChanged: false,
        attribute: 'checkBoxField',
        updateValue: true,
        restrictShow: false,
        label: undefined,
        isLabelFirst: true,
        customStyle: {}
    },
    customModal: {
        show: false,
        header: undefined,
        modalSize: 'medium', // 'xl', 'sm'
        restrictBody: false,
        showBodyItemView: function(){
            // Return a view here!
        },
        footerEnabled: false,
        footerButtons: [{
            btnId: undefined,
            variant: 'success', // 'secondary', 'primary', 'danger', 'dark'
            onClick: null
        }]
    }
});

export default metadataFieldTemplateState;