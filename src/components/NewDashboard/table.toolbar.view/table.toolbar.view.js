import React from 'react';
import setupCommandsInstances from "../commands/base.commands.setup";
import TableToolbarTemplate from "./table.toolbar.template";

class TableToolbarView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          options: props.options
        };
        this._prepareCommands();
    };

    _prepareCommands(){
        this.baseCommands = setupCommandsInstances(this.state.options);
        this.commands = this.baseCommands._getCommands();
    };

    templateHelpers(){
        this.template = new TableToolbarTemplate(this.commands);
        return this.template._renderTableMenuActionsView();
    };

    _updateState(updatedData){
        this.setState({options: updatedData});
    };

    render(){
        this._prepareCommands();
        return this.templateHelpers();
    };

    componentDidUpdate() {
      if(this.state.options !== this.props.options){
          this._updateState(this.props.options);
      }
    };
}

export default TableToolbarView;