import React, {useState} from 'react';

const CheckBox = (props) => {
    
    // Checkbox state handler!
    const [checkbox, setCheckbox] = useState({
      isChecked: props.data.value
    })

    // Toggle checkbox!
    function _toggleCheckbox(value){
      setCheckbox(prevState => ({...prevState, isChecked: value}));
      props.data.select(value, props.checkboxIndex) // Send the checkbox value to the parent component!
    }
  
  return(
    <div className = "metadata-field-checkbox">
      <input class="text-center" style = {{marginTop: "6px"}} type="checkbox" value="" checked={checkbox.isChecked} 
      onChange = {() => _toggleCheckbox(!checkbox.isChecked)} />
    </div>
  )
}

export default CheckBox;