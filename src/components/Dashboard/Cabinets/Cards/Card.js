import React from 'react';

const Card = (props) => {
  return (
    <div className = "col-4" style = {{paddingBottom: '10px'}}>
        <div className = "card card-container" style = {{backgroundColor: 'rgb(23, 120, 83)', cursor: 'pointer'}} onClick = {() => props.navigate()}>
            <div className = "text-center text-handler text-font-handler">
                Check-In Rooms
            </div>
        </div>
    </div>
  )
}

export default Card;