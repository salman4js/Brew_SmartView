import React from 'react';
import bwt from "brew-date";
import TableView from "../table.view/table.view";
import FacetsItemsFieldView from "../../../fields/facetItemsField/facets.items.field.view";
import MetadataFieldsView from "../../../fields/metadata.fields.view";
import CommonCrudController from "../../common.crud.controller/common.crud.controller";
import {arrangeObj, nodeConvertor} from "../../../common.functions/node.convertor";
import {convertServerFormat, formatCustomIntoDateFormat} from "../../../common.functions/common.functions";
import lang from './report.generation.wrapper.constants';
import './report.generation.wrapper.css';

class ReportGenerationWrapper extends TableView{
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            modelId: undefined,
            selectionFieldState: [{
                value: new Date(),
                defaultValue: new Date(),
                minDate: '',
                label: lang.selectionField.fromDate.label,
                placeholder: lang.selectionField.fromDate.placeholder,
                name: 'fromDate',
                conversionInNodeConvertor: true,
                conversionMethod: function(value){
                    return convertServerFormat(formatCustomIntoDateFormat(value));
                },
                style: {
                    width: '450px'
                },
                attribute: 'dateField',
                restrictShow: false,
                isRequired: false,
            }, {
                value: new Date(),
                defaultValue: new Date(),
                minDate: '',
                label: lang.selectionField.toDate.label,
                placeholder: lang.selectionField.toDate.placeholder,
                name: 'toDate',
                conversionInNodeConvertor: true,
                conversionMethod: function(value){
                    return convertServerFormat(formatCustomIntoDateFormat(value));
                },
                style: {
                    width: '450px'
                },
                attribute: 'dateField',
                restrictShow: false,
                isRequired: false,
            }, {
                btnValue: lang.selectionField.searchBtn.btnValue,
                onClick: () => this.onDateFilter(),
                isDark: false,
                occupyFullSpace: false,
                customClass: 'report-generation-selection-searchbtn-field',
                attribute: 'buttonField'
            }]
        }
        this.state.metadataTableState.tableLoader = true;
        this.state.metadataTableState.enableCheckbox = false;
        this.state.metadataTableState.infoMessage = lang.zeroStateMessage;
        this.widgetTileModel.data.widgetTileModelCount = {
            ...this.widgetTileModel.data.widgetTileModelCount,
            customReport: 0
        }
        this.roomConstant = lang.widgetName;
        this.options = this.props;
        this.shouldFetch = true;
        this.selectionFieldViewRef = React.createRef();
        this.selectionFieldViewWrapperRef = React.createRef();
    };

    _getSelectionDates(){
        const datesSelection = nodeConvertor(this.state.selectionFieldState);
        return {
            fromDate: datesSelection.fromDate || bwt.format(bwt.subDates(bwt.getFullDate("yyyy/mm/dd"), 6), 'yyyy/mm/dd'),
            toDate: datesSelection.toDate || bwt.getFullDate("yyyy/mm/dd")
        }
    };

    enableCustomHeaderView(){
        this._updateComponentState({key: 'customHeaderView', value: {isEnabled: true}});
    };

    fetchCustomReportsLists(modelId){
        this.shouldFetch = false; this.isFetching = true;
        const reportId = encodeURIComponent(JSON.stringify([modelId])),
            dates = this._getSelectionDates();
        return CommonCrudController.dispatchRequest({widgetName: this.roomConstant, accInfo: this.options.params.accIdAndName,
            method: 'get', query: {selectedNodes: reportId, fromDate: dates.fromDate, toDate: dates.toDate}}).then((response) => {
            if (response.data.success && response.data.statusCode === 200) {
                this.widgetTileModel.data.widgetTileModelCount.customReport = response.data.result.totalCount;
                this.requiredCellValue = response.data.result['customReportFields'].length > 0 && Object.keys(response.data.result['customReportFields'][0]);
                this.cellValueOrder = this.requiredCellValue;
                this.cellValues = response.data.result['customReportFields'];
                if(this.requiredCellValue.length > 0){
                    this.headerValues = Object.values(arrangeObj(response.data.result['customReportHeader'], this.requiredCellValue))
                }
                this.isFetching = false;
            }
        }).catch((err) => {
            this._prepareCustomModal({centered: false, header: lang.reportErrorMessage});
            console.warn('Internal error occurred', err);
        })
    };

    onDateFilter(){
        this._toggleTableLoader(true);
        this.shouldFetch = true;
    };

    getTableHeaders(){
        this.state.metadataTableState.headerValue = this.headerValues;
        return this.state.metadataTableState.headerValue;
    };

    async _prepareTableCellData(){
        if(this.shouldFetch && this.state.modelId){
            await this.fetchCustomReportsLists(this.state.modelId);
            return this.cellValues || [];
        }
    };

    async setExpandedTableView(){
        return await this._prepareTableCellData() || (!this.shouldFetch && !this.isFetching && this.cellValues);
    };

    _prepareFilterOptions() {
        const dates = this._getSelectionDates(),
            queryOptions = {selectedNodes: encodeURIComponent(JSON.stringify([this.state.modelId])),
            fromDate: dates.fromDate, toDate: dates.toDate, skipCount: this.widgetTileModel.paginationData.skipCount,
            limitCount: this.widgetTileModel.paginationData.limitCount};
        super._prepareFilterOptions(); // Don't send query in the params of this _prepareFilterOptions method because
        // _prepareFilterOptions method would consider as a table filter action and would check for pagination only based on the filtered collection length.
        this.filterOptions['accInfo'] = this.params.accIdAndName;
        this.filterOptions['widgetName'] = this.roomConstant;
        this.filterOptions['endPoint'] = 'read';
        this.filterOptions['query'] = queryOptions;
    };

    async fetchNextNode(){
        await super.fetchNextNode();
        this.rawRoomModel = this.nextNodeData.result['customReportFields'];
        this.widgetTileModel.data.widgetTileModelCount.customReport = this.nextNodeData.result.totalCount;
    };

    _prepareCustomHeaderViewTemplateData(){
        const self = this;
        return [{
            name: 'Refine Report By Date',
            facetPosition: 'body',
            onClickCallBack: function(isExpanded){
                !self.selectionFieldViewRef.current && self._toggleTableLoader(true, true);
                setTimeout(() => {
                    if(!isExpanded){
                        self.widgetTileModel.isHeightAdjustedForCustomHeaderView = false;
                        self._setHeightForCustomHeaderView({customHeaderViewHeight: self.selectionFieldViewRef.current?.offsetHeight})
                    } else {
                        self.widgetTileModel.isHeightAdjustedForPagination = false;
                        self._setHeightForCustomHeaderView({customHeaderViewHeight: self.selectionFieldViewWrapperRef.current?.offsetHeight})
                    }
                    self._toggleTableLoader(true, false);
                }, 0);
            },
            view: function(){
                return(
                    <div className = 'report-generation-selection-field-wrapper' ref = {self.selectionFieldViewRef}>
                        <MetadataFieldsView data = {self.state.selectionFieldState} updateData = {(updatedData) => self._updateComponentState({key: 'selectedFieldState', value: updatedData})}/>
                    </div>
                )
            }
        }]
    };

    _renderCustomHeaderView(){
        const customHeaderViewTemplateData = this._prepareCustomHeaderViewTemplateData();
        this.state.customHeaderView.isEnabled && this.state.customHeaderView.customHeaderViewHeight === undefined
        && this._setHeightForCustomHeaderView({customHeaderViewHeight: this.selectionFieldViewWrapperRef.current?.offsetHeight});
        return(
            <div ref = {this.selectionFieldViewWrapperRef}>
                <FacetsItemsFieldView options = {{bodyOptions: customHeaderViewTemplateData, isFooterEnabled: false, ignoreTreePref: true}}/>
            </div>
        )
    };

    componentDidUpdate(){
        if(this.state.modelId !== this.props.data?.adminAction?.modelId){
            this.enableCustomHeaderView();
            this._updateComponentState({key: 'modelId', value: this.props.data.adminAction.modelId});
        }
    };
}

export default ReportGenerationWrapper;