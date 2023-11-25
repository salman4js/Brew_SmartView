import React from 'react';
import './pagination.view.css';
import PaginationViewTemplate from "./pagination.view.template";

class PaginationView extends React.Component {
    constructor(props) {
        super(props);
        this.paginationData = {
            maxLimitPerPage: 15,
            count: props.data.count,
            pageCount: 0,
            selectedIndex: 1, // Default selected Index would be 1.
            countArr: undefined
        };
        this.incrementVal = 2;
        this.decrementVal = 2;
        this.templateHelpersEvents = {};
        this.setUpEvents();
        this.state = {
            paginationData: this.paginationData
        }
    };

    templateHelpers(){
        var paginationViewTemplate = new PaginationViewTemplate(this.state.paginationData, this.templateHelpersEvents);
        if(this.state.paginationData.pageCount > 0){ // This will make sure that the pagination view is getting rendered
            // If multiple pages are required to display the contents.
            return paginationViewTemplate._render();
        }
    };

    // Setting up the events for pagination view.
    setUpEvents(){
        this.templateHelpersEvents.onPageShift = this.onPageShift.bind(this);
        this.templateHelpersEvents.onForwardShift = this.onForwardShift.bind(this);
        this.templateHelpersEvents.onBackwardShift = this.onBackwardShift.bind(this);
    };

    // On page shift event.
    onPageShift(selectedPageNum){
        this.paginationData.selectedIndex = selectedPageNum;
        this._updateState('paginationData', this.paginationData);
        this.props.data.events.onPageShift(selectedPageNum);
    };

    // On forward shift event.
    onForwardShift(){
        var currentCount = this.paginationData.pageCount;
        this.paginationData.countArr = Array.from({ length: currentCount + 1}, (_, index) => index + this.incrementVal + 1)
            .filter(value => value <= this.paginationData.pageCount);
        this.incrementVal = this.incrementVal + 1;
        this.decrementVal = 2;
        this._updateState('paginationData', this.paginationData);
    };

    // ON backward shift event.
    onBackwardShift(){
        // FIXME: There is bug in me, fix me!
        var currentCount = this.paginationData.pageCount;
        if(this.decrementVal > 1){
            this.paginationData.countArr = Array.from({ length: currentCount - 1}, (_, index) => index + (this.decrementVal - 1));
            this.decrementVal = this.decrementVal - 1;
            this.incrementVal = 2;
            this._updateState('paginationData', this.paginationData);
        }
    };

    // Updating the state by key of the state.
    _updateState(stateKey, data){
        this.setState({[stateKey]: data});
    };

    componentDidUpdate(prevProps, prevState) {
      if(this.state.paginationData.count !== this.props.data.count){
          this.paginationData.pageCount = Math.ceil(this.props.data.count / this.paginationData.maxLimitPerPage);
          this.paginationData.count = this.props.data.count;
          this.paginationData.countArr = Array.from({ length: this.paginationData.pageCount }, (_, index) => index + 1)
          this._updateState('paginationData', this.paginationData);
      }
    };

    render(){
      return this.templateHelpers();
    };
}

export default PaginationView;