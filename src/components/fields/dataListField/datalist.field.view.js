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
    inputChange(props.index, value, props.data.attribute);
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
  
  // Save selected data on `Enter` key!
  function _saveSelectedData(e){
    if(e.key === 'Enter'){
      props.data.onEnter();
    }
  }
  
  // Handle Input change to metadata fields!
  function inputChange(index, value, attribute){
    props.handleInputChange(index, value, attribute);
  }
  
  return(
    <div className = "modal-gap">
      <label className = "metadata-label">{props.data?.label}</label>
      <input type="text" className="form-control" ref = {dataListFieldRef}
      placeholder={getValue()} value = {props.data.value} onClick = {() => triggerDropdown(dropdown.isOpen)} 
      onKeyPress = {(e) => _saveSelectedData(e)} onChange = {(e) => inputChange(props.index, e.target.value, props.data.attribute)} />
      {dropdown.isOpen && (
        <div className = "metadata-label">
          <DropdownField data = {getDropdownProps()} setSelected = {(value) => setSelected(value)} />
        </div>
      )}
    </div>
  )
}

export default DataList;