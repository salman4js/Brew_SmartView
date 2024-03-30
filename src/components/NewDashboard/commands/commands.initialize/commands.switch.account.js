import lang from '../commands.constants';
import {getStorage} from "../../../../Controller/Storage/Storage";

class CommandsSwitchAccount {
    constructor(signatureOptions) {
        this.status = signatureOptions;
        this.isDisabled = !this.enabled();
        this.defaults = {
            value: lang.SWITCH_ACCOUNT.switchAccount,
            disabled: this.isDisabled,
            onClick: () => this.execute()
        }
    };

    isMultipleLoginEnabled(){
        return JSON.parse(getStorage('multipleLogin'));
    };

    enabled(){
        return lang.isCommandsEnabled.switchAccount.includes(this.status.roomConstantKey) && this.isMultipleLoginEnabled();
    };

    execute(){
        this.status.params.navigateInto({path: `/${this.status.params.id}/choose-login`})
    };
}

export default CommandsSwitchAccount;