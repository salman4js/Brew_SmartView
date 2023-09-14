export function templateHelpers(state){
  console.log(state);
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
    </div>
  )
};