import CardView from '../../../CardView/card.view/card.view';

// Default template helpers!
export function templateHelpers(state){
  return(
    <div>
      <div className="text-center">
          <div>
              <h3 className='heading-top topic-off'>
                  {state.params.accIdAndName[1]} - Dashboard
              </h3>
              <div className="btn btn-primary">
                  <span className="align-left">
                      Booked Rooms:
                      <span class="align-left-more badge text-bg-secondary">{state.data.reservedCount}</span>
                  </span>
                  <span className="align-left">
                      Free Rooms:
                      <span class="align-left-more badge text-bg-secondary">{state.data.countAvailability}</span>
                  </span>
                  <span className="align-left">
                      Total Rooms:
                      <span class="align-left-more badge text-bg-secondary">{state.data.totalCount}</span>
                  </span>
              </div>
          </div>
      </div>
      <div className = 'row widget-tile-container'>
        {state.widgetTile()}
      </div>
    </div>
  )
};

// Widget tile template helpers!
export function widgetTileTemplateHelpers(widgetModel){
  return(
    <div className = 'col-2 widget-tile-listitem'>
      <CardView data = {widgetModel} />
    </div>
  )
};

// Widget body child view templat helpers!
export function widgetTileBodyTemplateHelpers(stateCount){
  return(
    <div className = 'widget-tile-body'>
      {stateCount}
    </div>
  )
};

