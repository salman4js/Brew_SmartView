import React, { useEffect } from "react";
import { getStorage } from "../../Controller/Storage/Storage";

const Invoice = (props) => {

    // state to prevent useEffect from calling twice!
    var isPrint = false;

    // Retrieve area and email from local storage!
    const area = getStorage("area");
    const emailId = getStorage("emailId");

    // navigate back to home page!
    function navigateBack() {
        props.onHide()
    }

    // trigger print handler!
    function triggerPrint() {
        isPrint = true;
        window.print();
        navigateBack()
    }

    // Trigger a print everytime this components finished rendering!
    useEffect(() => {
        if (!isPrint) {
            triggerPrint();
        }
    }, [])

    return (
        <div className="container invoice" style={{ height: window.innerHeight }}>
            <div className="invoice-view-back-generator" onClick={() => navigateBack()}>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="bi bi-arrow-left" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                    </svg>
                </div>
            </div>
            <div id="invoice-view">
                <div className="text-center invoice-header" id="invoice" style={{ color: "black", cursor: "pointer" }} onClick={() => navigateBack()}>
                    Hotel {props.node.lodgeName}
                    <p>
                        {emailId}
                    </p>
                    <p>
                        {area}
                    </p>
                </div>
                <div className="invoice-header" style={{ color: "black" }}>
                    Hey there, {props.node.customerName}
                </div>
                <p style={{ color: "black" }}>
                    This is the receipt for the payment of {props.node.amount()} you made to {props.node.lodgeName}!
                </p>
                <hr />
                <table style={{ width: "100%", color: "black" }} >
                    <thead>
                        <tr>
                            <th>
                                Room Rent
                            </th>
                            <th>
                                Days Stayed
                            </th>
                            <th>
                                GST
                            </th>
                            <th>
                                Room No
                            </th>
                        </tr>
                        <td>
                            {props.node.roomRent}
                        </td>
                        <td>
                            {props.node.stayedDays}
                        </td>
                        <td>
                            {props.node.gst}
                        </td>
                        <td>
                            {props.node.roomno}
                        </td>
                    </thead>
                </table>
                <div className="invoice-total">
                    Date of check-in: {props.node.dateofCheckIn}
                </div>
                <div className="invoice-total">
                    Date of check-out: {props.node.dateofCheckout}
                </div>
                <div className="invoice-total">
                    Payment Date: {props.node.dateofCheckout}
                </div>
                <div className="invoice-total">
                    Sub Total: {props.node.roomRent}
                </div>
                <div className="invoice-total">
                    Discount: {props.node.discount}
                </div>
                <div className="invoice-total">
                    Advance: {props.node.advance}
                </div>
                <div className = "invoice-total">
                    GST: {props.node.gst}
                </div>
                <div className="invoice-total-amount">
                    Total Amount: {props.node.amount()}
                </div>
            </div>
        </div>
    )
}

export default Invoice;