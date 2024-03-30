import connector from "../../utils/connector";
const Variables = require('../../Variables');

class CommonCrudController {
    // All the methods here would be static!
    static async DeleteController(options){
        var selectedNodes = encodeURIComponent(JSON.stringify(options.selectedNodes));
        return await connector.delete(`${Variables.Variables.hostId}/${options.accId}/${selectedNodes}/${options.widgetName}/delete`);
    };

    static async EditController(options){
        return await connector.put(`${Variables.Variables.hostId}/${options.accId}/${options.selectedNodes}/${options.widgetName}/edit`, options.data);
    };

    static async CreateController(options){
        return await connector.post(`${Variables.Variables.hostId}/${options.accId}/${options.widgetName}/create`, options.data);
    };
}

export default CommonCrudController;