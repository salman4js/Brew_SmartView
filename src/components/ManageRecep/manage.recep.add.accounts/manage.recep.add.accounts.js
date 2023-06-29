import React, {useState} from 'react';
import CardView from '../../CardView/card.view/card.view';
import MetadataFields from '../../fields/metadata.fields.view';

const ManageRecepAdd = (props) => {
  
  // Card view state handler!
  const [cardView, setCardView] = useState({
    header: "Add Accounts",
    height: "380px",
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
  function saveData(){
    
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
        inlineMessage: 'Enter a valid username'
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
        inlineMessage: 'Enter a valid password'
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
          value: "Manager Level Authorization"
        },
        {
          value: "Receptionist Level Authorization"
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