import React, {useState, useEffect} from 'react';
import _ from 'lodash';

const CheckBox = (props) => {

    // Checkbox state handler!
    const [checkbox, setCheckbox] = useState({
      isChecked: props.data.value
    })

    // Toggle checkbox!
    function _toggleCheckbox(value){
      setCheckbox(prevState => ({...prevState, isChecked: value}));
      props.data.select && props.data.select(value, props.checkboxIndex) // Send the checkbox value to the parent component!
      props.data.updateValue && props.handleInputChange && props.handleInputChange(props.index, value, props.data.attribute)
    }

    // Is checkbox already selected.
    function isCheckboxSelected(){
        if(props.checkboxIndex && props.data.selectedCheckboxIndex){
            return props.data.selectedCheckboxIndex.includes(props.checkboxIndex);
        } else {
            return checkbox.isChecked;
        }
    }

    // Is checkbox disabled.
    function isCheckboxDisabled(){
        if(props.checkboxIndex && props.data.disabledCheckboxIndex){
            return props.data.disabledCheckboxIndex.includes(props.checkboxIndex);
        } else {
            return false;
        }
    };

    // Update the entire checkbox state1
    function updateCheckboxState(){
      const checkboxState = checkbox;
      checkboxState.isChecked = props.data.value;
      setCheckbox(checkboxState)
    }
    
    // When state gets updated, update the checkbox state accordingly!
    useEffect(() => {
      updateCheckboxState();
    }, [props.data, props.data.value])
  
  return(
    <div className = "metadata-field-checkbox brew-cursor" style = {props.data.customStyle}>
      {props.data.isLabelFirst ? (
        <>
          {props.data.label && (
            <label className = "form-check-label metadata-checkbox-label" style = {{color: props.data.labelColor}}>
              {props.data.label}
            </label>
          )}
          <input className="text-center brew-cursor" style = {{marginTop: "6px", float: 'right'}} type="checkbox" disabled = {isCheckboxDisabled()} value="" checked={isCheckboxSelected()}
          onChange = {() => _toggleCheckbox(!isCheckboxSelected())} />
        </>
      ) : (
        <>
          <input className="text-center brew-cursor" style = {{marginTop: "6px"}} type="checkbox" disabled = {isCheckboxDisabled()} value="" checked={isCheckboxSelected()}
          onChange = {() => _toggleCheckbox(!isCheckboxSelected())} />
          {props.data.label && (
            <label className = "form-check-label metadata-checkbox-label" style = {{color: props.data.labelColor}}>
              {props.data.label}
            </label>
          )}
        </>
      )}
    </div>
  )
}

export default CheckBox;