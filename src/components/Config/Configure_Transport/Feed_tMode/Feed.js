import React from 'react';

const Feed = (props) => {
  
  // Function to get the className based on the props!
  function getClassName(){
    return props.highlight && (props.selected === props.name) ? "row highlight-uicore" : "row"
  }

  return (
    <div>
      <div className="t_mode">
        <div className="reminder" style={{ color: "black" }}>
          <div className="col">
            <div className={getClassName()}>
              <div className="col-10" align="left">
                {props.name}
              </div>
              <div className="col">
                <i className="bi bi-bag-x-fill" onClick={() => props.onSelect(props.id, props.name)}>

                </i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Feed