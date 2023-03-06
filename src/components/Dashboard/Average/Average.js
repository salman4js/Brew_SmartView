import React from 'react'

const Average = (props) => {
  return (
    <div className = "container">
        <div className = "average-container text-center">
                {Math.round(props.average) + '%'}
        </div>
    </div>
  )
}

export default Average;