import React, {useState, useEffect} from 'react';

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
    
    // Update the entire checkbox state1
    function updateCheckboxState(){
      const checkboxState = checkbox;
      checkboxState.isChecked = props.data.value;
      setCheckbox(checkboxState)
    }
    
    // When state gets updated, update the checkbox state accordingly!
    useEffect(() => {
      updateCheckboxState();
    }, [props.data])
  
  return(
    <div className = "metadata-field-checkbox" style = {props.data.customStyle}>
      {props.data.isLabelFirst ? (
        <>
          {props.data.label && (
            <label className = "form-check-label metadata-checkbox-label" style = {{color: props.data.labelColor}}>
              {props.data.label}
            </label>
          )}
          <input class="text-center" style = {{marginTop: "6px", float: 'right'}} type="checkbox" value="" checked={checkbox.isChecked} 
          onChange = {() => _toggleCheckbox(!checkbox.isChecked)} />
        </>
      ) : (
        <>
          <input class="text-center" style = {{marginTop: "6px"}} type="checkbox" value="" checked={checkbox.isChecked} 
          onChange = {() => _toggleCheckbox(!checkbox.isChecked)} />
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