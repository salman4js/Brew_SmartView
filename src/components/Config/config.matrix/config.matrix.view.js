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
        </div>
    )
}

export default ConfigMatrix;