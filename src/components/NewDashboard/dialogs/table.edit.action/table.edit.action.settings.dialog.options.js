import dialogCreateOptions from "../table.create.action/table.create.action.settings.dialog.options";
import CollectionInstance from "../../../../global.collection/widgettile.collection/widgettile.collection";

function voucherTrackerEditOptions(options){
    return dialogCreateOptions['voucherTracker'](options);
};

function multipleLoginEditOptions(options){
  return dialogCreateOptions['multipleLogin'](options);
};

function roomActionEditOptions(options){
  var dialogOptions = dialogCreateOptions['roomAction'](options);
  dialogOptions.map((dOptions) => {
      if(dOptions.name === 'suiteName'){
          dOptions.value = options.suiteName
          dOptions.attribute = 'listField';
          dOptions.readOnly = false;
          dOptions.options = CollectionInstance.getAttribute('roomTypes', 'suiteType')
      }
  });
  return dialogOptions;
};

function roomTypeActionEditOptions(options){
    var dialogOptions = dialogCreateOptions['roomTypeAction'](options);
    dialogOptions.map((dOptions) => {
        if(dOptions.name === 'suiteType'){
            dOptions.name = undefined
            dOptions.value = options.suiteName;
            dOptions.readOnly = true;
        }
    });
    return dialogOptions;
}

var dialogEditOptions = {
    'voucherTracker': (options) => voucherTrackerEditOptions(options),
    'multipleLogin': (options) => multipleLoginEditOptions(options),
    'roomAction': (options) => roomActionEditOptions(options),
    'roomTypeAction': (options) => roomTypeActionEditOptions(options)
};

export default dialogEditOptions;