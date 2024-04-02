import lang from '../commands.constants';
import CollectionInstance from "../../../../global.collection/widgettile.collection/widgettile.collection";
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
        CollectionInstance.deleteAllCollections();
        this.status.params.navigateInto({path: `/${this.status.params.id}/choose-login`})
    };
}

export default CommandsSwitchAccount;