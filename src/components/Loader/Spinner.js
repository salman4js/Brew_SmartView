import React from 'react'

const Spinner = (props) => {
    return (
        <div className="text-center">
            <div className="spinner" style = {{width: props.width, height: props.height}}>

            </div>
        </div>
    )
}

export default Spinner