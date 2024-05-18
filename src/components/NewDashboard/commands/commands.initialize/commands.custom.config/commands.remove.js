import lang from '../../commands.constants';

class CommandsRemove {
    constructor(signatureOptions) {
        this.status = signatureOptions;
        this.isDisabled = !this.enabled();
        this.defaults = {
            value: lang.CUSTOM_CONFIG.customConfigReport,
            disabled: this.isDisabled,
            onClick: () => this.execute()
        }
    };

    enabled(){
        return lang.isCommandsEnabled.customConfigRemove.includes(this.status.roomConstantKey);
    };

    execute(){
        this.status.eventHelpers.triggerTableLoader(true, true);
        this.status.eventHelpers.updateCheckboxSelection();
        this.status.eventHelpers.removeFromTableCollection(this.status.nodes);
        setTimeout(() => {
            this.status.eventHelpers.triggerTableLoader(false);
        }, 100);
    };
}

export default CommandsRemove;