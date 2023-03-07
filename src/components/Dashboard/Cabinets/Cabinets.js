import React from 'react';
import Values from './CabinetsValue/Values';

const Cabinets = (props) => {

    return (
        <div className="col-4">
            <div class="card card-container" style={{ width: '40vh'}}>
                <div class="card-header text-handler text-center" style = {{fontWeight: "bold", fontSize: '18px'}}>
                    {props.cabinetHeader}
                </div>
                <div className="card-body-container">
                    <ul class="list-group list-group-flush">
                        {
                            props.methodCall === "checkout" && (
                                    props.data.map((options, key) => { 
                                        if(options.roomno !== undefined){
                                            return (
                                                <Values roomno={options.roomno} data = {options} helperPanel = {(data, id) => props.helperPanel(data, id)} id = {props.methodCall} />
                                            )
                                        } else {
                                            return (
                                                <Values roomno={options.username} data = {options} helperPanel = {(data, id) => props.helperPanel(data, id)} id = {props.methodCall} />
                                            )
                                        }
                                    })
                            )
                        }
                        {
                            props.methodCall === "prebook" && (
                                    props.data.map((options, key) => {
                                        return (
                                            <Values roomno={options.roomno} data = {options} helperPanel = {(data, id) => props.helperPanel(data, id)} id = {props.methodCall} />
                                        )
                                    })
                            )
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Cabinets;