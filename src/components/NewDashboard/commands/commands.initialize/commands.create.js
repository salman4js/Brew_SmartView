import TableCreateActionDialog from "../../dialogs/table.create.action/table.create.action.dialog";
import lang from '../commands.constants';

class CommandsCreate {
    constructor(signatureOptions) {
        this.status = signatureOptions;
        this.isDisabled = !this.enabled();
        this.defaults = {
            icon: () => this.getCreateIcon(),
            disabled: this.isDisabled,
            onClick: () => this.execute(),
            signature: 'Command-Create'
        }
    };

    enabled(){
        if(lang.isCommandsEnabled.create.includes(this.status.roomConstantKey)){
            if(this.status.nodes) return !this.status.nodes.length > 0;
            if(!this.status.nodes) return true;
        }
    };

    execute(){
        const createActionFields = TableCreateActionDialog.execute(this.status);
        this.status.eventHelpers.triggerCommandExecution();
        this.status.eventHelpers.triggerCustomModel(createActionFields);
    };

    getCreateIcon(){
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                 className="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                <path
                    d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
            </svg>
        )
    };
}

export default CommandsCreate;