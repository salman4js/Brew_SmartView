import React from 'react';
import _ from "lodash";
import PanelItemView from "../../../SidePanelView/panel.item/panel.item.view";
import CommonCrudController from "../../common.crud.controller/common.crud.controller";
import {activityLoader} from "../../../common.functions/common.functions.view";

class SidepanelContainerReportGeneration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            reportsList: undefined,
            selectedItem: []
        }
        this.options = this.props.options;
    };

    templateHelpers(){
        if(this.state.isLoading){
            return activityLoader({color: "black", marginTop: (this.props.options.height / 4) + "px", textCenter: true});
        } else {
            return this._renderReportsList();
        }
    };

    getSelectedItem(){
        return this.state.selectedItem;
    };

    _toggleLoader(val){
        this.setState({isLoading: val});
    };

    populateReportsList(reportsList){
        this.updateStateComponent({key: 'reportsList', value: reportsList, nextFunc: () => this._toggleLoader(false)});
    };

    setFirstItemAsSelectedItem(firstReportItem){
        this.state.selectedItem.push(firstReportItem._id);
        this.updateStateComponent({key: 'selectedItem', value: this.state.selectedItem});
    };

    informDashboardController(firstReportItem){
        this.options.dashboardController({isAdminAction: true, adminAction: {modelId: firstReportItem._id}});
    };

    updateStateComponent(options){
        this.setState({[options.key]: options.value}, () => {
           options.nextFunc && _.isFunction(options.nextFunc) && options.nextFunc();
        });
    };

    fetchCustomizedReportsList(){
        CommonCrudController.dispatchRequest({widgetName: 'customConfigReport', accInfo: this.props.options.params.accIdAndName,
            method: 'get', query: {fields: 'configName'}}).then((response) => {
                if(response.data.success && response.data.statusCode === 200){
                    this.setFirstItemAsSelectedItem(response.data.result[0]);
                    this.populateReportsList(response.data.result);
                    this.informDashboardController(response.data.result[0]);
                }
        }).catch((err) => {
            console.warn('Internal error occurred!', err);
        });
    };

    _renderReportsList(){
        return this.state.reportsList.map((report) => {
           return <PanelItemView data = {report['configName']} _id = {report._id} selectedItem = {this.getSelectedItem()}/>
        });
    };

    render(){
        return this.templateHelpers();
    };

    componentDidMount(){
        if(this.state.isLoading){
            this.fetchCustomizedReportsList();
        }
    };
}

export default SidepanelContainerReportGeneration;