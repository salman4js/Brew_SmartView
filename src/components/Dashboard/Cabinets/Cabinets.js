import React from 'react';
import Values from './CabinetsValue/Values';

const Cabinets = (props) => {
    return (
        <div className="col-4">
            <div class="card card-container" style={{ width: '40vh'}}>
                <div class="card-header text-handler" style = {{fontWeight: "bold", fontSize: '18px'}}>
                    Upcoming Check-Outs
                </div>
                <div className="card-body-container">
                    <ul class="list-group list-group-flush">
                        {
                            props.data.map((options, key) => {
                                return (
                                    <Values username={options.username} helperPanel = {() => props.helperPanel()} />
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Cabinets;