import React from "react";
import TableCell from "../../table.view/table.cell.view";

const RoomModel = (props) => {

    return(
       <tr>
        <TableCell text = {props.node.suiteType} />
        <TableCell text = {props.node.price} />
        {props.isExtra && (
            <TableCell text = {props.node.extraBedPrice} />
        )}
       </tr>
    )
}

export default RoomModel;