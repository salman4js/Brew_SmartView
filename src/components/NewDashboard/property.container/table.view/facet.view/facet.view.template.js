import CommandHelperField from "../../../../fields/commandField/command.helper.field";
class FacetViewTemplate {
    constructor(state) {
        this.templateHelpers = state;
    };

    _renderFacetPanelContainer(){
        return <CommandHelperField data = {this.templateHelpers.facetValue} options = {this.templateHelpers.options} />
    };
}

export default FacetViewTemplate;