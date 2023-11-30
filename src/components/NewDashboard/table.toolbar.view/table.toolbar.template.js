import CommandHelperField from "../../fields/commandField/command.helper.field";
class TableToolbarTemplate {
    constructor(options) {
      this.options = options;
    };

    _renderTableMenuActionsView(){
        return <CommandHelperField data = {this.options} />
    };
}

export default TableToolbarTemplate;