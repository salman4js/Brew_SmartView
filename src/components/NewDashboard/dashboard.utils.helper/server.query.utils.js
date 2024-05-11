import {editOccupiedUserModel, editRoomModel} from "../../utils/checkin.form.utils";
import CommonUtils from "../common.crud.controller/common.crud.controller";

export function serverQueryUtils(){
    return {
        'edit-room-model': (options) => editRoomModel(options),
        'edit-user-model': (options) => editOccupiedUserModel(options),
        'admin-action-patch-custom-calc': (options) => CommonUtils.dispatchRequest(options),
        'admin-action-patch-custom-report': (options) => CommonUtils.dispatchRequest(options)
    }
};