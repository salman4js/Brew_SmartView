import React from 'react';
import FacetViewTemplate from "./facet.view.template";
import _ from "lodash";

class FacetView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: undefined,
            facetValue: undefined,
            options: {
                isFacets: true
            },
            isLoading: true
        };
        this.facetViewRef = React.createRef();
        this.isFacetsChanged = false;
        this.model = this.props.data; // Keep a local reference.
    };

    templateHelpers() {
        var facetViewTemplate = new FacetViewTemplate(this.state);
        if (!this.state.isLoading && !_.isEmpty(this.state.data.filterParam)) {
            return (
                <div ref={this.facetViewRef}>
                    {facetViewTemplate._renderFacetPanelContainer()}
                </div>
            )
        }
    };

    _toggleFacetLoader(val) {
        this._updateComponentState({ key: 'isLoading', value: val });
    };

    _getFacetViewHeight() {
        if(this.state.data?.originatingView){
            this.state.data.originatingView._setHeightForFacets({ facetsHeight: this.facetViewRef?.current?.clientHeight});
        }
    };

    _setIsFacetsChanged(val){
        this.isFacetsChanged = val;
    };

    onFacetClick(options) {
        this._setIsFacetsChanged(true);
        var facetsToRemove = Object.keys(options.currentFacetModel),
            facetsToKeep = _.omit(this.state.data.filterParam, facetsToRemove);
        this.state.data.originatingView._toggleTableLoader(true, false);
        this.state.data.originatingView.prepareFilterOptions(facetsToKeep);
        this._updateComponentState({key: 'data', value: {fieldProp: this.state.data.fieldProp,
                filterParam: facetsToKeep, originatingView: this.state.data.originatingView}}, this._prepareFacetValues.bind(this));
    };

    _prepareFacetValues() {
        var facetValue = [];
        Object.keys(this.state.data.fieldProp).forEach((field) => {
            var commandOptions = {};
            if (this.state.data.filterParam[field]) {
                commandOptions['value'] = `${this.state.data.fieldProp[field]}: ${this.state.data.filterParam[field]}`;
                commandOptions['onClick'] = (options) => this.onFacetClick(options);
                commandOptions['currentFacetModel'] = {[field]: this.state.data.filterParam[field]};
                facetValue.push(commandOptions);
            }
        });
        this._updateComponentState({ key: 'facetValue', value: facetValue }, this._toggleFacetLoader.bind(this, false));
    };

    _updateComponentState(state, nextFunction) {
        this.setState({ [state.key]: state.value }, async () => {
            _.isFunction(nextFunction) && await nextFunction();
        })
    };

    render() {
        return this.templateHelpers();
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if ((this.props.data !== this.state.data) && !this.isFacetsChanged) {
            this._updateComponentState({ key: 'data', value: this.props.data }, this._prepareFacetValues.bind(this));
        }
        this._getFacetViewHeight(); // componentDidMount lifecycle gets called even before the loading finishes
        // And since componentDidMount will be called only once, That time the facetViewRef current object will be null.
        // Hence, Put getting the height of the facet panel view logic in componentDidUpdate lifecycle method.
    };
}

export default FacetView;
