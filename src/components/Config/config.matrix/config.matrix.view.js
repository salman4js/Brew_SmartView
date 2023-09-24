import React from "react";
import MetadataFields from '../../fields/metadata.fields.view'


const ConfigMatrix = (props) => {

    return (
        <div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked={props.isGst} onChange={() => props.handleGST()} />
                <label class="form-check-label" for="flexCheckDefault" style={{ color: "black" }}>
                    Enable / Disable GST
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked = {props.isHourly} onChange = {() => props.handleHourly()} />
                <label class="form-check-label" for="flexCheckDefault" style={{ color: "black" }}>
                    Hourly Basis
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked = {props.isChannel} onChange = {() => props.handleChannel()} />
                <label class="form-check-label" for="flexCheckDefault" style={{ color: "black" }}>
                    Enable Channel
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked = {props.updatePrice} onChange = {() => props.handlePrice()} />
                <label class="form-check-label" for="flexCheckDefault" style={{ color: "black" }}>
                    Update room price in checkin and checkout wizard
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked = {props.isExtra} onChange = {() => props.handleExtra(!props.isExtra)} />
                <label class="form-check-label dashboard-input" for="flexCheckDefault" style={{ color: "black" }}>
                    Extra Bed
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked = {props.gstMode.isExclusive} onChange = {() => props.gstMode.onChange(!props.gstMode.isExclusive)} />
                <label class="form-check-label dashboard-input" for="flexCheckDefault" style={{ color: "black" }}>
                    {props.gstMode.label}
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked = {props.insights.isEnable} onChange = {() => props.insights.onChange(!props.insights.isEnable)} />
                <label class="form-check-label dashboard-input" for="flexCheckDefault" style={{ color: "black" }}>
                    {props.insights.label}
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked = {props.specific.isEnable} onChange = {() => props.specific.onChange(!props.specific.isEnable)} />
                <label class="form-check-label dashboard-input" for="flexCheckDefault" style={{ color: "black" }}>
                    {props.specific.label}
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked = {props.optDelete.canDelete} onChange = {() => props.optDelete.onChange(!props.optDelete.canDelete)} />
                <label class="form-check-label dashboard-input" for="flexCheckDefault" style={{ color: "black" }}>
                    {props.optDelete.labelDelete}
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked = {props.extraBed.isDay} onChange = {() => props.extraBed.onChange(!props.extraBed.isDay)} />
                <label class="form-check-label dashboard-input" for="flexCheckDefault" style={{ color: "black" }}>
                    {props.extraBed.labelExtra}
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked = {props.grcHandler.isGrcEnabled} onChange = {() => props.grcHandler.onChange(!props.grcHandler.isGrcEnabled)} />
                <label class="form-check-label dashboard-input" for="flexCheckDefault" style={{ color: "black" }}>
                    {props.grcHandler.label}
                </label>
            </div>
            <div className = "form-check">
              <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked = {props.multipleLogin.isEnabled} onChange = {() => props.multipleLogin.onChange(!props.multipleLogin.isEnabled)} />
              <label class="form-check-label dashboard-input" for="flexCheckDefault" style={{ color: "black" }}>
                  {props.multipleLogin.label}
              </label>
            </div>
            <div className = "form-check">
              <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked = {props.refundTracker.isEnabled} onChange = {() => props.refundTracker.onChange(!props.refundTracker.isEnabled)} />
              <label class="form-check-label dashboard-input" for="flexCheckDefault" style={{ color: "black" }}>
                  {props.refundTracker.label}
              </label>
            </div>
            <div className = "form-check">
              <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked = {props.invoiceConfig.printManager} onChange = {() => props.invoiceConfig.onChange(!props.invoiceConfig.printManager, props.invoiceConfig.removePan, props.invoiceConfig.validateInvoiceDetails)} />
              <label class="form-check-label dashboard-input" for="flexCheckDefault" style={{ color: "black" }}>
                  {props.invoiceConfig.printManagerLabel}
              </label>
            </div>
            <div className = "form-check">
              <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked = {props.invoiceConfig.removePan} onChange = {() => props.invoiceConfig.onChange(props.invoiceConfig.printManager, !props.invoiceConfig.removePan, props.invoiceConfig.validateInvoiceDetails)} />
              <label class="form-check-label dashboard-input" for="flexCheckDefault" style={{ color: "black" }}>
                  {props.invoiceConfig.removePanLabel}
              </label>
            </div>
            <div className = "form-check">
              <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked = {props.invoiceConfig.validateInvoiceDetails} onChange = {() => props.invoiceConfig.onChange(props.invoiceConfig.printManager, props.invoiceConfig.removePan, !props.invoiceConfig.validateInvoiceDetails)} />
              <label class="form-check-label dashboard-input" for="flexCheckDefault" style={{ color: "black" }}>
                  {props.invoiceConfig.validateInvoiceDetailsLabel}
              </label>
            </div>
            <div className = "form-check">
              <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked = {props.restrictAdvance.isEnabled} onChange = {() => props.restrictAdvance.onChange(!props.restrictAdvance.isEnabled)} />
              <label class="form-check-label dashboard-input" for="flexCheckDefault" style={{ color: "black" }}>
                  {props.restrictAdvance.label}
              </label>
            </div>
            <div className = "form-check">
              <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked = {props.editableOptions.isEnabled} onChange = {() => props.editableOptions.onChange(!props.editableOptions.isEnabled)} />
              <label class="form-check-label dashboard-input" for="flexCheckDefault" style={{ color: "black" }}>
                  {props.editableOptions.label}
              </label>
            </div>
            <div className = "form-check">
              <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked = {props.showFullDetails.isEnabled} onChange = {() => props.showFullDetails.onChange(!props.showFullDetails.isEnabled)} />
              <label class="form-check-label dashboard-input" for="flexCheckDefault" style={{ color: "black" }}>
                  {props.showFullDetails.label}
              </label>
            </div>
            <div className = "form-check">
              <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked = {props.linkVouchersWithLivixius.isEnabled} onChange = {() => props.linkVouchersWithLivixius.onChange(!props.linkVouchersWithLivixius.isEnabled)} />
              <label class="form-check-label dashboard-input" for="flexCheckDefault" style={{ color: "black" }}>
                  {props.linkVouchersWithLivixius.label}
              </label>
            </div>
            <div className = "modal-gap"></div>
            <div className = "table-view-bill-line"></div>
            <div className = "form-check">
              <MetadataFields data = {props.redirectTo} updateData = {props.updateRedirectTo} />
            </div>
            <div className = "form-check">
              <MetadataFields data = {props.universalMessage} updateData = {props.updateUniversalMessage} />
            </div>
        </div>
    )
}

export default ConfigMatrix;