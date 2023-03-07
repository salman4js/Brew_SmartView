import React from 'react'

const Values = (props) => {
    return (
        <div>
            <div>
                <li class="list-group-item">
                    <span className="text-handler cabinets">
                        {props.roomno}
                    </span>
                    <span className="text-handler dropdown" onClick={() => props.helperPanel(props.data, props.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
                            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                        </svg>
                    </span>
                </li>
            </div>
        </div>
    )
}

export default Values