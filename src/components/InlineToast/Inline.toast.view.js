import React from "react";

const InlineToast = (props) => {
    return(
        <small className = "inline-toast-view">
            {props.message}
        </small>
    )
}

export default InlineToast;