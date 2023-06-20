import React, {useState, useRef} from 'react';
import DropdownField from '../dropdownField/dropdown.field.view';
import { getStyle } from '../../common.functions/common.functions'


const DataList = (props) => {
  
  // State handler for datalist field dropdown action!
  const [dropdown, setDropdown] = useState({
    isOpen: false,
    selected: undefined
  });
  
  // Set the selected value from the dropdown field!
  function setSelected(value){
    setDropdown(prevState => ({...prevState, selected: value}));
    props.handleInputChange(props.index, value, props.data.attribute);
  }
  
  // Reference for input field!
  const dataListFieldRef = useRef(null);
  
  // Get the width of the input field!
  function getInputFieldWidth(){
    return dataListFieldRef.current.offsetWidth;
  }
  
  // Get the data needed for the dropdown field!
  function getDropdownProps(){
    const data = props.data;
    data.style['width'] = getInputFieldWidth() + "px";
    return data;
  }
  
  // Get value for the placeholder!
  function getValue(){
    return props.data.value !== undefined ? props.data.value : props.data.placeholder;
  }
  
  // Initiate dropdown!
  function triggerDropdown(currentState){
    setDropdown(prevState => ({...prevState, isOpen: !currentState}));
  }
  
  return(
    <div className = "modal-gap">
      <label className = "metadata-label">{props.data?.label}</label>
      <input type="text" className="form-control" ref = {dataListFieldRef}
      placeholder={getValue()} onClick = {() => triggerDropdown(dropdown.isOpen)} />
      {dropdown.isOpen && (
        <div className = "metadata-label">
          <DropdownField data = {getDropdownProps()} setSelected = {(value) => setSelected(value)} />
        </div>
      )}
    </div>
  )
}

export default DataList;