import React from 'react';
import {templateHelpers} from "./property.edit.template";

class PropertyEditView extends React.Component {
    constructor(props) {
        super(props);
    };

    templateHelpers(){
        return templateHelpers();
    };

    render(){
        return this.templateHelpers();
    };
}

export default PropertyEditView;