import lang from "../commands.constants";
import CollectionInstance from "../../../../global.collection/widgettile.collection/widgettile.collection";
class CommandsGoTo {
    constructor(signatureKey) {
        this.isEnabled = this.enabled(signatureKey);
        this.defaults = {
            value: lang.goToLocationCommand,
            disabled: !this.isEnabled,
            onClick: (status) => this.execute(status)
        }
    };

    execute(status){
        // This command will take the perspective to the respective room state.
        this.status = status;
        this._getCollectionSearchKey();
        this.findTargetedModelAndPrepareOptions();
        status.options(this.controlOptions);
    };

    enabled(signatureKey){
      return lang.isCommandsEnabled.goToLocation.includes(signatureKey);
    };

    _getCollectionSearchKey(){
      var searchKeys = Object.keys(lang.PropertySearchKey),
          searchKey;
      for (var key of searchKeys){
          if(lang.PropertySearchKey[key].includes(this.status.roomConstant)){
              searchKey = key;
          }
      }
      this.searchKey = searchKey;
    };

    findTargetedModelAndPrepareOptions(){
        // Get the targeted room model from the collections.
        // Go to location command will always single node, hence targetedModel will also be only one.
        var targetedModel = CollectionInstance.whereInCollections('roomsListCollection', this.searchKey, this.status.nodes[0]);
        this.controlOptions = {goToLocation: true, roomModel: targetedModel[0]};
    };
}

export default CommandsGoTo;