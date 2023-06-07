import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {formatDateToCustomFormat} from '../../common.functions/common.functions'

const DateField = (props) => {
  
  // Get selected date in the date-picker understandable format!
  function getSelectedDate(){
    return formatDateToCustomFormat(props.data.value)
  }

  return(
    <div className = "modal-gap">
        <label style={{ color: "black" }}> {props.data.placeholder} </label>
        <DatePicker style={{ color: "black" }} className="form-control" placeholderText={props.data.placeholder} 
        selected = {getSelectedDate()} dateFormat='y-MM-dd' minDate={new Date()}
        onChange={((e) => props.handleInputChange(props.index, e))} isClearable />
    </div>
  )
  
}

export default DateField;