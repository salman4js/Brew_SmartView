import CardView from '../../../CardView/card.view/card.view';

// Default template helpers!
export function templateHelpers(data){
  return(
    <div>
      <div className="brew-greetings">
          <div className = "brew-greetings-message">
              {data.greetingMessage}
          </div>
          <div className = 'brew-greetings-breif-message'>
            Here's the breif idea of what's going on in your property!
          </div>
      </div>
      <div className = 'row widget-tile-container'>
        {data.state.widgetTile()}
      </div>
    </div>
  )
};

// <h3 className='heading-top topic-off'>
//     {state.params.accIdAndName[1]} - Dashboard
// </h3>
// <div className="btn btn-primary">
//     <span className="align-left">
//         Booked Rooms:
//         <span class="align-left-more badge text-bg-secondary">{state.data.reservedCount}</span>
//     </span>
//     <span className="align-left">
//         Free Rooms:
//         <span class="align-left-more badge text-bg-secondary">{state.data.countAvailability}</span>
//     </span>
//     <span className="align-left">
//         Total Rooms:
//         <span class="align-left-more badge text-bg-secondary">{state.data.totalCount}</span>
//     </span>
// </div>

// Widget tile template helpers!
export function widgetTileTemplateHelpers(widgetModel){
  return(
    <div className = 'col-2 widget-tile-listitem'>
      <CardView data = {widgetModel} />
    </div>
  )
};

// Widget body child view template helpers!
export function widgetTileBodyTemplateHelpers(stateCount){
  return(
    <div className = 'widget-tile-body'>
      {stateCount}
    </div>
  )
};

