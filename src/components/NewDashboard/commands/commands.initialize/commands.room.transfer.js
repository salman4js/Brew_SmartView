import lang from "../commands.constants";

class CommandsRoomTransfer {
    constructor(signatureOptions) {
        this.status = signatureOptions;
        this.isEnabled = this.enabled();
        this.defaults = {
            value: lang.roomTransferCommand,
            disabled: this.isEnabled,
            onClick: () => this.execute()
        }
    };

    execute(){
        this._prepareOptions();
        this.status.eventHelpers.onRoomTransfer(this.controlOptions);
    };

    enabled(){
        return !(lang.isCommandsEnabled.roomTransfer.includes(this.status.roomConstantKey) && this.status.nodes.length === 1);
    };

    _prepareOptions(){
      this.controlOptions = {
          navigateToStatusTableView: true,
          selectedRoomConstant: lang.ROOM_TRANSFER.filteredRoomStatusConstant,
          dashboardMode: lang.ROOM_TRANSFER.dashboardMode
      }
    };
}

export default CommandsRoomTransfer;