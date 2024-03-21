import React, { useEffect } from "react";
import _ from 'lodash';
import brewDate from 'brew-date';
import TableHead from "./table.view/table.head.view";
import TableCell from "./table.view/table.cell.view";
import MetadataTable from '../metadata.table.view/metadata.table.view';
import { getStorage } from "../../Controller/Storage/Storage";
import {convertQueryParamsIntoObjects} from "../common.functions/node.convertor";

const Invoice = (props) => {

    // state to prevent useEffect from calling twice!
    var isPrint = false;

    // Retrieve area and email from local storage!
    const area = getStorage("area");
    const emailId = getStorage("emailId");
    const loggedInAsRecep = JSON.parse(getStorage("loggedInAsRecep"));
    const removePan = JSON.parse(getStorage("removePan"));
    const printManager = JSON.parse(getStorage("printManager"));
    
    // navigate back to home page!
    function navigateBack() {
        props.onHide && props.onHide();
    };

    // trigger print handler!
    function triggerPrint() {
        isPrint = true;
        window.print();
        navigateBack();
    }
    
    // Get invoice name!
    function getInvoiceName(){
      return props.node.invoiceName !== undefined ? props.node.invoiceName : props.node.customerName
    }
    
    // Common customer details!
    function customerDetails(){
      if(props.node.isQueryParams === 'true'){
          return (
              <div className="invoice-total">
                  <p>
                      Customer Name: {props.node.customername}
                  </p>
                  <p>
                      Phone Number: {props.node.phonenumber}
                  </p>
              </div>
          )
      } else {
          return (
              <div className="invoice-total">
                  <p>
                      Customer Name: {props.node.customerDetails.customername}
                  </p>
                  <p>
                      Phone Number: {props.node.customerDetails.phonenumber}
                  </p>
              </div>
          )
      }
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
      if(props.node.isQueryParams === 'true'){
          props.node.headerValue = _.split(props.node.headerValue, ',');
          if(!Array.isArray(props.node.cellValues)){
              props.node.cellValues = convertQueryParamsIntoObjects(props.node.cellValues);
          }
      }
      console.log(props.node)
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
                {!removePan && (
                  <p className="col">
                      PAN: {getStorage("pan")}
                  </p>
                )}
            </div>
        </div>
      )
    }

    // Tax invoice renderer!
    function invoiceRendererDetails() {

        return (
            <div className="left-align">
                <div>
                    Name: {getInvoiceName()}
                </div>
                <div>
                    Phone Number: {props.node.phoneNumber}
                </div>
                <div>
                    Address: {props.node.address}
                </div>
                <div>
                    GSTIN: {getStorage("gstin")}
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
    };
    
    // Is invoice propmpt triggered!
    function isInvoice(){
      if(props.node.invoice){
        return typeof props.node.invoice !== 'string' ? props.node.invoice : JSON.parse(props.node.invoice)
      };
    };
    
    // Is tInvoice propmpt triggered!
    function istInvoice(){
      if(props.node.tInvoice){
        return typeof props.node.tInvoice !== 'string' ? props.node.tInvoice : JSON.parse(props.node.tInvoice);
      }
    };

    // Amount renderer!
    function amountRenderer() {
        return (
            <div className="text-center invoice-total invoice-header-name">
                Amount
                <div className="table-view-bill-line"></div>                
                <div className="invoice-total">
                    <p>
                        Total Taxable Value: {props.node.taxableValue ? props.node.taxableValue() : props.node.totalTaxableValue}
                    </p>
                    {props.node.igst && props.node.igst !== 'undefined' && (
                        <p>
                            IGST {props.node.gstPercent * 100 + "%"} : {props.node.gst} 
                        </p>
                    )}
                    {props.node.cgst && (
                        <div>
                            <p>
                                CGST {(+props.node.gstPercent * 100 / 2) + "%"} : {+props.node.gst / 2}
                            </p>
                            <p>
                                SGST {(+props.node.gstPercent * 100 / 2) + "%"} : {+props.node.gst / 2}
                            </p>
                        </div>
                    )}
                    <div className="table-view-bill-line"></div>                
                    <p>
                        Grand Total: {props.node.amount ? props.node.amount() : props.node.totalAmount}
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
            <div className = "invoice">
              {/* Bill Generation */}
              {isInvoice() && (
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
                            This is the receipt for the payment of {props.node.amount && props.node.amount()} you made to {props.node.lodgeName}!
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
                            Date & Time of check-in: {props.node.dateofCheckIn} / {props.node.checkinTime}
                        </div>
                        <div className="invoice-total">
                            Date & Time of check-out: {props.node.dateofCheckout} / {props.node.checkoutTime}
                        </div>
                        <div className="invoice-total">
                            Payment Date: {props.node.dateofCheckout}
                        </div>
                        <div className="invoice-total">
                            Sub Total: {props.node.roomRent}
                        </div>
                        <div className="invoice-total">
                            Extra bed count: {props.node.extraBeds}
                        </div>
                        <div className="invoice-total">
                            Extra Bed Amount: {props.node.extraBedAmount}
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
                            Total Amount: {props.node.amount ? props.node.amount() : props.node.totalAmount}
                        </div>
                    </div>
                </div>
              )}
              
              {/* Tax invoice */}
              {istInvoice() && (
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
                                Time of check-in: {props.node.checkinTime}
                            </p>
                            <p className="invoice-total">
                                Date of check-out: {props.node.dateofCheckout}
                            </p>
                            <p className="invoice-total">
                                Time of check-out: {props.node.checkoutTime}
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
                          <div className = "authorized-guest-sign">
                              <div className = "text-center invoice-total">
                                  ""
                                  <div className = "invoice-total">
                                      Guest Signature
                                  </div>
                                </div>
                            </div>
                            <div className = "authorized-sign">
                                <div className = "text-center invoice-total">
                                    {printManager ? "Manager" : getStorage("owner-name")}
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
              {(props.node.isReceipt || props.node.isReceipt === 'true') && (
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