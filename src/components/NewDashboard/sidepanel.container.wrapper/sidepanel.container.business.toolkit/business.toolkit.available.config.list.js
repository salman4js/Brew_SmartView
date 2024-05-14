import {getStorage} from "../../../../Controller/Storage/Storage";

var BusinessToolkitAvailableConfigList = Object.freeze({
    customConfigCalc: {
        value: 'Custom Config Calculation',
        data: 'customConfigCalc',
        method: 'admin-action-patch-custom-calc',
        restrictShow: () => {
            return !(JSON.parse(getStorage('isFormulaCustomizationEnabled')))
        }
    },
    customConfigReport: {
        value: 'Custom Report Generation',
        data: 'customConfigReport',
        method: 'admin-action-patch-custom-report',
        restrictShow: () => {
            return false;
        }
    }
});

export default BusinessToolkitAvailableConfigList;
