import React from 'react';
import MetadataFieldsView from "../../../fields/metadata.fields.view";
import lang from './business.toolkit.constants';
import './business.toolkit.template.css';
import CustomCalcConfig from "./custom.config.view.wrapper/custom.calc.config/custom.calc.config";
import CustomReportConfig from "./custom.config.view.wrapper/custom.report.config/custom.report.config";

const CustomConfigView = {
    customConfigCalc: (options) => <CustomCalcConfig options = {options} />,
    customConfigReport: (options) => <CustomReportConfig data = {options.options.tableData} height = {options.options.height}
    stateRouter = {options.options.stateRouter} routerController= {(opts) => options.options.routerController(opts)}
    configModel = {options.options} isStateRouterNotified = {true} params = {options.options.params}/>
}

class BusinessToolkitWrapperTemplate extends React.Component {
    constructor(props) {
        super(props);
        this.options = props.data;
    };

    _renderInfoMessage(){
        return(
            <>
                <div className='business-toolkit-info-header text-center'>
                    {lang[this.options.stateOptions.adminAction.configName].infoMessageHeader}
                </div>
                <div className='business-toolkit-info-container'>
                    <div className='business-toolkit-info-message'>
                        <pre>
                            {lang[this.options.stateOptions.adminAction.configName].infoMessage}
                        </pre>
                    </div>
                </div>
            </>
        )
    };

    render() {
        const CustomConfigTemplateView = CustomConfigView[this.options.stateOptions.adminAction.configName];
        return (
            <div className='business-toolkit-container' style={{height: this.options.height + "px"}}>
                <div className='business-toolkit-controlcenter'>
                    <MetadataFieldsView data={this.options.stateOptions.controlCenterTemplate}
                    updateData = {(updatedData) => this.options.stateUpdateOptions(updatedData, 'controlCenterTemplate')} />
                </div>
                <CustomConfigTemplateView options = {this.options}/>
                <div className= 'business-toolkit-info-wrapper'>
                    {this.options.showInfo && this._renderInfoMessage()}
                </div>
            </div>
        )
    };
}

export default BusinessToolkitWrapperTemplate;