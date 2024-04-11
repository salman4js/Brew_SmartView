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
  dialogOptions.map((options) => {
      if(options.name === 'suiteName'){
          options.attribute = 'listField';
          options.readOnly = false;
          options.options = CollectionInstance.getAttribute('roomTypes', 'suiteType')
      }
  });
  return dialogOptions;
};

var dialogEditOptions = {
    'voucherTracker': (options) => voucherTrackerEditOptions(options),
    'multipleLogin': (options) => multipleLoginEditOptions(options),
    'roomAction': (options) => roomActionEditOptions(options)
};

export default dialogEditOptions;