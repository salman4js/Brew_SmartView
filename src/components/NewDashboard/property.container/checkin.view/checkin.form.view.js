import React, {useState, useEffect} from 'react';
import { checkInFormValue } from './checkin.form.utils';
import brewDate from 'brew-date';
import MetadataFields from '../../../fields/metadata.fields.view';
import CustomModal from '../../../CustomModal/custom.modal.view';
import { activityLoader } from '../../../common.functions/common.functions.view';
import { getTimeDate, formatDate } from '../../../common.functions/common.functions';
import { nodeConvertor, validateFieldData, _clearData, _enableInlineToast } from '../../../common.functions/node.convertor';
import { getStorage } from '../../../../Controller/Storage/Storage';


const CheckinForm = (props) => {
  
  // Property container state handler!
  const [propertyContainer, setPropertyContainer] = useState({
    isLoading: false,
    customModal: false,
    navigateToProperty: false
  });
  
  // Custom modal state handler!
  const [customModalState, setCustomModalState] = useState({
    show: false,
    onHide: onCloseCustomModal,
    header: 'New guest has been checked-in.',
    centered: false,
    restrictBody: true,
    modalSize: "medium",
    footerEnabled: false,
  });

  // Checkin form fields state handler!
  const [checkinFields, setCheckinFields] = useState([
    {
      value: new Date(),
      width: '500px',
      placeholder: "Checkin Date",
      label: "Date of Check-In",
      name: 'checkin',
      attribute: 'dateField',
      isRequired: true,
      inlineToast: {
        isShow: false,
        inlineMessage: 'Please provide a valid input.'
      }
    },
    {
      value: new Date(),
      width: '500px',
      defaultValue: new Date(),
      placeholder: "Checkout Date",
      label: "Date of Check-Out",
      name: 'checkout',
      attribute: 'dateField',
      isRequired: true,
      inlineToast: {
        isShow: false,
        inlineMessage: 'Please provide a valid input.'
      }
    },
    {
      value: undefined,
      width: '500px',
      placeholder: "Customer Name",
      label: "Customer Name",
      name: 'customername',
      attribute: 'textField',
      isRequired: true,
      inlineToast: {
        isShow: false,
        inlineMessage: 'Please provide a valid input.'
      }
    },
    {
      value: undefined,
      width: '500px',
      placeholder: "Phone Number",
      label: "Phone Number",
      name: 'phonenumber',
      attribute: 'textField',
      isRequired: true,
      inlineToast: {
        isShow: false,
        inlineMessage: 'Please provide a valid input.'
      }
    },
    {
      value: undefined,
      width: '500px',
      placeholder: "Second Phone Number",
      label: "Second Phone Number",
      name: 'secondphonenumber',
      attribute: 'textField',
      isRequired: false
    },
    {
      value: undefined,
      width: '500px',
      placeholder: "Address",
      label: "Address",
      name: 'address',
      attribute: 'textField',
      isRequired: true,
      inlineToast: {
        isShow: false,
        inlineMessage: 'Please provide a valid input.'
      }
    }
  ]);
  
  // Customizable fields state handler!
  const [customizableFields, setCustomizableFields] = useState([
    {
      value: undefined,
      width: '500px',
      placeholder: "Advance Amount",
      label: "Advance Amount",
      name: 'advance',
      attribute: 'textField',
      isRequired: false
    },
    {
      value: undefined,
      width: '500px',
      placeholder: "Discount Amount",
      label: "Discount Amount",
      name: 'discount',
      attribute: 'textField',
      isRequired: false
    },
    {
      value: undefined,
      width: '500px',
      placeholder: "Adults",
      label: "Adults Count",
      name: 'adults',
      attribute: 'textField',
      isRequired: true,
      inlineToast: {
        isShow: false,
        inlineMessage: 'Please provide a valid input.'
      }
    },
    {
      value: undefined,
      width: '500px',
      defaultValue: '0',
      placeholder: "Childrens",
      label: "Childrens Count",
      name: 'childrens',
      attribute: 'textField',
      isRequired: false
    },
    {
      value: undefined,
      width: '500px',
      placeholder: "Aadhar Number",
      label: "Aadhar Number",
      name: 'aadhar',
      attribute: 'textField',
      isRequired: true,
      inlineToast: {
        isShow: false,
        inlineMessage: 'Please provide a valid input.'
      }
    },
    {
      value: 'Walk-In',
      restrictShow: checkCustomizableFields('isChannel'),
      width: '500px',
      placeholder: "Choose the preferred channel manager",
      label: "Channel Manager",
      name: 'channel',
      attribute: 'listField',
      isRequired: false,
      options: [
        {
          value: "Make My Trip"
        },
        {
          value: "Oyo"
        },
        {
          value: 'Walk-In'
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
    {
      value: undefined,
      restrictShow: checkCustomizableFields('updatePrice'),
      width: '500px',
      placeholder: "Update Room Price",
      label: "Update Room Price",
      name: 'updatePrice',
      attribute: 'textField',
      isRequired: false
    }
  ]);
  
  // Check customizable fields!
  function checkCustomizableFields(field){
    return !JSON.parse(getStorage(field));
  }
    
  // Get field events!
  function getFieldData(value){
    return nodeConvertor(value);
  };
  
  // Toggle property container loader!
  function _toggleLoader(value){
    setPropertyContainer(prevState => ({...prevState, isLoading: value}));
  };
  
  // trigger custom modal!
  function _triggerCustomModal(value){
    setPropertyContainer(prevState => ({...prevState, customModal: value, navigateToProperty: true}));
    setCustomModalState(prevState => ({...prevState, show: value}));
  }
  
  // Checkin form view!
  function _checkinFormView(){
    if(propertyContainer.isLoading){
      var opts = {
        color: "black",
        marginTop: (props.height / 2.5) + "px",
        textCenter: true
      }
      return activityLoader(opts);
    } else {
      return(
        <>
          <div className = 'dashboard-container-fields-header'>
            Check-In Form
          </div>
          <div className = 'row'>
            <div className = 'col'>
              <MetadataFields data = {checkinFields} updateData = {setCheckinFields} />
            </div>
            <div className = 'col'>
              <MetadataFields data = {customizableFields} updateData = {setCustomizableFields} />
            </div>
          </div>
        </>
      )
    }
  };
  
  // Render custom modal!
  function _renderCustomModal(){
    return <CustomModal modalData = {customModalState} />
  };

  // On form save event!
  async function onFormSave(){
    const isFormValid = await validateFieldData(checkinFields, setCheckinFields);
    if(isFormValid.length === 0){
      _toggleLoader(true);
      const formValue = getFieldData(checkinFields); // Default input fields!
      const customizableFormValues = getFieldData(customizableFields); // Customizable form values!
      customizableFormValues['isChannel'] = customizableFormValues.channel !== 'Walk-In' ? true : false; // This params is needed when dealing with channel manager!
      const updatedFormValue = updateDefaultFormValue(formValue);
      const finalFormValue = Object.assign(formValue, customizableFormValues); // Final form value ready to be sent to the server!
      const serverResult = await checkInFormValue(finalFormValue);
      if(serverResult.data.success){
        _toggleLoader(false);
        _triggerCustomModal(true);
      }
    }
  };
  
  // Update default form values!
  function updateDefaultFormValue(formValue){
    var timeDate = getTimeDate();
    formValue.checkin = brewDate.getFullDate("yyyy/mm/dd");
    formValue.checkout = formatDate(formValue.checkout);
    formValue['checkinTime'] = timeDate.getTime;
    formValue['checkoutTime'] = formValue.checkout !== undefined ? timeDate.getTime : undefined;
    formValue['isPrebook'] = false;
    formValue['dateTime'] = brewDate.getFullDate("dd/mmm") +  " " + brewDate.timeFormat(brewDate.getTime());
    formValue['roomid'] = props.data.roomModel._id;
    formValue['roomno'] = props.data.roomModel.roomno;
    formValue['lodgeId'] = props.params.accIdAndName[0];
    return formValue;
  };
  
  // After form has been saved!
  function onCloseCustomModal(){
    _triggerCustomModal(false);
    props.afterFormSave({reloadSidepanel: true}); // Change the screen to property container dashboard
    // and pass the controller options!
  };
  
  // Listeners!
  useEffect(() => {
    props.data.onFormSave && onFormSave(); // this method will get triggered by property container!
  }, [props.data])
  
  return(
    <div className = "dashboard-container-fields-view" style = {{height: props.height - 1}}>
      {_checkinFormView()}
      {propertyContainer.customModal && _renderCustomModal()}
    </div>
  )
}

export default CheckinForm;