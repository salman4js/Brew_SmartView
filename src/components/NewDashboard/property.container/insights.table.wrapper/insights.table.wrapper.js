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
            selectedCollection: insightsTableWrapperConstants.defaultMode
        }
        this._prepareChartsDatasets();
    };

    _prepareChartsDatasets(){
        this._fetchChartCollection().then(() => {
            this.setState({loader: false});
        });
    };

    _updateComponentState(options){
      this.setState({[options.key]: options.value}, () => {
         _.isFunction(options.nextFunction) && options.nextFunction();
      });
    };

    _fetchChartCollection(){
        return new Promise((resolve, reject) => {
            var insightsUtils = new InsightsUtils({accId: this.props.params.accIdAndName[0]});
            insightsUtils.fetchInsightsCollections().then((result) => {
                if(!_.isEmpty(result)){
                    this._populateCollectionWithDataSet(result);
                    resolve();
                }
            }).catch(() => {
                reject();
            });
        });
    };

    _populateCollectionWithDataSet(chartData){
        this.insightDataSets = _.clone(InsightsDatasets);
        Object.keys(chartData).forEach((data) => {
            this.insightDataSets[data].labels = chartData[data].label;
            this.insightDataSets[data].datasets[0].data = chartData[data].data;
        });
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
        if(this.props.data.insightsReportMode && this.state.selectedCollection !== insightsTableWrapperConstants.reportModes[this.props.data.insightsReportMode]){
            this._updateComponentState({key: 'selectedCollection', value: insightsTableWrapperConstants.reportModes[this.props.data.insightsReportMode]});
        }
    };
}

export default InsightsTableWrapper;