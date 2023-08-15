import React from 'react';

// Net profit preview view for vouchers only if livixius linked with vouchers!
const NetProfitView = (props) => {
  return(
    <>
      <p style = {{color: "black", fontWeight: "bold", textDecoration: 'underline'}}>
        Cash Inflow
      </p>
      {props.data.isLinkedWithVouchers && (
        <p>
          Total Cash Inflow through livixius: {props.data.paymentTrackerSum}
        </p>
      )}
      <p>
        Total Cash Inflow as per vouchers: {props.data.voucherReceiptSum}
      </p>
      <p style = {{color: "black", fontWeight: "bold", textDecoration: 'underline'}}>
        Cash Outflow
      </p>
      <p>
        Total Cash Outflow as per vouchers: {props.data.voucherPaymentSum}
      </p>
      {props.data.isLinkedWithVouchers && (
          <p>
            Total Taxable Value: {props.data.paymentTrackerTaxableAmount}
          </p>
      )}
      
      <p style = {{color: "black", fontWeight: "bold", textDecoration: 'underline'}}>
        Net Profit
      </p>
      {props.data.isLinkedWithVouchers && (
        <p style = {{color: "green", fontWeight: "bold"}}>
          Net Profit: {props.data.netProfit}
        </p>
      )}
      {!props.data.isLinkedWithVouchers && (
        <p style = {{color: "green", fontWeight: "bold"}}>
          Net Profit: {props.data.netProfitWithoutLivixius}
        </p>
      )}
    </>
  )
}

export default NetProfitView;