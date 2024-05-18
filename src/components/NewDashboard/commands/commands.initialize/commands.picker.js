import _ from "lodash";
import CommandsSelectedModel from "./commands.selected.model";
import lang from "../commands.constants";

class CommandsPicker extends CommandsSelectedModel {
    constructor(signatureOptions) {
        super(signatureOptions)
        this.status = signatureOptions;
        this.isDisabled = !this.enabled();
        this.defaults = {
            icon: () => this.getPickerIcon(),
            disabled: this.isDisabled,
            onClick: () => this.execute(),
            signature: 'Command-Picker'
        }
        this.tableState = {
            ...this.tableState
        }
        this.tableState.checkbox[0].disabledCheckboxIndex = _.clone(this.status.disabledCheckboxIndex) || [];
        this.tableState.checkbox[0].selectedCheckboxIndex = _.clone(this.status.disabledCheckboxIndex) || [];
    };

    enabled(){
        if(lang.isCommandsEnabled.picker.includes(this.status.roomConstantKey)){
            if(this.status.nodes) return !this.status.nodes.length > 0;
            if(!this.status.nodes) return true;
        }
    };

    execute(){
        super.execute();
    };

    _onUpdateCheckboxSelection(value, checkboxIndex){
        super._onUpdateCheckboxSelection(value, checkboxIndex);
        if(value){
            this.tableState.checkbox[0].selectedCheckboxIndex.push(checkboxIndex);
        } else {
            _.remove(this.tableState.checkbox[0].selectedCheckboxIndex, (node) => {
               return node === checkboxIndex;
            });
        }
    }

    onChangesApply() {
        this.status.eventHelpers.onChangesApply({checkboxSelection: this.statusNodes});
    };

    getPickerIcon(){
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                 className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                <path
                    d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
        )
    };
}

export default CommandsPicker;