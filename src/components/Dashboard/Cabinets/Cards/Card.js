import React from 'react';

const Card = (props) => {
  return (
    <div className = "col-4" style = {{paddingBottom: '10px'}}>
        {props._node === "doclist" && (
          <div className = "card card-container" style = {{backgroundColor: 'rgb(23, 120, 83)', cursor: 'pointer'}} onClick = {() => props.navigate()}>
            <div className = "text-center text-handler text-font-handler">
                {props.message}
            </div>
          </div>
        )}
        {props._node === "revenue" && (
          <div className = "card card-container" style = {{backgroundColor: 'rgb(23, 120, 83)', cursor: 'pointer'}} onClick = {() => props.navigate()}>
            <div className = "text-center text-handler text-font-handler">
                <div>
                  ADR = {props.adr} rs / room 
                </div>
                <div>
                  RevPAR = {props.revpar} rs / room.
                </div>
            </div>
          </div>
        )}
    </div>
  )
}

export default Card;