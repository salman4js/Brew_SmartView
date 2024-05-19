import React from "react";
import MetadataFields from '../../fields/metadata.fields.view'


const ConfigMatrix = (props) => {

    return (
        <div>
            <div class="form-check">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked={props.isGst}
                       onChange={() => props.handleGST()}/>
                <label className="form-check-label" htmlFor="flexCheckDefault" style={{color: "black"}}>
                    Enable / Disable GST
                </label>
            </div>
            <div class="form-check">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"
                       checked={props.isHourly} onChange={() => props.handleHourly()}/>
                <label className="form-check-label" htmlFor="flexCheckDefault" style={{color: "black"}}>
                    Hourly Basis
                </label>
            </div>
            <div class="form-check">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"
                       checked={props.isChannel} onChange={() => props.handleChannel()}/>
                <label className="form-check-label" htmlFor="flexCheckDefault" style={{color: "black"}}>
                    Enable Channel
                </label>
            </div>
            <div class="form-check">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"
                       checked={props.updatePrice} onChange={() => props.handlePrice()}/>
                <label className="form-check-label" htmlFor="flexCheckDefault" style={{color: "black"}}>
                    Update room price in checkin and checkout wizard
                </label>
            </div>
            <div class="form-check">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"
                       checked={props.isExtra} onChange={() => props.handleExtra(!props.isExtra)}/>
                <label className="form-check-label dashboard-input" htmlFor="flexCheckDefault" style={{color: "black"}}>
                    Extra Bed
                </label>
            </div>
            <div class="form-check">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"
                       checked={props.gstMode.isExclusive}
                       onChange={() => props.gstMode.onChange(!props.gstMode.isExclusive)}/>
                <label className="form-check-label dashboard-input" htmlFor="flexCheckDefault" style={{color: "black"}}>
                    {props.gstMode.label}
                </label>
            </div>
            <div class="form-check">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"
                       checked={props.insights.isEnable}
                       onChange={() => props.insights.onChange(!props.insights.isEnable)}/>
                <label className="form-check-label dashboard-input" htmlFor="flexCheckDefault" style={{color: "black"}}>
                    {props.insights.label}
                </label>
            </div>
            <div class="form-check">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"
                       checked={props.specific.isEnable}
                       onChange={() => props.specific.onChange(!props.specific.isEnable)}/>
                <label className="form-check-label dashboard-input" htmlFor="flexCheckDefault" style={{color: "black"}}>
                    {props.specific.label}
                </label>
            </div>
            <div class="form-check">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"
                       checked={props.optDelete.canDelete}
                       onChange={() => props.optDelete.onChange(!props.optDelete.canDelete)}/>
                <label className="form-check-label dashboard-input" htmlFor="flexCheckDefault" style={{color: "black"}}>
                    {props.optDelete.labelDelete}
                </label>
            </div>
            <div class="form-check">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"
                       checked={props.extraBed.isDay} onChange={() => props.extraBed.onChange(!props.extraBed.isDay)}/>
                <label className="form-check-label dashboard-input" htmlFor="flexCheckDefault" style={{color: "black"}}>
                    {props.extraBed.labelExtra}
                </label>
            </div>
            <div class="form-check">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"
                       checked={props.grcHandler.isGrcEnabled}
                       onChange={() => props.grcHandler.onChange(!props.grcHandler.isGrcEnabled)}/>
                <label className="form-check-label dashboard-input" htmlFor="flexCheckDefault" style={{color: "black"}}>
                    {props.grcHandler.label}
                </label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"
                       checked={props.multipleLogin.isEnabled}
                       onChange={() => props.multipleLogin.onChange(!props.multipleLogin.isEnabled)}/>
                <label className="form-check-label dashboard-input" htmlFor="flexCheckDefault" style={{color: "black"}}>
                    {props.multipleLogin.label}
                </label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"
                       checked={props.refundTracker.isEnabled}
                       onChange={() => props.refundTracker.onChange(!props.refundTracker.isEnabled)}/>
                <label className="form-check-label dashboard-input" htmlFor="flexCheckDefault" style={{color: "black"}}>
                    {props.refundTracker.label}
                </label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"
                       checked={props.invoiceConfig.printManager}
                       onChange={() => props.invoiceConfig.onChange(!props.invoiceConfig.printManager, props.invoiceConfig.removePan, props.invoiceConfig.validateInvoiceDetails)}/>
                <label className="form-check-label dashboard-input" htmlFor="flexCheckDefault" style={{color: "black"}}>
                    {props.invoiceConfig.printManagerLabel}
                </label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"
                       checked={props.invoiceConfig.removePan}
                       onChange={() => props.invoiceConfig.onChange(props.invoiceConfig.printManager, !props.invoiceConfig.removePan, props.invoiceConfig.validateInvoiceDetails)}/>
                <label className="form-check-label dashboard-input" htmlFor="flexCheckDefault" style={{color: "black"}}>
                    {props.invoiceConfig.removePanLabel}
                </label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"
                       checked={props.invoiceConfig.validateInvoiceDetails}
                       onChange={() => props.invoiceConfig.onChange(props.invoiceConfig.printManager, props.invoiceConfig.removePan, !props.invoiceConfig.validateInvoiceDetails)}/>
                <label className="form-check-label dashboard-input" htmlFor="flexCheckDefault" style={{color: "black"}}>
                    {props.invoiceConfig.validateInvoiceDetailsLabel}
                </label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"
                       checked={props.restrictAdvance.isEnabled}
                       onChange={() => props.restrictAdvance.onChange(!props.restrictAdvance.isEnabled)}/>
                <label className="form-check-label dashboard-input" htmlFor="flexCheckDefault" style={{color: "black"}}>
                    {props.restrictAdvance.label}
                </label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"
                       checked={props.editableOptions.isEnabled}
                       onChange={() => props.editableOptions.onChange(!props.editableOptions.isEnabled)}/>
                <label className="form-check-label dashboard-input" htmlFor="flexCheckDefault" style={{color: "black"}}>
                    {props.editableOptions.label}
                </label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"
                       checked={props.showFullDetails.isEnabled}
                       onChange={() => props.showFullDetails.onChange(!props.showFullDetails.isEnabled)}/>
                <label className="form-check-label dashboard-input" htmlFor="flexCheckDefault" style={{color: "black"}}>
                    {props.showFullDetails.label}
                </label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"
                       checked={props.linkVouchersWithLivixius.isEnabled}
                       onChange={() => props.linkVouchersWithLivixius.onChange(!props.linkVouchersWithLivixius.isEnabled)}/>
                <label className="form-check-label dashboard-input" htmlFor="flexCheckDefault" style={{color: "black"}}>
                    {props.linkVouchersWithLivixius.label}
                </label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"
                       checked={props.customHtmlConfiguration.billPreview.isEnabled}
                       onChange={() => props.customHtmlConfiguration.onChange(!props.customHtmlConfiguration.billPreview.isEnabled, 'billPreview')}/>
                <label className="form-check-label dashboard-input" htmlFor="flexCheckDefault" style={{color: "black"}}>
                    {props.customHtmlConfiguration.billPreview.label}
                </label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"
                       checked={props.customHtmlConfiguration.historyPreview.isEnabled}
                       onChange={() => props.customHtmlConfiguration.onChange(!props.customHtmlConfiguration.historyPreview.isEnabled, 'historyPreview')}/>
                <label className="form-check-label dashboard-input" htmlFor="flexCheckDefault" style={{color: "black"}}>
                    {props.customHtmlConfiguration.historyPreview.label}
                </label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"
                       checked={props.customHtmlConfiguration.propertyReadRoom.isEnabled}
                       onChange={() => props.customHtmlConfiguration.onChange(!props.customHtmlConfiguration.propertyReadRoom.isEnabled, 'propertyReadRoom')}/>
                <label className="form-check-label dashboard-input" htmlFor="flexCheckDefault" style={{color: "black"}}>
                    {props.customHtmlConfiguration.propertyReadRoom.label}
                </label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"
                       checked={props.customHtmlConfiguration.billGeneration.isEnabled}
                       onChange={() => props.customHtmlConfiguration.onChange(!props.customHtmlConfiguration.billGeneration.isEnabled, 'billGeneration')}/>
                <label className="form-check-label dashboard-input" htmlFor="flexCheckDefault" style={{color: "black"}}>
                    {props.customHtmlConfiguration.billGeneration.label}
                </label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"
                       checked={props.customHtmlConfiguration.invoiceGeneration.isEnabled}
                       onChange={() => props.customHtmlConfiguration.onChange(!props.customHtmlConfiguration.invoiceGeneration.isEnabled, 'invoiceGeneration')}/>
                <label className="form-check-label dashboard-input" htmlFor="flexCheckDefault" style={{color: "black"}}>
                    {props.customHtmlConfiguration.invoiceGeneration.label}
                </label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"
                       checked={props.customAdminConfig.customCalc.isEnabled}
                       onChange={() => props.customAdminConfig.onChange(!props.customAdminConfig.customCalc.isEnabled, 'customCalc')}/>
                <label className="form-check-label dashboard-input" htmlFor="flexCheckDefault" style={{color: "black"}}>
                    {props.customAdminConfig.customCalc.label}
                </label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"
                       checked={props.customAdminConfig.customReport.isEnabled}
                       onChange={() => props.customAdminConfig.onChange(!props.customAdminConfig.customReport.isEnabled, 'customReport')}/>
                <label className="form-check-label dashboard-input" htmlFor="flexCheckDefault" style={{color: "black"}}>
                    {props.customAdminConfig.customReport.label}
                </label>
            </div>
            <div className="modal-gap"></div>
            <div className="table-view-bill-line"></div>
            <div className="form-check">
                <MetadataFields data={props.redirectTo} updateData={props.updateRedirectTo}/>
            </div>
            <div className="form-check">
                <MetadataFields data={props.universalMessage} updateData={props.updateUniversalMessage}/>
            </div>
        </div>
    )
}

export default ConfigMatrix;