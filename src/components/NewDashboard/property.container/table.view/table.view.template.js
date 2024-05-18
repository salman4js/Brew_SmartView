import _ from 'lodash';
import MetadataTable from '../../../metadata.table.view/metadata.table.view';
import CustomModal from "../../../fields/customModalField/custom.modal.view";
import PaginationView from "./pagination.view/pagination.view";
import FacetView from "./facet.view/facet.view";
import TableToolbarView from "../../table.toolbar.view/table.toolbar.view";
import PopoverField from "../../../fields/popoverField/popover.field";

class TableViewTemplateHelpers {

    constructor(state){
        this.data = state?.templateHelpers;
    };

    _menuActionWrapper(commands){
        return commands && commands?.map((options) => {
            if(!options.disabled && _.isFunction(options.icon)){
                return(
                    <span className = "brew-tabletemplate-left-toolbar" onClick = {() => options.onClick(options)}>
                        {options.icon ? options.icon() : options.value}
                    </span>
                )
            }
        })
    };

    // Table property container left side controller!
    renderLeftSideController(){
        return(
            <div>
                {this.renderMenuActionItems({_menuActionWrapper: (commands) => this._menuActionWrapper(commands)})}
                {this.data?.options?.allowTableHeader && (
                    <span className='brew-statustableview-lefttoolbar-header' id='anchor-element'>
                    {this.data.options.selectedRoomConstant}
                        {this.data.options.allowHeaderControl && (
                            this._renderPopOverMenu()
                        )}
                </span>
                )}
            </div>
        );
    };

    // Render popover menu for the corresponding element.
    _renderPopOverMenu() {
        return <PopoverField data={{options: this.data.options}}/>
    };

    // Render table toolbar menu action items.
    renderMenuActionItems(options) {
        const hasMenuActionWrapper = options && _.isFunction(options._menuActionWrapper);
        return (
            <TableToolbarView
                options={this.data.options}
                customMenuActionView={hasMenuActionWrapper ? (commands) => options._menuActionWrapper(commands) : undefined}
            />
        );
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