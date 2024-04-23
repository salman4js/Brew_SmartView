import React from 'react';
import PanelItemView from "../../../SidePanelView/panel.item/panel.item.view";
import MetadataFieldsView from "../../../fields/metadata.fields.view";
import lang from './business.toolkit.constants';
import './business.toolkit.template.css';

class BusinessToolkitWrapperTemplate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentFieldData: undefined,
            selectedPanelItem: []
        };
        this.options = props.data;
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
               return(
                   <MetadataFieldsView data = {[fieldOptions]} updateData = {(updatedData) => this.options.stateUpdateOptions(updatedData, 'fieldCenterTemplate')}/>
               )
           }
        });
    };

    _renderFieldControlCenter(){
        return (
            <div className = 'business-toolkit-fieldcenter-wrapper'>
                <div className='business-toolkit-fieldcenter'>
                    <div className = 'business-toolkit-fieldcenter-header text-center'>{lang.fieldControlTemplateHeader}</div>
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

    render() {
        return (
            <div className = 'business-toolkit-container' style = {{height: this.options.height + "px"}}>
                <div className='business-toolkit-controlcenter'>
                    <MetadataFieldsView data={this.options.stateOptions.controlCenterTemplate}
                    updateData = {(updatedData) => this.options.stateUpdateOptions(updatedData, 'controlCenterTemplate')} />
                </div>
                {this._renderFieldControlCenter()}
            </div>
        )
    };
}

export default BusinessToolkitWrapperTemplate;