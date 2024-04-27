import {getStorage} from "../../../../Controller/Storage/Storage";

var BusinessToolkitAvailableConfigList = Object.freeze({
    customConfigCalc: {
        value: 'Custom Config Calculation',
        data: 'customConfigCalc',
        method: 'admin-action-patch-custom-calc',
        restrictShow: JSON.parse(getStorage('isFormulaCustomizationEnabled'))
    }
});

export default BusinessToolkitAvailableConfigList;
