import React from 'react';
import './facets.items.field.css';
import {facetBodyFieldPanelTemplate} from "./facets.items.field.template";
class FacetsItemsFieldView extends React.Component {
    constructor(props) {
        super(props);
    };

    templateHelpers(){
      return facetBodyFieldPanelTemplate(this.props.options)
    };

    render(){
        return this.templateHelpers();
    };
}

export default FacetsItemsFieldView;