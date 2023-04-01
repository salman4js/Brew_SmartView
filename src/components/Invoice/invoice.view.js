import React, {useState, useEffect} from "react";

const Invoice = (props) => {

    // state to prevent useEffect from calling twice!
    var isPrint = false;

    // trigger print handler!
    function triggerPrint(){
        isPrint = true;
        window.print();
    }

    // Trigger a print everytime this components finished rendering!
    useEffect(() => {
        if(!isPrint){
            triggerPrint();
        }
    }, [])

    return (
        <div className="container invoice" style={{ height: window.innerHeight }}>
            <div id = "invoice-view">
                <div className="text-center invoice-header" id = "invoice" style={{ color: "black" }}>
                    Livixius - HMS
                </div>
                <div className="invoice-header" style={{ color: "black" }}>
                    Hey there, {props.node.customerName}
                </div>
                <p style={{ color: "black" }}>
                    This is the receipt for the payment of {props.node.amount} you made to {props.node.lodgeName}!
                </p>
                <hr />
                <table style={{ width: "100%", color: "black" }} >
                    <thead>
                        <tr>
                            <th>
                                Suite Type
                            </th>
                            <th>
                                Price Per Day
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
                            Premium
                        </td>
                        <td>
                            200
                        </td>
                        <td>
                            4
                        </td>
                        <td>
                            40
                        </td>
                        <td>
                            101
                        </td>
                    </thead>
                </table>
                <div className="invoice-total">
                    Date of check-in:
                </div>
                <div className="invoice-total">
                    Date of check-out:
                </div>
                <div className="invoice-total">
                    Payment Date:
                </div>
                <div className="invoice-total">
                    Sub Total: 4000
                </div>
                <div className="invoice-total">
                    Discount: 300
                </div>
                <div className="invoice-total">
                    Advance: 300
                </div>
                <div className="invoice-total-amount">
                    Total Amount: 900
                </div>
            </div>
        </div>
    )
}

export default Invoice;