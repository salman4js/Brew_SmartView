import React from 'react';
import _ from "lodash";

class CustomConfigViewWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.options = props.options.options;
        this.state = {
            currentFieldData: undefined,
            selectedPanelItem: []
        };
    };

    templateHelpers(){
        return;
    };

    updateStateComponent(options){
        this.setState({[options.key]: options.value}, () => {
            _.isFunction(options.nextFunc) && options.nextFunc();
        });
    };

    render(){
        return this.templateHelpers();
    }
}

export default CustomConfigViewWrapper;