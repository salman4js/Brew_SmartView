import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Variables from '../../../Variables';
import Spinner from '../../../Loader/Spinner';

const Values = (props) => {

    // State to handle the old version checkin's
    const [old, setOld] = useState();

    console.log(props.roomno);

    function checkOldVersion() {
        props.loaderState(true)
        // Fix for the old version checkin's
        if (props.roomno === undefined) {
            // Get roomno here by the ID
            axios.post(`${Variables.hostId}/${props.data.room}/getroomno`)
                .then(options => {
                    if (options.data.success) {
                        setOld(options.data.message);
                        props.loaderState(false)
                    } else {
                        // Error handling to update the build to the latest!
                    }
                })
        } else {
            props.loaderState(false);
        }
    }

    useEffect(() => {
        checkOldVersion()
    }, [])

    if (props.roomno !== undefined) {
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
    } else {
        return (
            <div>
                <div>
                    <li class="list-group-item">
                        <span className="text-handler cabinets">
                            {old}
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
}

export default Values