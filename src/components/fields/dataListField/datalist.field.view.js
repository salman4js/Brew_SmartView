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
  function setSelected(value, actualValue){
    setDropdown(prevState => ({...prevState, selected: value}));
    triggerDropdown(dropdown.isOpen); // Close the dropdown when the value is selected!
    var metadataVal = {value: value, actualValue: actualValue}; // This will help incase if we have to perform any data computation.
    // Data computation with original constant value is hard, actualValue provides like a key structure to solve this usecase.
    inputChange(props.index, metadataVal, props.data.attribute);
  }
  
  // Reference for input field!
  const dataListFieldRef = useRef(null);
  
  // Get the width of the input field!
  function getFieldWidth(){
    return dataListFieldRef.current.offsetWidth;
  }
  
  // Get the data needed for the dropdown field!
  function getDropdownProps(){
    const data = props.data;
    data.style['width'] = props.data.width !== undefined ? props.data.width : getFieldWidth() + "px";
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
      props.data.onEnter && props.data.onEnter();
    }
  }
  
  // Handle Input change to metadata fields!
  function inputChange(index, value, attribute){
    props.handleInputChange(index, value, attribute);
  }
  
  return(
    <div>
      {props.data.allowInputField && (
        <div className = "modal-gap">
          <label className = "metadata-label">{props.data?.label}</label>
          <input type="text" className="form-control" ref = {dataListFieldRef}
          placeholder={getValue()} value = {props.data.value} onClick = {() => triggerDropdown(dropdown.isOpen)} 
          onKeyPress = {(e) => _saveSelectedData(e)} onChange = {(e) => inputChange(props.index, e.target.value, props.data.attribute)} />
        </div>
      )}
      {props.data.allowPanelField && (
        <div className = "metadata-panel-helper" style = {{height: props.data?.height + "px", paddingLeft: '10px'}}>
          <span className = "metadata-panel-helper-options brew-cursor" onClick = {() => triggerDropdown(dropdown.isOpen)}
           ref = {dataListFieldRef} style = {{width: props.data?.width}}>
            {props.data.value !== undefined ? props.data.value : props.data.selectedValue}
            <span className = "metadata-panel-helper-options-drodown">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-bar-down" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M1 3.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5zM8 6a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 .708-.708L7.5 12.293V6.5A.5.5 0 0 1 8 6z"/>
              </svg>
            </span>
          </span>
          {props.data.allowRightSideControl && (
            <span className = 'metadata-datalistfield-control-center'>
              {props.data.rightSideControl && props.data.rightSideControl()}
            </span>
          )}
        </div>
      )}
      {props.data.customPanelField && (
        <div className = 'metadata-panel-helper' style = {getStyle(props.data.style)}>
          <span className = 'metadata-panel-helper-options brew-cursor' style = {{width: props.data?.width}}>
            {props.data.renderCustomPanelField && props.data.renderCustomPanelField()}
          </span>
          {props.data.allowRightSideControl && (
            <span className = 'metadata-datalistfield-control-center'>
              {props.data.rightSideControl && props.data.rightSideControl()}
            </span>
          )}
        </div>
      )}
      {dropdown.isOpen && (
        <div className = "metadata-label">
          <DropdownField data = {getDropdownProps()} setSelected = {(value, actualValue) => setSelected(value, actualValue)} />
        </div>
      )}
    </div>
  )
}

export default DataList;