import TableFilterSettingsDialog from "../../dialogs/table.filter.settings/table.filter.settings.dialog";
import lang from '../commands.constants';

class CommandsFilter {
    constructor(signatureOptions) {
        this.status = signatureOptions;
        this.isDisabled = !this.enabled();
        this.defaults = {
            icon: () => this.getFilterIcon(),
            disabled: this.isDisabled,
            onClick: () => this.execute()
        }
    };

    enabled(){
        if(lang.isCommandsEnabled.filter.includes(this.status.roomConstantKey)){
            if(this.status.nodes) return !this.status.nodes.length > 0;
            if(!this.status.nodes) return true;
        }
    };

    execute(){
        this.status.eventHelpers.triggerCommandExecution();
        this.status.eventHelpers.triggerCustomModel(TableFilterSettingsDialog.execute(this.status));
    };

    getFilterIcon(){
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                 className="bi bi-funnel-fill" viewBox="0 0 16 16">
                <path
                    d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5z"/>
            </svg>
        )
    };
}

export default CommandsFilter;