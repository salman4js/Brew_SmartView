import lang from '../commands.constants';
import {clearStorage} from "../../../../Controller/Storage/Storage";

class CommandsLogout {
    constructor(signatureOptions) {
      this.status = signatureOptions;
      this.isDisabled = !this.enabled();
      this.defaults = {
          value: lang.LOG_OUT.logOut,
          disabled: this.isDisabled,
          onClick: () => this.execute()
      }
    };

    enabled(){
        return lang.isCommandsEnabled.logOut.includes(this.status.roomConstantKey);
    };

    execute(){
        clearStorage('livixius-cookies');
        this.status.params.navigateInto({path: '/startup'});
    };
}

export default CommandsLogout;