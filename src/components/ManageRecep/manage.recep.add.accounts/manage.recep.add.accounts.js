import React, {useState} from 'react';
import CardView from '../../CardView/card.view/card.view';
import MetadataFields from '../../fields/metadata.fields.view';
import {addAccount} from '../manage.recep.utils/manage.recep.utils';
import {nodeConvertor, validateFieldData, _clearData} from '../../common.functions/node.convertor'

const ManageRecepAdd = (props) => {
  
  // Card view state handler!
  const [cardView, setCardView] = useState({
    header: "Add Accounts",
    height: "400px",
    _showBodyChildView : _showCardBodyView,
    footerEnabled: true,
    footerButtons: [
      {
        btnId: "Save",
        disabled: false,
        variant: "success",
        onClick: saveData
      }
    ]
  })
  
  // Add the account to the server!
  async function saveData(){
    // Validate the field data
    const isValidData = await validateFieldData(inputFields, setInputFields);
    // Get the field data in server form!
    if(isValidData.length === 0){
      const fieldData = nodeConvertor(inputFields);
      fieldData['lodge'] = props.lodgeId;
      const result = await addAccount(fieldData);
      if(result.data.success){
        const updatedField = _clearData(inputFields);
        setInputFields(updatedField); // State is taking some time to update plus, 
        // We are calling the _showBodyChildView from cardView which actually prevents the re-rendering!
        props.domRefresh();
      }
    }
  }
  
  
  // Input fields state handler!
  const [inputFields, setInputFields] = useState([
    {
      value: undefined,
      placeholder: "Enter New Username",
      label: "Username",
      name: 'username',
      attribute: 'textField',
      isRequired: true,
      inlineToast: {
        isShow: false,
        inlineMessage: 'Please enter a valid username'
      }
    },
    {
      value: undefined,
      placeholder: "Enter New Password",
      label: "Password",
      name: 'password',
      attribute: 'textField',
      isRequired: true,
      inlineToast: {
        isShow: false,
        inlineMessage: 'PLease enter a valid password'
      }
    },
    {
      value: undefined,
      label: "Choose permissions",
      placeholder: "Choose permission level authorization",
      name: 'loginAs',
      attribute: 'listField',
      noneValue: "None",
      options: [
        {
          value: "Manager Level Authorization",
          actualValue: "managerLevel"
        },
        {
          value: "Receptionist Level Authorization",
          actualValue: "receptionistLevel"
        }
      ],
      style: {
        color: "black",
        fontSize: "15px",
        paddingRight: "10px",
        paddingLeft: "10px",
        cursor: "pointer",
      }
    },
  ])
  
  
  // Show card body view!
  function _showCardBodyView(){
    return <MetadataFields data = {inputFields} updateData = {setInputFields} />
  }
  
  // Show card body view for add accounts!
  function _showCardView(){
    return(
      <CardView data = {cardView} />
    )
  }
  
  
  return(
    <div>
      {_showCardView()}
    </div>
  )
}

export default ManageRecepAdd;