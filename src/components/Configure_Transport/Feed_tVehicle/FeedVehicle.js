import React from 'react'

const FeedVehicle = (props) => {
    return (
        <div>
            <div className="t_mode">
                <div style={{ color: "black" }}>
                        <div className="row">
                            <div className="col-sm-8" align = "left">
                                {props.vehicle}
                            </div>
                            <div className="col">
                                <div className='row'>
                                    <div className='col-2'>
                                        <i class="bi bi-bag-x-fill"></i>
                                    </div>
                                    <div className="col">
                                        <i class="bi bi-bag-check-fill"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    )
}

export default FeedVehicle