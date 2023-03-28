import React from 'react';
import {Triangle} from "react-loader-spinner";

const Loading = (props) => {
    return (
        <div className = "d-flex align-items-center justify-content-center">
            <div className = "top-align">
                <Triangle
                    height="150"
                    width="250"
                    radius="20"
                    color="white"
                    ariaLabel="loading"
                    wrapperStyle
                    wrapperClass
                />
                <p className = "text-center loading-message">{props.message}</p>
            </div>
            
        </div>
    )
}

export default Loading;