import React, { useEffect } from "react";
import brewDate from 'brew-date';
import TableHead from "../table.view/table.head.view";
import TableCell from "../table.view/table.cell.view";
import MetadataTable from '../metadata.table.view/metadata.table.view'
import { getStorage } from "../../Controller/Storage/Storage";

const Invoice = (props) => {

    // state to prevent useEffect from calling twice!
    var isPrint = false;

    // Retrieve area and email from local storage!
    const area = getStorage("area");
    const emailId = getStorage("emailId");
    const loggedInAsRecep = JSON.parse(getStorage("loggedInAsRecep"));

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
    
    // Common customer details!
    function customerDetails(){
      return(
        <div className = "invoice-total">
          <p>
            Customer Name: {props.node.customerDetails.customername}
          </p>
          <p>
            Phone Number: {props.node.customerDetails.phonenumber}
          </p>
        </div>
      )
    }
    
    // Receipt details!
    function receiptDetails(){
      return(
        <div className = "invoice-total" style = {{float: 'right', paddingRight: '5px'}}>
          <p>
            Receipt Date: {brewDate.getFullDate("dd/mm/yyyy")}
          </p>
        </div>
      )
    }
    
    // Common description table!
    function _showDescriptionTable(){
      return(
        <div className = "invoice-total">
          <p>
            Description Table:
          </p>
          <MetadataTable data = {props.node} />
        </div>
      )
    }
    
    // Receipt total amount!
    function _receiptTotalAmount(){
      return(
        <div className ="invoice-total" style = {{float: 'right', paddingRight: '5px'}}>
          <p>
            Total Amount: {props.node.totalAmount}
          </p>
        </div>
      )
    }
    
    // Common invoice header!
    function renderInvoiceHeader(){
      return(
        <div className="text-center invoice-header" id="invoice" style={{ color: "black", cursor: "pointer" }} onClick={() => navigateBack()}>
            {getStorage("lodge-name")}
            <br />
            <p>
                Mobile Number: {getStorage("owner-number")}, Email: {getStorage('emailId')}
            </p>
            <p>
                {getStorage('area')}
            </p>
            <div className="text-center row">
                <p className="col">
                    GSTIN: {getStorage("gstin")}
                </p>
                <p className="col">
                    PAN: {getStorage("pan")}
                </p>
            </div>
        </div>
      )
    }

    // Tax invoice renderer!
    function invoiceRendererDetails() {

        return (
            <div className="left-align">
                <div>
                    Name: {props.node.customerName}
                </div>
                <div>
                    Phone Number: {props.node.phoneNumber}
                </div>
                <div>
                    Address: {props.node.address}
                </div>
                <div>
                    GSTIN: {props.node.gstin}
                </div>
            </div>
        )
    }

    function invoiceRenderer() {
        return (
            <div>
                <div>
                    Invoice No: {props.node.receiptId} / {props.node.dateofCheckout}
                </div>
                <div>
                    Invoide Date: {props.node.dateofCheckout}
                </div>
            </div>
        )
    }

    // SAC code renderer!
    function sacCode() {
        return (
            <div className="text-center invoice-total invoice-header-name">
                SAC Code
                <div className="table-view-bill-line"></div>                
                <div className="text-center invoice-total">
                    996311
                </div>
            </div>
        )
    }

    // Amount renderer!
    function amountRenderer() {
        return (
            <div className="text-center invoice-total invoice-header-name">
                Amount
                <div className="table-view-bill-line"></div>                
                <div className="invoice-total">
                    <p>
                        Total Taxable Value: {props.node.roomRent}
                    </p>
                    {props.node.igst && (
                        <p>
                            IGST {props.node.gstPercent * 100 + "%"} : {props.node.gst} 
                        </p>
                    )}
                    {props.node.cgst && (
                        <div>
                            <p>
                                CGST {(props.node.gstPercent * 100 / 2) + "%"} : {+props.node.gst / 2}
                            </p>
                            <p>
                                SGST {(props.node.gstPercent * 100 / 2) + "%"} : {+props.node.gst / 2}
                            </p>
                        </div>
                    )}
                    <div className="table-view-bill-line"></div>                
                    <p>
                        Grand Total: {props.node.amount()}
                    </p>
                </div>
            </div>
        )
    }

    // Trigger a print everytime this components finished rendering!
    useEffect(() => {
        if (!isPrint) {
            triggerPrint();
        }
    }, [])

        return (
            <div>
              {/* Bill Generation */}
              {props.node.tInvoice && (
                <div className="container invoice" style={{ height: window.innerHeight }}>
                    <div id="invoice-view">
                        <div className="text-center invoice-header" id="invoice" style={{ color: "black", cursor: "pointer" }} onClick={() => navigateBack()}>
                            Hotel {props.node.lodgeName}
                            <p>
                                Mobile Number: {getStorage("owner-number")}, Email: {emailId}
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
                        <div className="invoice-header" style={{ color: "black" }}>
                            Payment Id: {props.node.receiptId}
                            <br />
                            Cashier: {loggedInAsRecep ? getStorage("loggedInUser") + "(Receptionist)" : getStorage("loggedInUser") + "(Manager)"}
                        </div>
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
                                    {props.node && props.node.isGst && <TableHead text = "GST" />}
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
                                {props.node && props.node.isGst && <TableCell text = {props.node.gst} />}
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
                        {props.node && props.node.isGst && (
                            <div className="invoice-total">
                                GST: {props.node.gst}
                            </div>
                        )}
                        <div className="invoice-total-amount">
                            Total Amount: {props.node.amount()}
                        </div>
                    </div>
                </div>
              )}
              
              {/* Tax invoice */}
              {props.node.invoice && (
                <div className="container invoice">
                    {renderInvoiceHeader()}
                    <div className=" text-center invoice-total main-invoice-header" style={{ fontWeight: "bold" }}>
                        TAX INVOICE
                    </div>
                    <div className="row invoice-total">
                        <div className="col surround-border">
                            {invoiceRendererDetails()}
                        </div>
                        <div className="col surround-border">
                            {invoiceRenderer()}
                        </div>
                    </div>
                    <div className="row invoice-customer-details">
                        <div className="col surround-border">
                            <div className="invoice-total invoice-header-name">
                                Room Accomodation services
                                <div className="table-view-bill-line"></div>                        
                            </div>
                            <p className="invoice-total">
                                Date of check-in: {props.node.dateofCheckIn}
                            </p>
                            <p className="invoice-total">
                                Date of check-out: {props.node.dateofCheckout}
                            </p>
                            <p className="invoice-total">
                                Payment Date: {props.node.dateofCheckout}
                            </p>
                        </div>
                        <div className="col surround-border">
                            {sacCode()}
                        </div>
                        <div className="col surround-border">
                            {amountRenderer()}
                        </div>
                        <div className = "surround-border" style = {{width: "100%"}}>
                            <div className = "authorized-sign">
                                <div className = "text-center invoice-total">
                                    {getStorage("owner-name")}
                                    <div className = "invoice-total">
                                        Authorized Signatory
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className = "invoice-total text-center">
                        COMPUTER GENERATED INVOICE
                    </div>
                </div>
              )}
              
              {/* Receipt Generation */}
              {props.node.isReceipt && (
                <div className = "container invoice" style = {{height: window.innerHeight}}>
                  {renderInvoiceHeader()}
                  <div className = "invoice-header">
                    <div className="row receipt-generation-container">
                        <div className="col">
                           {customerDetails()}
                        </div>
                        <div className="col">
                          {receiptDetails()}
                        </div>
                    </div>
                  </div>
                  <div className = "receipt-generation-container">
                    {_showDescriptionTable()}
                    {_receiptTotalAmount()}
                  </div>
                </div>
              )}
              
            </div>
        )
}

export default Invoice;