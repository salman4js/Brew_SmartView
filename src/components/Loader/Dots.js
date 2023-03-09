import React from 'react'

const Dots = (props) => {
    if(props.error){
        return (
            <div>
                <div class="dots">
                    <div class="bounce1"></div>
                    <div class="bounce2"></div>
                    <div class="bounce3"></div>
                </div>
                <div className="dots-error-text text-center">
                    <p className="dots-error-message">
                        {props.errortext}
                    </p>
                </div>
            </div>
        )
    }
}

export default Dots