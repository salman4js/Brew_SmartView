import React from 'react';
import _ from 'lodash';
import {activityLoader} from "../../../common.functions/common.functions.view";
import propertyBaseConstants from "./property.base.constants";
import lang from '../../commands/commands.constants'
import {getParsedUrl} from "../../../common.functions/node.convertor";
import CommandsConnector from "../../commands/commands.connector";


// This class will be holding on the methods which will be commonly used by property read and property edit.
class PropertyBaseView extends React.Component {
    constructor(props) {
        super(props);
        this.isStateRouterNotified = false;
        this.routerController = this.props.routerController;
    };

    templateHelpers(){
      // Those who are using this base class, Override this templateHelpers to show their corresponding view
    };

    _triggerActivityLoader(){
        var opts = {
            color: "black",
            marginTop: (this.props.height / 2.5) + "px",
            textCenter: true
        };
        return activityLoader(opts);
    };

    _getPerspectiveConstant(){
        return propertyBaseConstants.PERSPECTIVE_CONSTANT;
    };

    _getCurrentViewMode(){
        return propertyBaseConstants.VIEW_CONSTANT;
    };

    // Notify the state router when the perspective is ready!
    _notifyStateRouter(){
        var opts = {
            routerOptions: {
                currentRouter: this._getPerspectiveConstant(),
                currentTableMode: this._getCurrentViewMode(),
                currentDashboardMode: this.props.data.dashboardMode,
                action: 'ADD'
            }
        };
        this.routerController()._notifyStateRouter(opts);
        this.isStateRouterNotified = true;
    };

    fetchHtmlContent(){
        var options = {
            accId: this.params.accIdAndName[0],
            filename: this.customTemplateFileName,
            templateName: this.roomConstantKey
        };
        if(getParsedUrl().hostname !== lang.LOCAL_SERVER){
            return CommandsConnector._getCustomHTMLContentFromDB(options).then((result) => {
                return result.data.data[0].customTemplate;
            }).catch(() => {
                console.warn('Error occurred while fetching dynamic html content');
            })
        } else {
            return CommandsConnector._getCustomHTMLContent(options).then((result) => {
                return result;
            }).catch(() => {
                console.warn('Error occurred while fetching dynamic html content')
            })
        }
    };

    _toggleComponentLoader(val){
        this.state.isTemplateFieldOptionsPopulated = val;
        this.setState({isTemplateFieldOptionsPopulated: val})
    };

    _updateComponentState(state, nextFunction){
        this.setState({[state.key]: state.value}, async () => {
            _.isFunction(nextFunction) && await nextFunction();
        })
    };

    render(){
        !this.isStateRouterNotified && this._notifyStateRouter();
        return this.templateHelpers();
    };

    componentDidUpdate(prevProps, prevState){
        if(this.props.data.propertyData !== this.state?.data){
            this._updateComponentState({key: 'data', value: this.props.data.propertyData}, this.populateTemplateFieldOptsObject.bind(this));
        }
    };

}

export default PropertyBaseView;