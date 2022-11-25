import React from 'react'

const TableFormatReport = (props) => {
  return (
      <tr>
        <td>
          {props.checkin}
        </td>
        <td>
          {props.checkout}
        </td>
        <td>
          {props.username}
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