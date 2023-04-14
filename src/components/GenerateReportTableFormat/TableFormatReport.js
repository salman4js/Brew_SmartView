import React from 'react';
import TableCell from '../table.view/table.cell.view';

const TableFormatReport = (props) => {

  // Handle Time Format!
  function handleFormat(time){
    try{
      const [hour, minutes] = time.split(":");
      var min = minutes.length > 1 ? minutes : "0" + minutes;
      if(hour > 12){
        const time = hour - 12 + ":" + min + " PM";
        return time;
      } else if(hour == 0) {
        const time = 12 + ":" + min + " AM";
        return time
      } else {
        const time = hour + ":" + min + " AM";
        return time;
      }
    } catch(err){
      console.error("Time format has been introduced in recent builds")
    }
  }

  // Customize report generation handler!
  function customizeReport(value){
    const result = props.customTable(value);
    return result;
  }


  return (
      <tr className = "table-view">
        {customizeReport("checkinDate") && <>
          <TableCell text = {props.checkin} />
        </>}
        {customizeReport("checkoutDate") && <TableCell text = {props.checkout} />}
        {customizeReport("checkinTime") && <TableCell text = {(props.checkInTime === undefined || props.checkInTime === null || props.checkInTime === "") ? "Not Provided" : handleFormat(props.checkInTime)} /> }
        {customizeReport("checkoutTime") && <TableCell text = {(props.checkOutTime === undefined || props.checkOutTime === null || props.checkOutTime === "") ? "Not Provided" : handleFormat(props.checkOutTime)} />}
        {customizeReport("customerName") && <TableCell text = {props.username} />}
        {customizeReport("discount") && <TableCell text = {(props.discount === undefined || props.discount === null || props.discount === "") ? 0 : props.discount} />}
        {customizeReport("advance") && <TableCell text = {props.advance === undefined || props.advance === null || props.advance === "" ? 0 : props.advance} />}
        {customizeReport("roomno") && <TableCell text = {props.roomno} />}
        {customizeReport("phoneNumber") && <TableCell text = {props.phonenumber} />}
        {customizeReport("adults") && <TableCell text = {props.adults} />}
        {customizeReport("childrens") && <TableCell text = {props.childrens} />}
        {customizeReport("aadhar") && <TableCell text = {props.aadharcard} />}
        {customizeReport("days" && <TableCell text = {props.stayeddays} />)}
        {customizeReport("roomRent") && <TableCell text = {props.bill} />}
        {customizeReport("GST") && <TableCell text = {props.isGst ? props.gst : "Not Provided"} />}
        {customizeReport("totalAmount") && <TableCell text = {props.isGst ? props.totalAmount : props.bill} />}
      </tr>
  )
}

export default TableFormatReport;