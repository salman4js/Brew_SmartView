import React from "react";


const Wizard = (props) => {
    return (
        <div className={`${props.class} wizardmodal`}>
            <label className="wizard-label">{props.label}</label>
            {props.close && (
                <span className="update-price-configured" onClick={() => props.onClose()}>
                    close
                </span>
            )}
            <input className="form-control" placeholder={props.placeholder} onChange={(e) => props.wizardInputChange(e.target.value)} />
        </div>
    )
}

export default Wizard;