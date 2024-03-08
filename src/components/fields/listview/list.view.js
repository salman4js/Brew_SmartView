import React from 'react';
import ListViewTemplate from "./list.view.template";

class ListView extends React.Component {
    constructor(props) {
        super(props);
        this.listViewTemplateData = this.props?.options?.templateData;
        this.listViewTemplate = new ListViewTemplate(this.props?.options?.templateHelpersData || {});
    };

    templateHelpers(){
      return this.listViewTemplate.onShow(this.listViewTemplateData);
    };

    render(){
        return this.templateHelpers();
    };
}

export default ListView;