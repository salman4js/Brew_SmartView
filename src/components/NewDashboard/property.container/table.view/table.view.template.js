import MetadataTable from '../../../metadata.table.view/metadata.table.view';
import CustomModal from '../../../CustomModal/custom.modal.view';
import PaginationView from "./pagination.view/pagination.view";
import FacetView from "./facet.view/facet.view";
import TableToolbarView from "../../table.toolbar.view/table.toolbar.view";
import React from "react";

class TableViewTemplateHelpers {

    constructor(state){
        this.data = state;
    };

    // Table property container left side controller!
    renderLeftSideController(){
        return(
            <div>
                <span className = "brew-tabletemplate-left-toolbar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor"
                         className="bi bi-arrow-left" viewBox="0 0 16 16" onClick={() => this.data.options.onBack()}>
                    <path fillRule="evenodd"
                          d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                    </svg>
                </span>
                {this.data.options.allowTableFilterMode && (
                    <span className = 'brew-tabletemplate-left-toolbar'
                          onClick={() => this.data.options.onClickTableFilterMode()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-funnel-fill" viewBox="0 0 16 16">
                            <path
                                d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5z"/>
                        </svg>
                    </span>
                )}
                {this.data.options.allowCreateMode && (
                    <span className='brew-tabletemplate-left-toolbar'
                          onClick={() => this.data.options.onClickTableCreateMode()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                             className="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                          <path
                              d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
                        </svg>
                    </span>
                )}
                <span className='brew-statustableview-lefttoolbar-header'>
                    {this.data.options.selectedRoomConstant}
                </span>
            </div>
        );
    };

    // Render table toolbar menu action items.
    renderMenuActionItems() {
        return <TableToolbarView options={this.data.options}/>
    };

    _renderFacetContainer(facetOptions) {
        return <FacetView data={facetOptions}/>
    };

    // Table view template helpers!
    tableViewTemplateHelper(tableData, widgetData) {
        return (
            <>
                <div className='metadata-table-view-dashboard-container' style={{height: widgetData.height}}>
                    <MetadataTable data={tableData} height={widgetData.height}/>
                </div>
                <PaginationView data={widgetData.paginationData}/>
            </>
        )
    };

    // Render custom modal!
    _renderCustomModal(customModalOptions) {
        return <CustomModal modalData={customModalOptions}/>
    };

};

export default TableViewTemplateHelpers;