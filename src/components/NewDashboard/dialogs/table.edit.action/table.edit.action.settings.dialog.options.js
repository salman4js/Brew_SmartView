import dialogCreateOptions from "../table.create.action/table.create.action.settings.dialog.options";

function voucherTrackerEditOptions(options){
    return dialogCreateOptions['voucherTracker'](options);
};

function multipleLoginEditOptions(options){
  return dialogCreateOptions['multipleLogin'](options);
};

var dialogEditOptions = {
    'voucherTracker': (options) => voucherTrackerEditOptions(options),
    'multipleLogin': (options) => multipleLoginEditOptions(options)
};

export default dialogEditOptions;