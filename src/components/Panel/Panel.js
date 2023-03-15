import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import PanelFooter from './PanelFooter';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Panel = (props) => {

  // State handler for the date picker!
  const [date, setDate] = useState({
    date1: undefined,
    date2: undefined
  })

  // Handle Value for the date picker!
  function handleValue(){
    props.date1(date.date1);
    props.date2(date.date2);
    // Call the API function to get data!
    props.getData(date);
  }

  return(
    props.config === "DatePicker" ? (
        <div>
          <Modal.Body className = {props.className}>
          {props.text}
          <div className = "row">
            <div className = "col">
              <DatePicker className = "form-control" selected = {date.date1} placeholder = "Choose Starting Date" onChange= {(e) => setDate({...date, date1: e})} dateFormat='y-MM-dd' />
            </div>
            <div className = "col">
              <DatePicker className = "form-control" selected={date.date2} placeholder = "Choose Ending Date" onChange = {(e) => setDate({...date, date2: e})} dateFormat='y-MM-dd' />
            </div>
          </div>
      </Modal.Body>
      <PanelFooter success = "Search" failure = "Cancel" onSuccess = {() => handleValue()} onFailure = {() => props.handleDrop()} />
        </div>
    ) : (
      <Modal.Body className = {props.className}>
        {props.text} 
      </Modal.Body>
    )
  )
}

export default Panel;