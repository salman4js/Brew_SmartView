import lang from "../commands.constants";
import CommandsRoomTransfer from "./commands.room.transfer";
import CollectionInstance from "../../../../global.collection/widgettile.collection/widgettile.collection";

class CommandsFavoritesCheckin extends CommandsRoomTransfer {
    constructor(signatureOptions) {
        super(signatureOptions)
        this.status = signatureOptions;
        this.isDisabled = this.enabled();
        this.defaults = {
            value: lang.FAVORITES_CHECKIN.favoritesCheckin,
            disabled: this.isDisabled,
            onClick: () => this.execute()
        }
    };

    enabled(){
        return !(lang.isCommandsEnabled.favoritesCheckin.includes(this.status.roomConstantKey) && this.status.nodes.length === 1);
    };

    // Get the favorites userModel from the widgetTileCollections!
    _getTargetedModel() {
        this._prepareFavoritesOptions();
        this.state.userModel = CollectionInstance.whereInCollections('widgetTileCollections', 'favorites', '_id', this.status.nodes[0])[0];
        this.status.eventHelpers.updateSelectedModel(undefined, lang.FAVORITES_CHECKIN.dashboardMode, this.state.userModel);
        this.status.eventHelpers.onRoomTransfer(this.transferOptions);
    };

    // Prepare the options for favorites checkin.
    _prepareFavoritesOptions(){
        this.transferOptions['filterTableOptions'] = {
            extraColumnState: lang.FAVORITES_CHECKIN.favoritesCheckinKey,
            afterSave: (opts) => this.status.eventHelpers.dashboardController(opts)
        }
    };
}

export default CommandsFavoritesCheckin;