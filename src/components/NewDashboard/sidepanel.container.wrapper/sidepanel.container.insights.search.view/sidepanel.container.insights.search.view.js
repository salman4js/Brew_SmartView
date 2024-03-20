import React from 'react';
import _ from 'lodash';
import './sidepanel.container.insights.search.view.css';
import {nodeConvertor} from "../../../common.functions/node.convertor";
import MetadataFields from "../../../fields/metadata.fields.view";
import {convertServerFormat, formatCustomIntoDateFormat} from "../../../common.functions/common.functions";
import FacetsItemsFieldView from "../../../fields/facetItemsField/facets.items.field.view";
import CollectionInstance from "../../../../global.collection/widgettile.collection/widgettile.collection";

class SidepanelContainerInsightsSearchView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: props.options,
            dateFields: [
                {
                    value: this.props.options.insightsData?.date?.fromDate || new Date(),
                    defaultValue: new Date(),
                    minDate: '',
                    width: '300px',
                    label: 'From',
                    placeholder: `Select 'from' date for selected report mode`,
                    name: 'fromDate',
                    conversionInNodeConvertor: true,
                    conversionMethod: function(value){
                        return convertServerFormat(formatCustomIntoDateFormat(value));
                    },
                    attribute: 'dateField',
                    restrictShow: false,
                    isRequired: false,
                },
                {
                    value: this.props.options.insightsData?.date?.toDate || new Date(),
                    defaultValue: new Date(),
                    minDate: '',
                    width: '300px',
                    label: 'To',
                    placeholder: `Select 'to' date for selected report mode`,
                    name: 'toDate',
                    conversionInNodeConvertor: true,
                    conversionMethod: function(value){
                        return convertServerFormat(formatCustomIntoDateFormat(value));
                    },
                    attribute: 'dateField',
                    restrictShow: false,
                    isRequired: false,
                }
            ],
            checkboxFields: this._getRoomTypeFilters(),
            buttonFields: [{
                btnValue: 'Search',
                onClick: this._initiateFormSearch.bind(this),
                isDark: true,
                occupyFullSpace: true,
                attribute: 'buttonField'
            }]
        }
    };

    _prepareFacetsViewTemplateData(){
        var me = this;
        return [{
              name: 'Refine By Date',
              facetPosition: 'body',
              view: function () {
                  return (
                      <div className = 'insights-search-form'>
                          <MetadataFields data={me.state.dateFields}
                                          updateData={(updatedData) => me.setState({dateFields: updatedData})}/>
                      </div>
                  )
              }
        }, {
            name: 'Refine By Type',
            facetPosition: 'body',
            view: function(){
                return (
                    <div className='insights-search-form'>
                        <MetadataFields data={me.state.checkboxFields}
                                        updateData={(updatedData) => me.setState({checkboxFields: updatedData})}/>
                    </div>
                )
            }
        }, {
            facetPosition: 'footer',
            view: function () {
                return <MetadataFields data={me.state.buttonFields}/>
            }
        }];
    };

    _getRoomTypeFilters() {
        const checkboxFieldAttribute = {
                select: null,
                value: undefined,
                name: undefined,
                attribute: 'checkBoxField',
                updateValue: true,
                label: undefined,
                isLabelFirst: false,
                customStyle: {color: 'black'}
            },
            result = [],
            roomTypes = CollectionInstance.getAttribute('roomTypes', 'suiteType');
        roomTypes.forEach((type) => {
            if(this.props.options?.insightsData?.filters.includes(type)){
                checkboxFieldAttribute.value = true
            } else {
                checkboxFieldAttribute.value = false;
            }
            checkboxFieldAttribute.name = type;
            checkboxFieldAttribute.label = type
            result.push(_.clone(checkboxFieldAttribute));
        });
        return result;
    };

    templateHelpers(){
        var facetsViewOptions = this._prepareFacetsViewTemplateData();
        return <FacetsItemsFieldView options = {{bodyOptions: facetsViewOptions, isFooterEnabled: true, height: this.props.options.height }}/>
    };

    _initiateFormSearch(){
        var dateField = nodeConvertor(this.state.dateFields),
            checkboxField = nodeConvertor(this.state.checkboxFields),
            options = {
                isInsightsDataUpdated: true,
                insightsData: {
                    filters: Object.keys( _.omitBy(checkboxField, (value) => {
                        return (_.isNil(value) || value === false);
                    })),
                    date: {
                        fromDate: dateField.fromDate,
                        toDate: dateField.toDate
                    }
                }
            }
        this.state.options.dashboardController(options);
    };

    render(){
      return this.templateHelpers();
    };
}

export default SidepanelContainerInsightsSearchView;