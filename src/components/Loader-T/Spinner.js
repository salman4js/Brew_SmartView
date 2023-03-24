import React from 'react'

const Spinner = (props) => {
    return (
        <div className="d-flex align-items-center justify-content-center">
            <div className="top-align">
                <div className="spinner" style={{ width: props.width, height: props.height }}>

                </div>
            </div>
        </div>
    )
}

export default Spinner;