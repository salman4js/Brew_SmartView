import lang from '../commands.constants';
import {clearStorage} from "../../../../Controller/Storage/Storage";
import CollectionInstance from "../../../../global.collection/widgettile.collection/widgettile.collection";

class CommandsLogout {
    constructor(signatureOptions) {
      this.status = signatureOptions;
      this.isDisabled = !this.enabled();
      this.defaults = {
          value: lang.LOG_OUT.logOut,
          disabled: this.isDisabled,
          onClick: () => this.execute(),
          signature: 'Command-Logout'
      }
    };

    enabled(){
        return lang.isCommandsEnabled.logOut.includes(this.status.roomConstantKey);
    };

    execute(){
        CollectionInstance.deleteAllCollections();
        clearStorage('livixius-cookies');
        this.status.params.navigateInto({path: '/startup'});
    };
}

export default CommandsLogout;