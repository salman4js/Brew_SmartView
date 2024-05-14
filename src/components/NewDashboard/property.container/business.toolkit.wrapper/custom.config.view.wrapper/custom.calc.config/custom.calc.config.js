import React from "react";
import PanelItemView from "../../../../../SidePanelView/panel.item/panel.item.view";
import lang from "../../business.toolkit.constants";
import MetadataFieldsView from "../../../../../fields/metadata.fields.view";

class CustomCalcConfig extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            selectedPanelItem: [],
            currentFieldData: undefined
        }
        this.options = props.options.options;
    };

    onFieldClick(fieldOptions){
        this.state.selectedPanelItem.push(fieldOptions.name);
        this.setState({currentFieldData: fieldOptions});
    };

    _getAndSetFirstFieldModel(){
        !this.state.currentFieldData && this.setState({currentFieldData: this.options.stateOptions.fieldCenterTemplate[0]});
        return this.options.stateOptions.fieldCenterTemplate[0].name;
    };

    _getSelectedItem(){
        if(this.options.makeFirstItemSelected){
            if(this.state.selectedPanelItem.length > 0){
                return this.state.selectedPanelItem;
            } else {
                const firstTemplateItem = this._getAndSetFirstFieldModel();
                this.state.selectedPanelItem.push(firstTemplateItem);
                return [firstTemplateItem];
            }
        } else {
            return [];
        }
    };

    _renderFieldCustomizableCenter(){
        return this.options.stateOptions.fieldCenterTemplate.map((fieldOptions) => {
            if(fieldOptions.name === this.state.currentFieldData?.name){
                return <MetadataFieldsView data={[fieldOptions]}
                updateData={(updatedData) => this.options.stateUpdateOptions(updatedData, 'fieldCenterTemplate')}/>
            }
        });
    };

    templateHelpers() {
        return (
            <div className='business-toolkit-fieldcenter-wrapper'>
                <div className='business-toolkit-fieldcenter'>
                    <div
                        className='business-toolkit-fieldcenter-header text-center brew-cursor'>{lang[this.options.stateOptions.adminAction.configName].fieldControlTemplateHeader}</div>
                    {this.options.stateOptions.fieldCenterTemplate.map((fieldOptions) => {
                        return(
                            <PanelItemView data = {fieldOptions.clientName} _id = {fieldOptions.name} showIndentationArrow = {true}
                                           selectedItem = {this._getSelectedItem()} onClick = {() => this.onFieldClick(fieldOptions)}/>
                        )
                    })}
                </div>
                <div className = 'business-toolkit-field-control-center-wrapper'>
                    <div className = 'business-toolkit-field-control-center'>
                        {this.options.makeFirstItemSelected && this._renderFieldCustomizableCenter()}
                    </div>
                </div>
            </div>
        )
    };

    render(){
        return this.templateHelpers();
    };
}

export default CustomCalcConfig;