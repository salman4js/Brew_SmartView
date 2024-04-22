import {getStorage} from "../../../../Controller/Storage/Storage";

var BusinessToolkitAvailableConfigList = Object.freeze({
    customConfigCalc: {
        value: 'Custom Config Calculation',
        data: 'customConfigCalc',
        restrictShow: JSON.parse(getStorage('customConfigCalc'))
    }
});

export default BusinessToolkitAvailableConfigList;
