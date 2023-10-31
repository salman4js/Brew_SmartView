var MetadataModelState = {
  maintainanceLogInput: [{
    value: undefined,
    placeholder: "Add New Log Price",
    name: 'price',
    attribute: 'textField',
    isRequired: true,
    inlineToast: {
      isShow: false,
      inlineMessage: 'Please provide a valid input.'
    },
  }, {
    value: undefined,
    placeholder: "Add Log Comments",
    name: 'priceLog',
    attribute: 'textField',
    isRequired: true,
    inlineToast: {
      isShow: false,
      inlineMessage: 'Please provide a valid input.'
    }
  }, {
    select: null,
    value: undefined,
    name: 'isPaid',
    attribute: 'checkBoxField',
    updateValue: true,
    label: 'Amount Paid',
    isLabelFirst: true,
    customStyle: {
      color: 'black',
      border: '1px solid grey',
      backgroundColor: '#EDEADE',
      padding: '5px 5px 5px 5px',
      borderRadius: '5px',
      marginBottom: '20px'
    }
  }, {
    value: undefined,
    placeholder: "Choose Log Type",
    name: 'priceType',
    attribute: 'listField',
    noneValue: "None",
    options: undefined,
    style: {
      color: "black",
      fontSize: "15px",
      paddingRight: "10px",
      paddingLeft: "10px",
      cursor: "pointer",
    }
  }]
};

export default MetadataModelState;