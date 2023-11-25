import TableView from "../property.container/table.view/table.view";
import HistoryTableUtils from "./history.table.utils";
import historyTableConstants from "./history.table.constants";

class HistoryTableView extends TableView {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            metadataTableState: {
                cellValues: undefined,
                headerValue: undefined,
                infoMessage: historyTableConstants.tableInfoMessage.ZERO_STATE_MESSAGE,
                tableLoader: false,
                selectedRoomId: undefined,
                isCheckboxSelected: false,
                enableCheckbox: false,
                tableCellWidth : "590px",
                showPanelField: false,
            }
        };
        this.params = props.params;
        this.utils = new HistoryTableUtils({accId: props.params.accIdAndName[0]});
    };
}

export default HistoryTableView;