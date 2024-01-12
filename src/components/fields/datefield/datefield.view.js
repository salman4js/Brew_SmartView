import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getStyle } from '../../common.functions/common.functions'

const DateField = (props) => {
  
  // Get selected date in the date-picker understandable format!
  function getSelectedDate(){
    return props.data.value !== undefined ? new Date(props.data.value) : new Date();
  }
  
  // Get max date!
  function getMaxDate(){
    return new Date(props.data.maxDate)
  }
  

  return(
    <div className = "modal-gap" style = {getStyle(props.data.style)}>
        <label style={{ color: "black" }}> {props.data.label} </label>
        <DatePicker style={{ color: "black" }} className="form-control" placeholderText={props.data.placeholder} 
        selected = {getSelectedDate()} dateFormat={props.data.dateFormat} minDate={new Date()} maxDate= {getMaxDate()}
         showTimeSelect = {props.data.showTimeSelect} excludeDates = {props.data.excludeDates}
        onChange={((e) => props.handleInputChange(props.index, e, props.data.attribute))} isClearable />
    </div>
  )
  
}

export default DateField;