import React from 'react';
import MetadataTable from '../metadata.table.view/metadata.table.view';

// Net profit preview view for vouchers only if livixius linked with vouchers!
const NetProfitView = (props) => {
  
  // Render preview table view for inflow
  function _renderTableViewForInflow(){
    return(
      <div>
        <p style = {{color: "black", fontWeight: "bold", textDecoration: 'underline'}}>
          Cash Inflow Table View for Vouchers
        </p>
        <MetadataTable data = {props.tableDataForInflow} height = {500} />
      </div>
    )
  }
  
  // Render preview table view for outflow
  function _renderTableViewForOutflow(){
    return(
      <div>
        <p style = {{color: "black", fontWeight: "bold", textDecoration: 'underline'}}>
          Cash Outflow Table View for Vouchers
        </p>
        <MetadataTable data = {props.tableDataForOutFlow} height = {500} />
      </div>
    )
  }
  
  return(
    <div className = "net-profit-preview-modal">
      <div className = "row">
        <div className = 'col'>
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
        </div>
        <div className = "col">
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
        </div>
        <div className = "col">
          <p style = {{color: "black", fontWeight: "bold", textDecoration: 'underline'}}>
            Net Profit
          </p>
          {props.data.isLinkedWithVouchers && (
            <>
              <p style = {{color: "green", fontWeight: "bold"}}>
                Net Profit: {props.data.netProfit}
              </p>
              <p style = {{color: "green", fontWeight: "bold"}}>
                Net Profit Status: {props.data.netProfitStatus}
              </p>
            </>
          )}
          {!props.data.isLinkedWithVouchers && (
            <p style = {{color: "green", fontWeight: "bold"}}>
              Net Profit: {props.data.netProfitWithoutLivixius}
            </p>
          )}
        </div>
      </div>
      <div className = 'table-view-bill-line'></div>
      <div className = "row">
        <div className = "col">
          {_renderTableViewForInflow()}
        </div>
        <div className = "col">
          {_renderTableViewForOutflow()}
        </div>
      </div>
    </div>
  )
}

export default NetProfitView;