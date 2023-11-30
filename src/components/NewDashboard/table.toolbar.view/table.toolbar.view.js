import React from 'react';
import setupCommandsInstances from "../commands/base.commands.setup";
import TableToolbarTemplate from "./table.toolbar.template";

class TableToolbarView extends React.Component {
    constructor(props) {
        super(props);
        this.options = props.options;
        this.baseCommands = setupCommandsInstances();
        this._prepareCommands();
    };

    // Not all commands will be enabled for all the extended table view.
    // Enable the commands based on the actions.
    _prepareCommands(){
        this.commands = this.baseCommands._getCommands();
    };

    templateHelpers(){
        this.template = new TableToolbarTemplate(this.commands);
        return this.template._renderTableMenuActionsView();
    };

    render(){
      return this.templateHelpers();
    };
}

export default TableToolbarView;