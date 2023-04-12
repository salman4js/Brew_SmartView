import React from 'react'

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


  return (
      <tr className = "table-view">
        <td>
          {props.checkin}
        </td>
        <td>
          {props.checkout}
        </td>
        <td>
          {(props.checkInTime === undefined || props.checkInTime === null || props.checkInTime === "") ? "Not Provided" : handleFormat(props.checkInTime)}
        </td>
        <td>
          {(props.checkOutTime === undefined || props.checkOutTime === null || props.checkOutTime === "") ? "Not Provided" : handleFormat(props.checkOutTime)}
        </td>
        <td>
          {props.username}
        </td>
        <td>
          {(props.discount === undefined || props.discount === null || props.discount === "") ? 0 : props.discount}
        </td>
        <td>
          {props.advance === undefined || props.advance === null || props.advance === "" ? 0 : props.advance}
        </td>
        <td>
          {props.roomno}
        </td>
        <td>
          {props.phonenumber}
        </td>
        <td>
          {props.adults}
        </td>
        <td>
          {props.childrens}
        </td>
        <td>
          {props.aadharcard}
        </td>
        <td>
          {props.stayeddays}
        </td>
        <td>
          {props.bill}
        </td>
        <td>
          {props.gst}
        </td>
        <td>
          {props.totalAmount}
        </td>
      </tr>
  )
}

export default TableFormatReport;