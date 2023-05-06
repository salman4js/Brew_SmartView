import React from "react";


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
                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked = {props.isExtra} onChange = {() => props.handleExtra()} />
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
        </div>
    )
}

export default ConfigMatrix;