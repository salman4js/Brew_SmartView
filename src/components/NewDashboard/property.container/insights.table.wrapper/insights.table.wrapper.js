import React from 'react';
import {activityLoader} from "../../../common.functions/common.functions.view";
import InsightsTableWrapperTemplate from "./insights.table.wrapper.template";
import insightsTableWrapperConstants from "./insights.table.wrapper.constants";
import InsightsUtils from "./insights.utils";
import InsightsDatasets from "./insights.datasets";
import _ from "lodash";

class InsightsTableWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: true,
            selectedCollection: insightsTableWrapperConstants.defaultMode,
            selectedDates: {
                fromDate: undefined,
                toDate: undefined
            },
            filters: undefined
        }
    };

    _prepareChartsDatasets(){
        if(!this.chartCollectionFetched){
            this.chartCollectionFetched = true;
            this._fetchChartCollection({filters: this.state.filters, selectedDates: this.state.selectedDates}).then((result) => {
                if(result && !_.isEmpty(result)){
                    this._populateCollectionWithDataSet(result);
                } else {
                    // Throw some error to the user that the insights fetching has been failed
                }
                this._toggleLoader(false);
            });
        }
    };

    _toggleLoader(val){
        this.setState({loader: val});
    };

    _updateComponentState(options){
      this.setState({[options.key]: options.value}, () => {
         options.nextFunction && _.isFunction(options.nextFunction) && options.nextFunction();
      });
    };

    _fetchChartCollection(options){
        return new Promise((resolve, reject) => {
            var insightsUtils = new InsightsUtils({accId: this.props.params.accIdAndName[0]});
            insightsUtils.fetchInsightsCollections(options).then((result) => {
                resolve(result);
            }).catch(() => {
                reject();
            });
        });
    };

    _populateCollectionWithDataSet(chartData){
        this.insightDataSets = _.clone(InsightsDatasets);
        this.insightDataSets.chartData.labels = chartData.label;
        this.insightDataSets.chartData.datasets[0].data = chartData.data;
    };

    templateHelpers(){
        !this.isStateRouterNotified && this._doInitializeAction();
        if(!this.state.loader){
            var insightsTableWrapper = new InsightsTableWrapperTemplate({data:this.insightDataSets, height: this.props.height, collection: this.state.selectedCollection});
            return insightsTableWrapper._renderInsightsView();
        } else {
            var opts = {
                color: "black",
                marginTop: (this.props.height / 2.5) + "px",
                textCenter: true
            }
            return activityLoader(opts);
        }
    };

    _doInitializeAction(){
        this.props.notifyStateRouter();
        this.isStateRouterNotified = true;
    };

    render(){
        return this.templateHelpers();
    };

    componentDidUpdate() {
        if(!this.props.data.insightsData?.date){
            this._prepareChartsDatasets();
        }
        if((this.props.data.insightsData?.date && !_.isEqual(this.state.selectedDates, this.props.data.insightsData.date))
            || this.props.data.insightsData?.filters && !_.isEqual(this.state.filters, this.props.data.insightsData.filters)){
            this.chartCollectionFetched = false;
            this._toggleLoader(true);
            this._updateComponentState({key: 'filters', value: this.props.data.insightsData.filters});
            this._updateComponentState({key:'selectedDates', value: this.props.data.insightsData.date, nextFunction: () => this._prepareChartsDatasets()});
        }
    };
}

export default InsightsTableWrapper;