import React from 'react';
import './sidepanel.container.insights.search.view.css';
import {nodeConvertor} from "../../../common.functions/node.convertor";
import MetadataFields from "../../../fields/metadata.fields.view";

class SidepanelContainerInsightsSearchView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: props.options,
            dateFields: [
                {
                    value: new Date(),
                    defaultValue: new Date(),
                    minDate: '',
                    width: '300px',
                    label: 'From',
                    placeholder: `Select 'from' date for selected report mode`,
                    name: 'fromDate',
                    attribute: 'dateField',
                    restrictShow: false,
                    isRequired: false,
                },
                {
                    value: new Date(),
                    defaultValue: new Date(),
                    minDate: '',
                    width: '300px',
                    label: 'To',
                    placeholder: `Select 'to' date for selected report mode`,
                    name: 'toDate',
                    attribute: 'dateField',
                    restrictShow: false,
                    isRequired: false,
                }
            ],
            buttonFields: [{
                btnValue: 'Search',
                onClick: this._initiateFormSearch.bind(this),
                isDark: true,
                occupyFullSpace: true,
                attribute: 'buttonField'
            }]
        }
    };

    templateHelpers(){
      return(
          <div className = 'insights-search-form' style = {{height: this.props.options.height + 'px'}}>
              <MetadataFields data = {this.state.dateFields} updateData = {(updatedData) => this.setState({dateFields: updatedData})}/>
              <span className = 'insights-search-form-button-fields'>
                  <MetadataFields data = {this.state.buttonFields}/>
              </span>
          </div>
      )
    };

    _initiateFormSearch(){
        var fieldData = nodeConvertor(this.state.dateFields);
        console.log(fieldData);
    };

    render(){
      return this.templateHelpers();
    };
}

export default SidepanelContainerInsightsSearchView;