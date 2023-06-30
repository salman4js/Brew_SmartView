import React, {useState} from 'react';

const CheckBox = (props) => {
  
    // Checkbox state handler!
    const [checkbox, setCheckbox] = useState({
      isChecked: false
    })
    
    // Toggle checkbox!
    function _toggleCheckbox(value){
      setCheckbox(prevState => ({...prevState, isChecked: value}))
    }
  
  return(
    <div className = "metadata-field-checkbox">
      <input class="text-center" style = {{marginTop: "6px"}} type="checkbox" value="" checked={checkbox.isChecked} onClick = {() => _toggleCheckbox(!checkbox.isChecked)} />
    </div>
  )
}

export default CheckBox;