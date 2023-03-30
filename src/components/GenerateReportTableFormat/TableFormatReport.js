import React from 'react'

const TableFormatReport = (props) => {
  return (
      <tr className = "table-view">
        <td>
          {props.checkin}
        </td>
        <td>
          {props.checkout}
        </td>
        <td>
          {props.bill}
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
      </tr>
  )
}

export default TableFormatReport;