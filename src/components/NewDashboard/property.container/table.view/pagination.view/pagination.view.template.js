class PaginationViewTemplate {
    constructor(paginationData, paginationEvents) {
        this.data = paginationData;
        this.events = paginationEvents;
        this.countArr = paginationData.countArr;
        this.renderBackwardIcon = paginationData?.countArr?.[0] !== 1;
    };

    _renderPageNumberBox(){
        return this.countArr && this.countArr.map((pageNumber, index) => {
            var isSelected = (pageNumber === this.data.selectedIndex);
            if(index + 1 <= 6){ // Right icon will be rendered only when the page count increases above 6 count.
                return (
                    <span key={index} className= {isSelected ? 'page-number-selected' : 'page-number-unselected'} onClick = {() => this.events.onPageShift(pageNumber)}>
                    {pageNumber}
                </span>
                );
            } else {
                this.renderForwrdIcon = true;
            }
        });
    };

    _renderForwardIcon(){
      return(
          <span className = 'page-number-unselected' onClick={() => this.events.onForwardShift()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-bar-right" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M6 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 7.5H6.5A.5.5 0 0 0 6 8m-2.5 7a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5"/>
              </svg>
          </span>
      )
    };

    _renderBackwardIcon(){
        return(
            <span className = 'page-number-unselected' onClick={() => this.events.onBackwardShift()}>
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-bar-left" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M12.5 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5M10 8a.5.5 0 0 1-.5.5H3.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L3.707 7.5H9.5a.5.5 0 0 1 .5.5"/>
            </svg>
          </span>
        )
    };

    _renderPaginationContainer(){
        return (
            <div className='pagination-container'>
                <div className='page-number-container text-center brew-cursor'>
                    {this.renderBackwardIcon && this._renderBackwardIcon()}
                    {this._renderPageNumberBox()}
                    {this.renderForwrdIcon && this._renderForwardIcon()}
                </div>
            </div>
        );
    };

    _render(){
        return this._renderPaginationContainer();
    }
}

export default PaginationViewTemplate;
