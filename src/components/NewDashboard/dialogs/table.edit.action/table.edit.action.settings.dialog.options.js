import dialogCreateOptions from "../table.create.action/table.create.action.settings.dialog.options";

function voucherTrackerEditOptions(options){
    return dialogCreateOptions['voucherTracker'](options);
};

function multipleLoginEditOptions(options){
  return dialogCreateOptions['multipleLogin'](options);
};

function roomActionEditOptions(options){
  return dialogCreateOptions['createRoomAction'](options);
};

var dialogEditOptions = {
    'voucherTracker': (options) => voucherTrackerEditOptions(options),
    'multipleLogin': (options) => multipleLoginEditOptions(options),
    'createRoomAction': (options) => roomActionEditOptions(options)
};

export default dialogEditOptions;