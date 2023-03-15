import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Panel = (props) => {

  // State handler for the date picker!
  const [date, setDate] = useState({
    date1: undefined,
    date2: undefined
  })

  return(
    props.config === "DatePicker" ? (
        <Modal.Body className = {props.className}>
          {props.text}
          <div className = "row">
            <div className = "col">
              <DatePicker className = "form-control" placeholder = "Choose Starting Date" onChange= {(e) => setDate({...date, date1: e})} dateFormat='y-MM-dd' />
            </div>
            <div className = "col">
              <DatePicker className = "form-control" placeholder = "Choose Ending Date" onChange = {(e) => setDate({...date, date2: e})} dateFormat='y-MM-dd' />
            </div>
          </div>
      </Modal.Body>
    ) : (
      <Modal.Body className = {props.className}>
        {props.text} 
      </Modal.Body>
    )
  )
}

export default Panel;