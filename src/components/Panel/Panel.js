import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import PanelFooter from './PanelFooter';
import DatePicker from 'react-datepicker';
import Picker from '../Dashboard/Chart/MonthPicker/Picker';
import 'react-datepicker/dist/react-datepicker.css';

const Panel = (props) => {

  // State handler for the date picker!
  const [date, setDate] = useState({
    date1: undefined,
    date2: undefined
  })

  // Handle Value for the date picker!
  function handleValue() {
    if (props.isWeek) {
      // Call the API function to get data!
      props.getWeekData(date);
    } else {
      props.getMonthData()
    }
  }

  if (props.config === "DatePicker") {
    if (props.isWeek) {
      return (
        <div>
          <Modal.Body className={props.className}>
            {props.text}
            <div className="row">
              <div className="col">
                <DatePicker className="form-control" selected={date.date1} placeholder="Choose Starting Date" onChange={(e) => setDate({ ...date, date1: e })} dateFormat='y-MM-dd' />
              </div>
              <div className="col">
                <DatePicker className="form-control" selected={date.date2} placeholder="Choose Ending Date" onChange={(e) => setDate({ ...date, date2: e })} dateFormat='y-MM-dd' />
              </div>
            </div>
          </Modal.Body>
          <PanelFooter success="Search" failure="Cancel" onSuccess={() => handleValue()} onFailure={() => props.handleDrop()} />
        </div>
      )
    }

    if (props.isMonth) {
      return (
        <div className={props.className}>
          <Picker _year={(data) => props._year(data)} _month={(data) => props._month(data)} />
          <PanelFooter success="Search" failure="Cancel" onSuccess={() => handleValue()} onFailure={() => props.handleDrop()} />
        </div>
      )
    }

  } else {
    return (
      <div>
        <Modal.Body className={props.className}>
          {props.text}
        </Modal.Body>
      </div>
    )
  }
}

export default Panel;