import lang from "../commands.constants";
import CollectionInstance from "../../../../global.collection/widgettile.collection/widgettile.collection";

class CommandsGoTo {
    constructor(signatureOptions) {
        this.status = signatureOptions;
        this.isDisabled = this.enabled();
        this.defaults = {
            value: lang.goToLocationCommand,
            disabled: this.isDisabled,
            onClick: () => this.execute()
        }
    };

    execute(){
        // This command will take the perspective to the respective room state.
        this._getCollectionSearchKey();
        this.findTargetedModelAndPrepareOptions();
        this.status.eventHelpers.dashboardController(this.controlOptions);
    };

    // Enable the commands based on the actions and signature value.
    enabled() {
        return !(lang.isCommandsEnabled.goToLocation.includes(this.status.roomConstantKey) && this.status.nodes.length === 1);
    };

    // Get the collection search key to search in the collection for targeted model.
    _getCollectionSearchKey(){
      var searchKeys = Object.keys(lang.PropertySearchKey),
          searchKey;
      for (var key of searchKeys){
          if(lang.PropertySearchKey[key].includes(this.status.roomConstantKey)){
              searchKey = key;
          }
      }
      this.searchKey = searchKey;
    };

    // Prepare options from the targeted model, let the dashboard.wrapper to handle the rest.
    findTargetedModelAndPrepareOptions(){
        // Get the targeted room model from the collections.
        // Go to location command will always single node, hence targetedModel will also be only one.
        var targetedModel = CollectionInstance.whereInCollections('roomsListCollection', undefined, this.searchKey, this.status.nodes[0]);
        this.controlOptions = {goToLocation: true, roomModel: targetedModel[0]};
    };
}

export default CommandsGoTo;