import React, {useEffect} from 'react'

const Table = (props) => {

    return (
        <tr>
            <th>
                {props.dishName}
            </th>
            <th>
                {props.quantity}
            </th>
            <th>
                {props.dishRate}
            </th>
        </tr>
    )
}

export default Table;